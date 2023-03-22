/*
 * @Description: 告警用到的请求
 * @Version: 1.0
 * @Author: yangsen
 * @Date: 2022-09-08 21:19:02
 * @LastEditors: yangsen
 * @LastEditTime: 2022-11-09 17:43:42
 */

import { http } from "@main/utils/http";
import type { RTData } from "./components/realTime/realTime";
import type { HandleWarnData } from "./components/realTime/realTime";
import { SocketServer } from "@main/utils/websocket";

// 实时报警websocket连接
export const createRealTimeAlarmWs = (param: RTData) => {
  const cloneObject = {};
  new SocketServer().connect(param, "/trgt/alarm/trgtalarm/");
  Object.assign(param, cloneObject);
};

// IO报警websocket连接
export const createIOAlarmWs = (param: RTData) => {
  new SocketServer().connect(param, "/ws/IOSwitchAlarm/alarm/");
};

// 获取指定防区
export interface AssignDefence {
  alarmarea_group: null;
  alarmarea_group_name: string;
  bypass_end: null;
  bypass_start: null;
  counttime: number;
  delay: number;
  delaytime: number;
  delaytype: number;
  devgroup: string[];
  devgroupobj: string[];
  devid: number;
  devname: string;
  devtype: number;
  event_flag: number;
  func_state: number;
  height: number;
  id: number;
  intervaltime: number;
  is_bypass: boolean;
  is_cover: boolean;
  is_delete: boolean;
  is_failure: boolean;
  is_multitype: boolean;
  is_working: boolean;
  linkarea: null;
  linkcamera: {
    id: number;
    preset: string;
  }[];
  linktype: number;
  logictype: number;
  name: string;
  no: string;
  planned: null;
  planned_name: string;
  region: number;
  shape: Shape;
  touch_eventflag: number;
  tracecamera: number[];
  type: number;
}

export interface Shape {
  coordinates: Array<Array<number[]>>;
  type: string;
}
export const getAssignDefence = (param?: number) =>
  http<AssignDefence | { detail: string }>(
    `/API/V0.1/Area/AlarmArea/${param}/`
  );

/* ----------------实时告警处置--------------------------------- */
export interface HandleWarnSeverData {
  alarmtype: number;
  cfmdesc: string;
  cfmtime: string;
  cfmtype: string;
  id: number;
  obj_id: string;
  type: number;
  user: number;
}
export const handleWarnSever = (params?: HandleWarnData) =>
  http<HandleWarnSeverData | { detail: string }>("/API/V0.1/Area/CfmInfo/", {
    method: "post",
    params,
  });

/* -----------获取处置信息------------- */
export interface DirectionInfoParams {
  startdatetime?: string;
  enddatetime?: string;
  type?: string;
  obj_id?: string;
}
export type DirectionInfoData = {
  id: number;
  cfmtype: string;
  alarmtype: number;
  cfmdesc: string;
  cfmtime: string;
  obj_id: string;
  type: number;
  user: number;
}[];
export const getDirectionInfo = (params?: DirectionInfoParams) =>
  http<DirectionInfoData>("/API/V0.1/Area/CfmInfo/", { params });

/* -------------获取用户信息-------------------- */
export interface Users {
  id: number;
  username: string;
  regions: [];
  roles: [];
}
export const getUsers = (param?: number) =>
  http<Users>(`/API/V0.1/Account/getUserDetail/${param}/`);

/* -----------获取指定NVR---------------------------- */
export interface AssignNVR {
  id: number;
  nvr_ip: string;
  nvr_rtsp_port: string;
  nvr_rtsp_url: string;
  nvr_rtsp_history_url: string;
  nvr_pwd: string;
  nvr_user: string;
  time_format: string;
}
export const getAssignNVR = (cameraId?: number) =>
  http<AssignNVR | { detail: string }>(
    `/API/V0.1/Onvif/NVRServer/${cameraId}/`
  );

/* -------------------获取指定球机------------------------------ */
export interface AssignCamera {
  camera_pwd: string;
  camera_uname: string;
  channel: string;
  element: number;
  factory: string;
  from_nvr: string | null;
  from_nvr_channel: string;
  height: number;
  horizonscope: number;
  id: number;
  ip: string;
  is_delete: boolean;
  lat: number;
  lon: number;
  max_pan: number;
  max_tilt: number;
  max_zoom: number;
  memo: string;
  min_tilt: number;
  name: string;
  north_angle: number;
  offset_pan: number;
  offset_tilt: number;
  person_phone: string;
  person_uname: string;
  port: string;
  position_msg: string;
  region: number;
  rtsp_channel: string;
  rtsp_history_url: string;
  rtsp_port: string;
  rtsp_url: string;
  timestamp: string;
  type: number;
  vm_name: string;
  vm_no: string;
}

export const getAssignCamera = (cameraId?: number) =>
  http<AssignCamera>(`/API/V0.1/Onvif/BallheadCamera/${cameraId}/`);
