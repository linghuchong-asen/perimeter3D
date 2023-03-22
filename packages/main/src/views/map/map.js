/*
 * @Description: 三维gis模块
 * @Author: yangsen
 * @Date: 2023-03-10 10:24:44
 * @LastEditors: yangsen
 * @LastEditTime: 2023-03-22 17:34:20
 */
import {
  Viewer,
  ModelGeometry,
  ModelMaterial,
  Color,
  Primitive,
  GeometryInstance,
  MaterialAppearance,
  Vector3,
  BillboardGeometry,
  BillboardMaterial,
  Vector2,
  PolygonGeometry,
  PolygonMaterial,
  Matrix4,
} from "./public/webgis/bundle.module.js";
import { LBHtoXYZ } from "@main/utils/index.ts";

let viewer, scene, camera;
export const initMap = (containerId) => {
  viewer = new Viewer(containerId);
  scene = viewer.scene;
  camera = scene.camera;

  /* 改变地面颜色 */
  viewer.groundColor = new Color(87, 96, 111, 1);
  /* 坐标轴 */
  viewer.axesShow = true;
  viewer.axesLength = 100;
};

/* 画模型 */
export const drawModel = (params) => {
  /* 加载模型 */
  const modelGeometry = new ModelGeometry();
  // const modelPosition = LBHtoXYZ(
  //   params.position.longitude,
  //   params.position.latitude,
  //   params.position.height
  // );
  // modelGeometry.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
  if (params.name == "首安模型") {
    // camera.position.set(
    //   modelPosition.x + 20,
    //   modelPosition.y + 10,
    //   modelPosition.z + 20
    // );
    // console.log(modelPosition);
    // camera.lookAt(modelPosition.x, modelPosition.y, modelPosition.z);

    const origin = new Vector3(0, 0, 0);
    origin.applyMatrix4(
      // new Matrix4()
      //   .set(
      //     -0.89403973682751459,
      //     -0.44798766609515978,
      //     0.0,
      //     0.0,
      //     0.28815567693995897,
      //     -0.57506633569244747,
      //     0.76567944689702561,
      //     0.0,
      //     -0.34301494839243135,
      //     0.68454785119805384,
      //     0.64322234460524208,
      //     0.0,
      //     -2190833.0284248837,
      //     4372200.2465798967,
      //     4080752.4412706778,
      //     1.0
      //   )
      //   .transpose()
      LBHtoXYZ(
        params.position.longitude,
        params.position.latitude,
        params.position.height
      )
    );

    camera.position.set(origin.x + 20, origin.y + 20, origin.z + 20);
    camera.lookAt(origin.x, origin.y, origin.z);
    /* 设置相机控制的target */
    viewer.controls.target.set(origin.x, origin.y, origin.z);
  }
  console.log(
     new Matrix4()
        .set(
          -0.89403973682751459,
          -0.44798766609515978,
          0.0,
          0.0,
          0.28815567693995897,
          -0.57506633569244747,
          0.76567944689702561,
          0.0,
          -0.34301494839243135,
          0.68454785119805384,
          0.64322234460524208,
          0.0,
          -2190833.0284248837,
          4372200.2465798967,
          4080752.4412706778,
          1.0
        )
  );
  const modelMaterial = new ModelMaterial();
  modelMaterial.url = "http://192.168.0.100:8810/shouan3-2-1png(1).glb";
  viewer.scene.primitives.append(
    new Primitive({
      geometryInstances: new GeometryInstance({
        geometry: modelGeometry,
        scale: new Vector3(params.scale.x, params.scale.y, params.scale.z),
        heading: params.heading,
        pitch: params.pitch,
        roll: params.roll,
        // matrix: new Matrix4()
        //   .set(
        //     -0.89403973682751459,
        //     -0.44798766609515978,
        //     0.0,
        //     0.0,
        //     0.28815567693995897,
        //     -0.57506633569244747,
        //     0.76567944689702561,
        //     0.0,
        //     -0.34301494839243135,
        //     0.68454785119805384,
        //     0.64322234460524208,
        //     0.0,
        //     -2190833.0284248837,
        //     4372200.2465798967,
        //     4080752.4412706778,
        //     1.0
        //   )
        //   .transpose(),
        matrix: LBHtoXYZ(
          params.position.longitude,
          params.position.latitude,
          params.position.height
        ),
      }),
      appearance: new MaterialAppearance({
        material: modelMaterial,
      }),
      id: "modelId",
    })
  );
};
export const drawElement = (params) => {
  /* 广告牌 */
  const billboardGeometry = new BillboardGeometry();
  // const elementPosition = LBHtoXYZ(
  //   params.position.longitude,
  //   params.position.latitude,
  //   params.position.height
  // );
  // 位置
  // billboardGeometry.position.set(
  //   elementPosition.x,
  //   elementPosition.y,
  //   elementPosition.z
  // );
  const billboardMaterial = new BillboardMaterial();
  // console.log("billboardMaterial:", billboardMaterial);
  // 贴图
  billboardMaterial.image = params.url;
  billboardMaterial.text = params.text.text;
  // billboardMaterial.textFillColor = new Color(
  //   params.text.fill.x * 255,
  //   params.text.fill.y * 255,
  //   params.text.fill.z * 255,
  //   params.text.fill.w
  // );
  billboardMaterial.textFontSize = params.text.fontSize.toString() + "px";

  viewer.scene.primitives.append(
    new Primitive({
      geometryInstances: new GeometryInstance({
        geometry: billboardGeometry,
        scale: new Vector3(1, 1, 1),
        // matrix: new Matrix4()
        //   .set(
        //     -0.89403999204352436,
        //     -0.44798715676547574,
        //     0.0,
        //     0.0,
        //     0.28815556060289849,
        //     -0.57506692149118865,
        //     0.76567905071268361,
        //     0.0,
        //     -0.34301438092366365,
        //     0.68454769240706093,
        //     0.64322281621513056,
        //     0.0,
        //     -2190831.6391600515,
        //     4372203.6930374354,
        //     4080759.6245902968,
        //     1.0
        //   )
        //   .transpose(),
        matrix: LBHtoXYZ(
          params.position.longitude,
          params.position.latitude,
          params.position.height
        ),
      }),
      appearance: new MaterialAppearance({
        material: billboardMaterial,
      }),
      id: "billboard",
    })
  );
};

// 显示防区
// export const drawDefence = (params) => {
//   /* 添加区域  */
//   const positionArr = [];
//   params.position.forEach((element) => {
//     const x = element[0];
//     const y = element[1];
//   });
//   const polygonGeometry = new PolygonGeometry(positionArr);
//   // 设置拉伸高度
//   polygonGeometry.stretch(50);
//   const polygonMaterial = new PolygonMaterial(new Color(117, 16, 99, 0.5), 50);
//   viewer.scene.primitives.append(
//     new Primitive({
//       geometryInstances: new GeometryInstance({
//         geometry: polygonGeometry,
//       }),
//       appearance: new MaterialAppearance({
//         material: polygonMaterial,
//       }),
//       id: "polygonId",
//     })
//   );
// };

// 轨迹线
// const trajectory = {};
// export const drawTrajectory = (params) => {
//   // 接收点坐标信息 接收到点时判断有无前点，有前点与前点做连线
//   // 清除轨迹：每一条轨迹线对应，一个坐标数组，一个点和线段id的数组，循环id数组调用remove dispose方法
//   trajectory[params.targetId] = {};
//   trajectory[params.targetId]["position"] = [];
//   trajectory[params.targetId]["position"].push(params.position);
//   trajectory[params.targetId]["id"] = [];
//   trajectory[params.targetId]["id"].push();
// };
