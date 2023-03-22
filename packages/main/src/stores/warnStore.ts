import { defineStore } from "pinia";
import type { WarnHistoryResult } from "@main/views/layout/components/header/serverType";
import type { QueryForm } from "@main/views/layout/components/header/components/warnQuery";

interface WarnStore {
  warningList: number[];
  historyWarn: WarnHistoryResult;
  tabActive: string;
  historyQueryForm: QueryForm;
  historyScrollTop: number;
  maxPage: number;
}

// 告警相关的状态
export const useWarnStore = defineStore({
  id: "warnStore",
  state: (): WarnStore => ({
    warningList: [], // 储存实时告警中的防区id
    historyWarn: [], // 初始化历史告警查询结果
    tabActive: "realTimeWarn", // 当前显示的tab页
    historyQueryForm: {
      page: 1,
      page_size: 50,
    }, // 告警查询表单提交数据
    historyScrollTop: 0, // 历史告警表格的定位位置
    maxPage: 1, // 最大页数
  }),

  getters: {},
  actions: {
    // 重置表单
    resetHistoryQueryForm() {
      this.historyQueryForm = {};
    },
    // 历史告警分页查询页码增加1
    increasePage() {
      if (this.historyQueryForm.page !== undefined) {
        this.historyQueryForm.page++;
      }
    },
  },
});
