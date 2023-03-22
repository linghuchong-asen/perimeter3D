<template>
  <div style="position: relative; height: 100%; width: 100%">
    <!-- 地图的容器 -->
    <div class="wrap" id="map"></div>
    <!-- 左下角坐标  -->
    <div class="myposition" id="myposition"></div>
    <!-- 点击图标弹窗 -->
    <div id="popup" class="ol-popup">
      <span id="popup-closer" class="ol-popup-closer"></span>
      <div id="popup-content" class="popup-content"></div>
    </div>
    <div class="fullScree" @click="cut()">
      <el-icon v-if="!videoFullScreen"><BottomRight /></el-icon>
      <el-icon v-if="videoFullScreen"><TopLeft /></el-icon>
    </div>
    <!-- 点击符号的弹窗容器；属性信息，历史视频表单 -->
    <div>
      <div id="historyVideo">
        <div class="header">
          <h4 class="title">历史回放</h4>
          <IconFont
            name="icon-guanbi"
            @click="historyClose"
            style="
              cursor: pointer;
              position: absolute;
              right: 18px;
              top: 11px;
              color: #97d0f6;
            "
          />
        </div>
        <div class="formContainer">
          <el-form
            :model="historyForm"
            ref="historyFormInstance"
            :rules="rules"
            class="historyForm"
          >
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="historyForm.startTime"
                type="datetime"
                placeholder="Pick a Date"
                format="YYYY/MM/DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                :teleported="false"
              />
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="historyForm.endTime"
                type="datetime"
                placeholder="Pick a Date"
                format="YYYY/MM/DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                :teleported="false"
              />
            </el-form-item>
            <!-- <el-form-item class="queryButton">
              <el-button type="primary" @click="playHistory">播放</el-button>
            </el-form-item> -->
          </el-form>
        </div>
      </div>
      <div id="propertyInfo"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, onMounted, reactive } from "vue";
// import IconFont from "@main/utils/Iconfont.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { drawModel, drawElement, drawDefence } from "./map.js";
import {
  getAlarmArea,
  elementProject,
  type AlarmArea,
  type ElementProject,
} from "./server";
import { getFormateTime, getHoursAfter } from "@main/utils/index";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { initMap } from "./map.js";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let map: any;

// 子组件向父组件传值ts写法
const emit = defineEmits<{ (e: "fullScreen", param: boolean): void }>();

// 切换全屏视屏
const videoFullScreen = ref(false);
const cut = () => {
  videoFullScreen.value = !videoFullScreen.value;
  emit("fullScreen", videoFullScreen.value);
  setTimeout(() => {
    map.updateSize();
  }, 1);
};

// 获取全部防区
(async () => {
  try {
    const alarmAreaData = await getAlarmArea();
    const { data, status } = alarmAreaData;
    if (status === 200 || status === 304) {
      const successData = data as AlarmArea[];
      for (let i = 0; i < successData.length; i++) {
        const alarmArea = successData[i];
        const geoData = alarmArea.shape.coordinates[0];
        // 画防区
        const drawParam = {
          position: geoData,
          thickness: alarmArea.thickness,
          height: alarmArea.height,
        };
        // drawDefence(drawParam);
      }
    } else {
      const errorData = data as { detail: string };
      ElMessage({ type: "error", message: errorData.detail });
    }
  } catch (error) {
    console.error("获取全部防区出错" + error);
  }
})();

// 获取全部要素
(async () => {
  try {
    const elementData = await elementProject(); // 没有加任何参数，把要素全部获取回来
    const { data, status } = elementData;
    if (status === 200 || status === 304) {
      const successData = (data as ElementProject[]).filter(
        (item) => item.level === 3 || 2 // level等于3的是全部要素,包括3D模型
      );
      for (let i = 0; i < successData.length; i++) {
        const ele = successData[i];
        const eleText = ele.name; // 要素名称
        if (ele.elementtype == "point") {
          try {
            const eleStyle = JSON.parse(ele.style);
            const ptGeo = eleStyle.cGeometry; // 要素位置
            if (ptGeo !== undefined) {
              const iconSymbol = eleStyle.iconSymbol;
              const textSymbol = eleStyle.textSymbol;
              const iconUrl = iconSymbol.Url; // 要素地址
              const regStr = /^http/;
              const iconSymbolFlag = regStr.test(iconUrl);
              if (iconSymbolFlag) {
                // 画要素
                const drawParam = {
                  position: {
                    longitude: ptGeo.X,
                    latitude: ptGeo.Y,
                    height: ptGeo.Z,
                  },
                  url: iconUrl,
                  text: {
                    text: eleText,
                    fill: textSymbol.Fill,
                    fontSize: textSymbol.Size,
                  },
                };
                drawElement(drawParam);
              }
            }
          } catch (error) {
            continue; // 跳出本次循环，和try catch结合使用
          }
        } else if (ele.elementtype == "model") {
          // TODO:这里还有一个问题没有解决，编辑器中只能加载osgb格式文件，不能加载glb，所以不能直接使用后端json数据中的url
          // 3D模型
          try {
            const eleStyle = JSON.parse(ele.style);
            const ptGeo = eleStyle.cGeometry; // 模型的经纬度高程坐标
            if (ptGeo !== undefined) {
              // 模型路径，模型的路径直接从上传模型的工具处获取；只需要从后端数据库中拿到模型的位置及姿态数据
              const modelSymbol = eleStyle.modelSymbol;
              const { ScaleX, ScaleY, ScaleZ, Roll, Picth, Heading } =
                modelSymbol;
              const drawParam = {
                position: {
                  longitude: ptGeo.X,
                  latitude: ptGeo.Y,
                  height: ptGeo.Z,
                },
                scale: { x: ScaleX, y: ScaleY, z: ScaleZ },
                pitch: Picth,
                roll: Roll,
                heading: Heading,
                name: eleText,
              };
              drawModel(drawParam);
            }
          } catch (error) {
            continue; // 跳出本次循环，和try catch结合使用
          }
        }
      }
    } else {
      const errorData = data as { detail: string };
      ElMessage({
        type: "error",
        message: errorData.detail,
      });
    }
  } catch (error) {
    console.error("获取全部要素出错" + error);
  }
})();

onMounted(() => {
  // 初始化地图
  initMap("map");
});

/* ------------------播放历史视频-------------------------- */
// 表单实例
const historyFormInstance = ref();

// 表单验证规格
const rules = reactive({
  startTime: [{ required: false, trigger: blur, message: "此项为必填项" }],
  endTime: [{ required: false, trigger: blur, message: "此项为必填项" }],
});

const historyForm = reactive<{
  startTime: string;
  endTime: string;
}>({
  startTime: getHoursAfter(-1),
  endTime: getFormateTime(),
});

/* const playHistory = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  historyFormInstance.value.validate((valid: boolean, validFiles: any) => {
    if (valid) {
      playHistoryTime(historyForm.startTime, historyForm.endTime);
    } else {
      console.log(validFiles);
      ElMessage({
        type: "error",
        message: "表单验证未通过",
      });
    }
  });
}; */

// 关闭历史回放窗口
const historyClose = () => {
  document.getElementById("historyVideo")?.style.setProperty("display", "none");
  historyFormInstance.value.resetFields();
  historyForm.startTime = getHoursAfter(-1);
  historyForm.endTime = getFormateTime();
};
</script>
<style lang="less" scoped>
.fullScree {
  position: absolute;
  bottom: 0;
  right: 0;
  color: transparent;
  font-size: 24px;
  z-index: 99999;
}
.fullScree:hover {
  cursor: pointer;
  color: red;
}
#propertyInfo {
  display: none;
  position: absolute;
  min-width: 400px;
  width: 50%;
  height: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  background-image: url(../../../public/image/mapbg_proprety_layer.png);
  background-size: 100% 100%;
}
#historyVideo {
  display: none;
  position: absolute;
  min-width: 350px;
  width: 45%;
  height: 40%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
  background-image: url(../../../public/image/mapbg_proprety_layer.png);
  background-size: 100% 100%;

  .formContainer {
    position: absolute;
    background-color: #18376e;
    width: 93%;
    height: 80%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -44%);
  }

  .historyForm {
    position: absolute;
    left: 2%;
    top: 10%;

    ::v-deep .el-form-item__label {
      color: #97d0f6;
    }
  }

  .title {
    position: absolute;
    left: 5%;
    top: 3%;
    color: #97d0f6;
  }
}
</style>
