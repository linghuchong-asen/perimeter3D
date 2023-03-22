/*
 * @Description: 系统配置全局状态。引入localStorage避免刷新丢失数据
 * @Author: yangsen
 * @Date: 2022-11-04 15:13:44
 * @LastEditors: yangsen
 * @LastEditTime: 2023-03-10 11:10:12
 */
import { defineStore } from "pinia";

interface SystemStore {
  videoSeconds: number; // 关联视频前秒数
  screenNum: number; // 分屏数量
  pollTime: number; // 告警视频轮询时长
  systemName: string; // 系统标题
  deleteWarn: number; // 自动删除告警时间
}

const storageVideoSeconds = localStorage.getItem("videoSeconds");
const storageScreenNum = localStorage.getItem("screenNum");
const storagePollTime = localStorage.getItem("pollTime");
const storageName = localStorage.getItem("systemName");
const storageDeleteWarn = localStorage.getItem("deleteWarn");

export const useSystemStore = defineStore({
  id: "systemStore",
  state: (): SystemStore => ({
    videoSeconds:
      storageVideoSeconds === null ? 10 : parseInt(storageVideoSeconds, 10),
    screenNum: storageScreenNum === null ? 9 : parseInt(storageScreenNum, 10),
    pollTime: storagePollTime === null ? 60 : parseInt(storagePollTime, 10),
    systemName: storageName === null ? "周界3D版" : storageName,
    deleteWarn:
      storageDeleteWarn === null ? 5 : parseInt(storageDeleteWarn, 10),
  }),
  getters: {},
  actions: {
    setVideoSeconds(seconds: number) {
      this.videoSeconds = seconds;
      localStorage.setItem("videoSeconds", seconds.toString());
    },
    setScreenNumber(num: number) {
      this.screenNum = num;
      localStorage.setItem("screenNum", num.toString());
    },
    setPollTime(seconds: number) {
      this.pollTime = seconds;
      localStorage.setItem("pollTime", seconds.toString());
    },
    setSystemName(name: string) {
      this.systemName = name;
      localStorage.setItem("systemName", name);
    },
    setDeleteWarn(seconds: number) {
      this.deleteWarn = seconds;
      localStorage.setItem("deleteWarn", seconds.toString());
    },
  },
});
