<!--
 * @Description: 历史告警展示组件
 * @Author: yangsen
 * @Date: 2022-09-08 17:14:36
 * @LastEditors: yangsen
 * @LastEditTime: 2022-12-09 16:20:30
-->
<template>
  <div>
    <ScrollTable
      :table-data="tableData"
      :table-configs="tableConfig"
      :show-index="true"
      :show-selection="false"
      :is-loading="isLoading"
      :is-completed="isCompleted"
      @load="loadTableData"
    >
      <template #default="scope">
        <OperationPage
          :scope="scope.slotProp"
          @change-value="
            (id, state, operation) => {
              updateRow(id, state, operation);
            }
          "
        />
      </template>
    </ScrollTable>
  </div>
</template>
<script lang="ts" setup>
import { useWarnStore } from "@main/stores/warnStore";

import { getWarnHistory } from "@main/views/layout/components/header/server";
import ScrollTable from "@main/utils/ScrollTable.vue";
import { ref, reactive, watch, toRef } from "vue";
import type { TableData } from "./histotyWarn";
import OperationPage from "./OperationPage.vue";
import { ElMessage } from "element-plus";

// 历史告警查询结果，全局状态
const warnStore = useWarnStore();

// table绑定数据
const tableData = reactive<TableData>([]);

// table列配置
const tableConfig = [
  { label: "告警编号", prop: "number", width: 180 },
  { label: "输入设备", prop: "inputDevice", width: 80 },
  { label: "设备名称", prop: "deviceName", width: 120 },
  { label: "防区名称", prop: "defenceName", width: 150 },
  { label: "告警状态", prop: "warnSate", width: 80 },
  { label: "操作人", prop: "operationUser", width: 80 },
  { label: "告警时间", prop: "time", width: 300 },
  { label: "操作", width: 180 },
];

// 请求历史告警数据的标识
const isLoading = ref<boolean>(true);
// 数据全部加载完成的标识
const isCompleted = ref<boolean>(false);

// 输入设备
const inputDevice = (item: number) => {
  switch (item) {
    case 0:
      return "微波雷达";
    case 1:
      return "海防";
    case 2:
      return "IO设备";
    default:
      return "无";
  }
};
watch(isLoading, () => {
  console.log("父组件中isLoading变化了");
});

/* -------------配置table数据------------------- */
// 告警查询表单获得的table显示数据
watch([toRef(warnStore, "historyWarn")], () => {
  tableData.splice(0, tableData.length);
  isCompleted.value = false;
  warnStore.historyWarn.forEach((item) => {
    // 告警状态 已处置显示为已处置；未处置分两种情况：未消音和未消警
    let state;
    if (item.cfmtype === 2) {
      state = "已处置";
    } else if (item.cfmtype === 1) {
      state = "未消警";
    } else {
      state = "未消音";
    }

    // 操作人姓名
    const userName = item.username === null ? "无" : item.username;

    // 操作第一个按钮显示的文字
    let firstButton;
    if (item.cfmtype === 2) {
      firstButton = "信息";
    } else {
      firstButton = "处置";
    }

    tableData.push({
      number: item.obj_id, // 告警编号
      inputDevice: inputDevice(item.devtype), // 输入类型
      deviceName: item.devname,
      defenceName: item.alarmarea_name,
      warnSate: state,
      operationUser: userName,
      operation: firstButton,
      time: `${item.starttime} -- ${item.endtime}`,
      defenceId: item.alarmarea, // 防区id
      startTime: item.starttime, // 开始时间
      endTime: item.endtime, // 结束时间
    });
  });
});

// table滚动条加载数据
const loadTableData = async () => {
  isLoading.value = true;
  warnStore.increasePage();
  try {
    const dataSource = await getWarnHistory(warnStore.historyQueryForm);
    const { data, status } = dataSource;
    if (status === 200) {
      const successData = data;
      // 请求成功，push进tableData
      successData.results.forEach((item) => {
        // 告警状态 已处置显示为已处置；未处置分两种情况：未消音和未消警
        let state;
        if (item.cfmtype === 2) {
          state = "已处置";
        } else if (item.cfmtype === 1) {
          state = "未消警";
        } else {
          state = "未消音";
        }

        // 操作人姓名
        const userName = item.username === null ? "无" : item.username;

        // 操作第一个按钮显示的文字
        let firstButton;
        if (item.cfmtype === 2) {
          firstButton = "信息";
        } else {
          firstButton = "处置";
        }

        tableData.push({
          number: item.obj_id, // 告警编号
          inputDevice: inputDevice(item.devtype), // 输入类型
          deviceName: item.devname,
          defenceName: item.alarmarea_name,
          warnSate: state,
          operationUser: userName,
          operation: firstButton,
          time: `${item.starttime} -- ${item.endtime}`,
          defenceId: item.alarmarea, // 防区id
          startTime: item.starttime, // 开始时间
          endTime: item.endtime, // 结束时间
        });
      });

      // 加载图标标识
      isLoading.value = false;
    }
    if (status === 404) {
      isCompleted.value = true;
      ElMessage({ type: "info", message: "历史告警数据全部加载完成" });
    }
  } catch (error) {
    console.error(error);
  }
};

// 处置成功，更新当前行数据
const updateRow = (id: string, state: string, operation: string) => {
  tableData.forEach((item) => {
    if (item.number === id) {
      item.warnSate = state;
      item.operation = operation;
    }
  });
};
</script>
<style scoped lang="less"></style>
