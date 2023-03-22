import {
  getAssignCamera,
  getAssignIO,
  setIOstatus,
  getRadarInfo,
} from "../server";

// 获取指定球机
export const getCameraInfo = async (cameraId: number) => {
  try {
    const data = await getAssignCamera(cameraId);
    return data;
  } catch (error) {
    console.error(`获取指定相机出错${error}`);
  }
};

// 获取指定IO设备
export const getIoinfo = async (IOid: number) => {
  try {
    const data = await getAssignIO(IOid);
    return data;
  } catch (error) {
    console.error(`获取指定IO设备出错${error}`);
  }
};

// 开启IO设备
export const setIO = async (IOid: number) => {
  try {
    const data = await setIOstatus(IOid);
    return data;
  } catch (error) {
    console.error(`获取指定IO设备出错${error}`);
  }
};

// 获取雷达信息
export const getRadar = async () => {
  try {
    const data = await getRadarInfo();
    return data;
  } catch (error) {
    console.error(`获取指定IO设备出错${error}`);
  }
};
