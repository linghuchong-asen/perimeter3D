import { http } from "@main/utils/http";

export interface AlarmArea {
  alarmarea_group: null;
  bypass_end: null | string;
  bypass_start: null | string;
  counttime: number;
  delay: number;
  delaytime: number;
  delaytype: number;
  dev: string;
  devgroup: string[];
  devgroupobj: string[];
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
  level: number;
  linkarea: null;
  linkcamera: string[];
  linktype: number;
  logictype: number;
  name: string;
  no: null;
  planned: null;
  region: number;
  shape: Shape;
  touch_eventflag: number;
  tracecamera: string[];
  type: number;
  thickness: number;
}

export interface Shape {
  coordinates: Array<Array<number[]>>;
  type: string;
}
// 获取防区
export const getAlarmArea = () =>
  http<AlarmArea[] | { detail: string }>("/API/V0.1/Area/AlarmArea/");

export interface ElementProject {
  cameraprojection: null | Cameraprojection;
  datasource: string;
  elementtype: string;
  id: number;
  level: number; // group的level是1，要素的level是3
  maxvisibledis: number;
  memo: string;
  minivisibledis: number;
  name: string;
  parent: null;
  property: Property;
  property_id: number | null;
  propertytype: number;
  region: number;
  sectioning: null;
  style: string;
  viewpoint: null | ApifoxModalViewpoint;
  visible: boolean;
}

export interface Cameraprojection {
  camcode: string;
  element: number;
  eye: Eye;
  foc: Foc;
  geometry: CameraprojectionGeometry;
  hvdx: number;
  hvdy: number;
  hvdz: number;
  id: number;
  linevisible: number;
  memo: string;
  name: string;
  projectorvisible: number;
  region: number;
  scenevisible: number;
  updirectionx: number;
  updirectiony: number;
  updirectionz: number;
}

export interface Eye {
  coordinates: number[];
  type: string;
}

export interface Foc {
  coordinates: number[];
  type: string;
}

export interface CameraprojectionGeometry {
  coordinates: number[];
  type: string;
}

export interface Property {
  aug_rng: number | null;
  azi: number;
  camera_pwd?: string;
  camera_uname?: string;
  closing_time?: number;
  create_time?: string;
  creationtime?: string;
  describe?: string;
  dis_rng: number;
  element: number;
  factory?: string;
  from_service?: null;
  geometry: PropertyGeometry;
  height?: number;
  horizonscope?: number;
  id: number;
  io?: number;
  ip: string;
  is_alarming?: boolean;
  is_delete: boolean;
  is_output?: boolean;
  lat?: number;
  lon?: number;
  max_pan?: number;
  max_tilt?: number;
  max_zoom?: number;
  memo?: string;
  min_tilt?: number;
  name: string;
  north_angle?: number;
  offset_pan?: number;
  offset_tilt?: number;
  opening_duration?: number;
  opening_time?: number;
  person_phone?: string;
  person_uname?: string;
  port: number | string;
  position_msg?: string;
  positionmsg?: string;
  r_id?: string;
  region: number;
  region_name?: string;
  state: null | string;
  time?: string;
  timestamp?: string;
  type?: number | string;
  viewpoint?: PropertyViewpoint;
  vm_name?: string;
  vm_no?: string;
}

export interface PropertyGeometry {
  coordinates: number[];
  type: string;
}

export interface PropertyViewpoint {
  coordinates: number[];
  type: string;
}

export interface ApifoxModalViewpoint {
  distance: number;
  element: number;
  geometry: ViewpointGeometry;
  heading: number;
  id: number;
  memo: string;
  name: string;
  pitch: number;
  region: number;
  type: number;
}

export interface ViewpointGeometry {
  coordinates: number[];
  type: string;
}

// 获取要素
export const elementProject = () =>
  http<ElementProject[] | { detail: string }>(
    "/API/V0.1/JMSceneConfigService/ElementProject/"
  );

// 获取指定球机
export interface AssignCamera {
  camera_pwd: string;
  camera_uname: string;
  channel: string;
  element: number;
  factory: string;
  from_nvr: null;
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
export const getAssignCamera = (cameraId: number) =>
  http<AssignCamera>(`/API/V0.1/Onvif/BallheadCamera/${cameraId}/`);

// 获取指定IO设备
export interface AssignIO {
  closing_time: number;
  create_time: string;
  describe: string;
  element: null;
  factory: string;
  id: number;
  io: number;
  is_alarming: boolean;
  is_delete: boolean;
  is_output: boolean;
  name: string;
  opening_duration: number;
  opening_time: number;
  port: number;
  region: number;
  type: number;
  viewpoint: Viewpoint;
}

export interface Viewpoint {
  coordinates: number[];
  type: string;
}
export const getAssignIO = (IOid: number) =>
  http<AssignIO>(`/API/V0.1/IO/IOSwitchDevice/${IOid}/`);

// 开启IO设备
export interface IOstatus {
  msg: string;
}
export const setIOstatus = (IOid: number) =>
  http<IOstatus>(`/API/V0.1/IO/Device/${IOid}/set_output/`, {
    method: "post",
    params: { status: "True" },
  });

// 获取雷达
export type RadarInfo = {
  aug_rng: number;
  azi: number;
  camera_max_pan: number;
  camera_max_tilt: number;
  camera_north_angle: number;
  creationtime: string;
  dis_rng: number;
  element: null;
  from_service: number;
  geometry: Geometry;
  height: number;
  id: number;
  ip: string;
  is_delete: boolean;
  name: string;
  r_id: string;
  region: number;
  region_name: string;
  server_name: string;
  state: string;
  type: string;
}[];

export interface Geometry {
  coordinates: number[];
  type: string;
}
export const getRadarInfo = () => http<RadarInfo>("/API/V0.1/Radar/RadarInfo/");
