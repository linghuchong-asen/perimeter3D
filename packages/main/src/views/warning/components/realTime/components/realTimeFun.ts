/*
 * @Description:实时告警涉及到的方法
 * @Author: yangsen
 * @Date: 2022-09-27 17:46:27
 * @LastEditors: yangsen
 * @LastEditTime: 2022-11-16 09:01:02
 */

import {
  getAssignDefence,
  getAssignCamera,
  type AssignDefence,
  type AssignCamera,
} from "../../../server";
import { ElMessage, ElNotification } from "element-plus";
import { useVideoStore } from "@main/stores/videoStore";
import { useSystemStore } from "@main/stores/systemStore";
import { watch } from "vue";
import { useRequest } from "@main/utils/useRequest";
import { getFormateTimeT, getAssignAfter } from "@main/utils/index";

/**
 * @@description: 播放历史视频方法
 */
export const usePalyHistory = (
  param: {
    defenceId: number;
    defenceName: string;
  },
  pollArr: { defenceId: number; defenceName: string }[]
) => {
  // 获取视频对象
  const videoStore = useVideoStore();
  // 系统配置全局状态
  const systemStore = useSystemStore();

  // 获取指定防区
  const data = useRequest<AssignDefence, number>(
    getAssignDefence,
    param.defenceId
  );

  watch(data, () => {
    if (data.value !== undefined) {
      // 获取防区成功,得到联动相机和关联相机
      const traceCamera = data.value.tracecamera;
      const linkCamera = data.value.linkcamera;
      // 需要播放视频的摄像机数组
      const vidicon = traceCamera.concat(linkCamera.map((item) => item.id));
      if (vidicon.length === 0) {
        ElNotification({
          type: "info",
          message: `${param.defenceName}防区没有关联相机，无法自动播放视频,即将为您播放下一条告警`,
        });
        console.log(pollArr[0], pollArr[1]);
        pollArr.shift();
        console.log(pollArr[0]);
      } else {
        /* 历史视频时间 */
        // 结束时间，默认为当前时间前推60秒，可以在系统配置中设置
        const endTime = getFormateTimeT();
        // 开始时间：即为当前时间
        const startTime = getAssignAfter(endTime, -systemStore.pollTime);

        // 播放历史，调用播放历史视频方法
        vidicon.forEach((item, index) => {
          // 获取指定相机，判断form_nvr字段是否为null

          const cameraData = useRequest<AssignCamera, number>(
            getAssignCamera,
            item,
            "联动或者关联相机设置不正确"
          );
          // 弹出信息的flag
          let messageFlag = 0;
          watch(cameraData, () => {
            messageFlag++;
            if (cameraData.value?.from_nvr !== null) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              videoStore.video.playHisSelect(index, item, startTime, endTime);
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
