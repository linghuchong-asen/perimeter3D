<template>
  <div>
    <el-popover
      :width="300"
      placement="right"
      popper-class="handleWarn"
      :show-arrow="false"
      title="历史告警处置"
      :visible="handleWindow"
    >
      <template #reference>
        <el-button
          type="primary"
          size="small"
          round
          ref="infoButton"
          v-if="scope.row.operation === '处置'"
          @click="handleVisible"
          >{{ scope.row.operation }}
        </el-button>
      </template>
      <!-- 历史告警处置表单 -->
      <el-form
        :inline="true"
        :model="handleWarnForm"
        ref="handleWarnInstance"
        :rules="handelWarnRule"
      >
        <el-form-item label="处置描述: " prop="description">
          <el-input
            v-model="handleWarnForm.description"
            :rows="2"
            type="textarea"
            placeholder="请输入处置描述"
            style="max-height: 50px"
          />
        </el-form-item>
        <el-form-item label="处置类型: " prop="type">
          <el-select
            v-model="handleWarnForm.type"
            placeholder="请选择处置类型"
            size="small"
            class="selectLength"
            :teleported="false"
          >
            <el-option label="忽略" value="忽略" />
            <el-option label="人工处置" value="人工处置" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="scope.row.warnSate === '未消音'">
          <el-button
            type="primary"
            @click="
              handleWarnSubmit1(
                scope.row.number,
                scope.row.inputDevice,
                scope.row.defenceId
              )
            "
            >消音
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="
              handleWarnSubmit2(
                scope.row.number,
                scope.row.inputDevice,
                scope.row.defenceId
              )
            "
          >
            消警
          </el-button>
        </el-form-item>
      </el-form>
      <el-icon
        color="#97d0f6"
        :size="20"
        style="position: absolute; top: 5px; right: 10px; cursor: pointer"
        @click="hideHandle"
        ><Close
      /></el-icon>
    </el-popover>
    <!-- 处置信息popover -->
    <el-popover
      trigger="click"
      :width="250"
      placement="right"
      title="处置信息"
      popper-class="handleInfo"
      :show-arrow="false"
    >
      <template #reference>
        <el-button
          type="primary"
          size="small"
          round
          ref="infoButton"
          v-if="scope.row.operation === '信息'"
          @click="infoClick(scope.row.number)"
          >{{ scope.row.operation }}
        </el-button>
      </template>
      <div class="info">
        <div style="margin-bottom: 10px">
          <label>处置类型：</label>
          <span>{{ infoHandleType }}</span>
        </div>
        <div>
          <label>处置描述：</label>
          <span>{{ infoHandleDes }}</span>
        </div>
      </div>
    </el-popover>

    <el-button
      type="primary"
      size="small"
      round
      @click="
        operationFun(
          scope.row.defenceId,
          scope.row.startTime,
          scope.row.endTime
        )
      "
      >视频</el-button
    >
  </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, ref, watch } from "vue";
import { useVideoStore } from "@main/stores/videoStore";
import type { HandleWarnData } from "../realTime/realTime";
import { ElMessage, ElNotification, type FormInstance } from "element-plus";
import { getAssignAfter } from "@main/utils/index";
import { getFormateTime } from "@main/utils/index";
import {
  getAssignDefence,
  handleWarnSever,
  getAssignCamera,
  getDirectionInfo,
  type DirectionInfoData,
  type DirectionInfoParams,
  type AssignDefence,
  type HandleWarnSeverData,
  type AssignCamera,
} from "../../server";
import { useRequest } from "@main/utils/useRequest";
import { useWarnStore } from "@main/stores/warnStore";
import type {
  WarnHistoryParams,
  WarnHistoryData,
} from "@main/views/layout/components/header/serverType";
import { getWarnHistory } from "@main/views/layout/components/header/server";

const warnStore = useWarnStore();

interface Scope {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  column: any;
  $index: number;
}
const props = defineProps<{
  scope: Scope;
}>();

const emit = defineEmits<{
  (e: "changeValue", id: string, state: string, operation: string): void;
}>();

const scope = toRefs(props).scope;

/* -------------点击处置按钮---------------- */
// 处置弹窗的显隐属性
const handleWindow = ref(false);

// 点击处置按钮方法
const handleVisible = () => (handleWindow.value = true);
// 点击处置弹出窗的关闭图标
const hideHandle = () => (handleWindow.value = false);

// 处置表单绑定数据
const handleWarnForm = reactive<{ type: string; description: string }>({
  type: "",
  description: "",
});

// 处置表单提交数据：消音
const handleWarnData1 = reactive<HandleWarnData>({
  cfmtype: "", // 处置类型 忽略/人工处置
  cfmdesc: "", // 处置描述
  type: 1, //  处置方式 1：消音 2:消警
  cfmtime: "", // 处置时间
  alarmtype: "", // 告警类型 0 雷达告警 1海防  2.io告警
  obj_id: "", // 告警编号
  area: -1, // 防区id
});
// 处置表单提交数据：消警
const handleWarnData2 = reactive<HandleWarnData>({
  cfmtype: "", // 处置类型 忽略/人工处置
  cfmdesc: "", // 处置描述
  type: 2, //  处置方式 1：消音 2:消警
  cfmtime: "", // 处置时间
  alarmtype: "", // 告警类型 0 雷达告警 1海防  2.io告警
  obj_id: "", // 告警编号
  area: -1, // 防区id
});

// 处置表单实例
const handleWarnInstance = ref<FormInstance>();

// 处置表单验证规则
const handelWarnRule = {
  type: [{ required: true, trigger: "blur", message: "此项为必填项" }],
  description: [{ required: false, trigger: "blur", message: "此项为必填项" }],
};

// 处置表单提交事件：消音
const handleWarnSubmit1 = (No: string, type: string, defenceId: number) => {
  let alarmType!: string;
  switch (type) {
    case "微波雷达":
      alarmType = "0";
      break;
    case "海防":
      alarmType = "1";
      break;
    case "IO设备":
      alarmType = "2";
      break;
    default:
      break;
  }
  // 配置表单项
  handleWarnData1.cfmtime = getFormateTime();
  handleWarnData1.cfmtype = handleWarnForm.type;
  handleWarnData1.cfmdesc = handleWarnForm.description;
  handleWarnData1.obj_id = No;
  handleWarnData1.area = defenceId;
  handleWarnData1.alarmtype = alarmType;

  // 发送请求
  const data = useRequest<HandleWarnSeverData, HandleWarnData>(
    handleWarnSever,
    handleWarnData1
  );

  let count = 0;
  watch(data, () => {
    count++;
    if (data.value !== undefined) {
      if (count === 1) {
        ElMessage({ type: "success", message: "处置告警成功" });

        // 隐藏处置弹出框
        handleWindow.value = false;

        emit("changeValue", No, "已消音", "处置");
      }
    }
  });
};
// 处置表单提交事件：消警
const handleWarnSubmit2 = (No: string, type: string, defenceId: number) => {
  let alarmType!: string;
  switch (type) {
    case "微波雷达":
      alarmType = "0";
      break;
    case "海防":
      alarmType = "1";
      break;
    case "IO设备":
      alarmType = "2";
      break;
    default:
      break;
  }
  // 配置表单项
  handleWarnData2.cfmtime = getFormateTime();
  handleWarnData2.cfmtype = handleWarnForm.type;
  handleWarnData2.cfmdesc = handleWarnForm.description;
  handleWarnData2.obj_id = No;
  handleWarnData2.area = defenceId;
  handleWarnData2.alarmtype = alarmType;

  // 发送请求
  const data = useRequest<HandleWarnSeverData, HandleWarnData>(
    handleWarnSever,
    handleWarnData2
  );

  let count = 0;
  watch(data, () => {
    count++;
    if (data.value !== undefined) {
      if (count === 1) {
        ElMessage({ type: "success", message: "处置告警成功" });

        // 隐藏处置弹出框
        handleWindow.value = false;

        emit("changeValue", No, "已处置", "信息");
      }
    }
  });
};

/* -------------点击信息popover------------------ */

// 处置类型
const infoHandleType = ref<string>();

// 处置描述
const infoHandleDes = ref<string>();

// 点击信息按钮事件
const infoClick = (No: string) => {
  const data = useRequest<DirectionInfoData, DirectionInfoParams>(
    getDirectionInfo,
    { obj_id: No }
  );
  watch(data, () => {
    if (data.value !== undefined) {
      infoHandleType.value = data.value[0].cfmtype;
      infoHandleDes.value = data.value[0].cfmdesc;
    }
  });
};

/* ----------------播放历史视频----------------------- */
// 视频播放，全局状态
const videoStore = useVideoStore();

// 存放关联相机，联动相机数组
const cameraArr = reactive<number[]>([]);

// 获取指定防区函数,播放历史视频
const getDefenceFun = (
  defenceId: number,
  startTime: string,
  endTime: string
) => {
  const data = useRequest<AssignDefence, number>(getAssignDefence, defenceId);
  watch(data, () => {
    if (data.value !== undefined) {
      cameraArr.splice(0, cameraArr.length);
      data.value.tracecamera.forEach((item) => cameraArr.push(item));
      data.value.linkcamera.forEach((item) => cameraArr.push(item.id));

      // 判断联动，关联相机是否为空
      if (cameraArr.length === 0) {
        ElNotification({
          message: "没有联动或关联相机",
          type: "info",
        });
      } else {
        // 历史告警播放视频，报警开始时间往前30秒，报警结束时间往后30秒

        const historyStartTime = getAssignAfter(startTime, -30);
        const historyEndTime = getAssignAfter(endTime, 30);

        cameraArr.forEach((item, index) => {
          // 获取指定相机，判断form_nvr字段是否为null

          const data = useRequest<AssignCamera, number>(
            getAssignCamera,
            item,
            "联动或者关联相机设置不正确"
          );
          // 弹出信息的flag
          let messageFlag = 0;
          watch(data, () => {
            messageFlag++;
            if (data.value?.from_nvr !== null) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              videoStore.video.playHisSelect(
                index,
                item,
                historyStartTime,
                historyEndTime
              );
            } else {
              if (messageFlag === 1)
                ElMessage({
                  type: "error",
                  message: "联动或者关联相机设置不正确",
                });
            }
          });
        });
      }
    }
  });
};
// 点击视频按钮函数
const operationFun = (
  defenceId: number,
  startTime: string,
  endTime: string
) => {
  // 点击视频按钮处理逻辑
  getDefenceFun(defenceId, startTime, endTime);
};
</script>
<style lang="less" scoped></style>
