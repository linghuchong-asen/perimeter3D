<!--
 * @Description: 滚动条触发数据加载的table
 * @Author: yangsen
 * @Date: 2022-11-17 13:39:04
 * @LastEditors: yangsen
 * @LastEditTime: 2022-12-09 14:31:53
-->
<template>
  <div class="scroll-table" ref="scrollTableRef">
    <el-table
      :data="tableData"
      style="width: 100%"
      :max-height="150"
      class="scroll_table"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="showSelection"
        type="selection"
        align="center"
        width="60"
      />
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        align="center"
        width="60"
      />
      <el-table-column
        v-for="item in configHasProp"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :key="item.label"
      />
      <el-table-column
        v-for="item in configNoProp"
        :label="item.label"
        :width="item.width"
        :key="item.label"
        fixed="right"
        align="center"
      >
        <template #default="scope">
          <slot :slotProp="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
    <!-- 加载动画节点   -->
    <div class="loading-row" id="loading" v-show="false">
      <el-icon class="is-loading">
        <loading />
      </el-icon>
      加载中...
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, watch, toRefs } from "vue";
import { useWarnStore } from "@main/stores/warnStore";

const warnStore = useWarnStore();

const props = defineProps<{
  showIndex: boolean; // 是否显示序号
  showSelection: boolean; // 是否显示选择框
  tableConfigs: { label: string; prop?: string; width?: number }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData: any[];
  isLoading: boolean; // 加载请求数据完成的标识，由父组件决定
  isCompleted: boolean; // 全部加载完成的标志
}>();

const configHasProp = toRefs(props).tableConfigs.value.filter(
  (item) => item.prop !== undefined
);
const configNoProp = toRefs(props).tableConfigs.value.filter(
  (item) => item.prop === undefined
);

const emit = defineEmits(["selectionChange", "load"]);

// 	当选择项发生变化时会触发该事件
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleSelectionChange(event: any) {
  emit("selectionChange", event);
}

// 防抖开关
const toggle = ref(true);

function setLoading() {
  // 防抖
  if (toggle.value) {
    if (!toRefs(props).isCompleted.value) {
      appendLoading();
      // 触发请求事件
      emit("load");
    }
  }
}

// 关闭loading动画
watch(
  () => props.isLoading,
  (val) => {
    if (!val) {
      removeLoading();
    }
  }
);
watch(
  () => props.isCompleted,
  (val) => {
    if (val) {
      removeLoading();
    }
  }
);

// loading动画节点缓存
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let loadingTemp: any = null;
// table dom element
const scrollTableRef = ref();

// 添加加载图标
function appendLoading() {
  toggle.value = false;
  console.log("append");
  // 使用加载缓存，不需要每次加载都重新克隆一次
  if (!loadingTemp) {
    // 克隆动画节点
    const loading: HTMLDivElement | null = document.querySelector("#loading");
    loadingTemp = loading?.cloneNode(true);
  }
  nextTick(() => {
    loadingTemp.style.display = "flex";
    // 加载动画的节点宽度设置为表格宽度相等
    loadingTemp.style.width = scrollTableRef.value.clientWidth + "px";
    table?.appendChild(loadingTemp);
    // 出现加载动画的时候将滚动条滚动到最底部，完整呈现加载动画
    if (dom !== null) dom.scrollTop = dom.scrollHeight;
  });
}

// 移除加载图标
function removeLoading() {
  toggle.value = true;
  table?.removeChild(loadingTemp);
}

// 表格中需要滚动的节点缓存
let dom: HTMLDivElement | null = null;
// 需要添加动画节点的dom元素缓存
let table: HTMLTableSectionElement | null = null;
onMounted(() => {
  // 需要给改table加一个标识类，不然会选择到同一页面中的其他表格 class="scroll_table"
  dom = document.querySelector(".scroll_table .el-scrollbar__wrap");
  table = document.querySelector(".scroll_table .el-table__body tbody");
  // 添加监听事件
  if (dom !== null) {
    dom.addEventListener("scroll", () => {
      if (dom !== null) {
        const scrollDistance =
          dom.scrollHeight - dom.scrollTop - dom.clientHeight;
        if (scrollDistance <= 1) {
          console.log("loading...");
          // 添加动画
          setLoading();
        }

        // 记录滚动位置
        warnStore.historyScrollTop = dom.scrollTop;
      }
    });
  } else {
    console.error("未能获取到.el-table__body-wrapper元素");
  }
});
</script>

<style scoped lang="less">
.scroll-table {
  .scroll_table {
    border-radius: 5px;

    // 一些更据业务修改的样式
    ::v-deep .el-table__cell {
      background-color: #108b96;
      color: #fff;
    }

    ::v-deep thead th {
      color: #45465e !important;
    }
    ::v-deep .el-table tbody tr:hover > td {
      background: #f57878 !important;
    }
  }
  .loading-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 45px;
    color: rgba(102, 109, 128, 1);
    .is-loading {
      margin-right: 2px;
    }
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 100%;
    background-color: #fff;
  }
  ::-webkit-scrollbar-thumb {
    width: 6px;
    background-color: rgba(153, 153, 153, 1);
    border-radius: 3px;
  }
}
</style>
