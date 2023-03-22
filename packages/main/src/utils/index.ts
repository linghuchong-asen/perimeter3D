import { getCurrentInstance } from "vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { BigNumber } from "bignumber.js";
import {
  Matrix4,
  Vector3,
} from "@main/views/map/public/webgis/bundle.module.js";
import { de } from "element-plus/es/locale";

// 获取png图片
export const getPngUrl = (fileName: string) => {
  const pngUrl = new URL(`../assets/img/${fileName}.png`, import.meta.url).href;
  return pngUrl;
};
// 获取svg图片
export const getSvgUrl = (fileName: string) => {
  const svgUrl = new URL(`../assets/img/${fileName}.svg`, import.meta.url).href;
  return svgUrl;
};

// 获取全局变量
interface GlobalVar {
  $wsBaseUrl: string;
  $httpBaseUrl: string;
}
export const getGlobalVar = (): GlobalVar | undefined => {
  const instance = getCurrentInstance();
  if (instance) {
    const globalProperties = instance.appContext.config.globalProperties;
    const globalVar = globalProperties as GlobalVar;
    return globalVar;
  }
};

// ping方法
export const pingFun = (ip: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const start = new Date().getTime();
    // 尝试访问指定站点下的一个不存在的图片文件（文件名是个随机数)
    img.src = `http://${location.host}${ip}?t=${start}`;
    let flag = false; //无法访问
    img.onload = function () {
      flag = true;
      resolve(flag);
    };
    img.onerror = function () {
      flag = true;
      resolve(flag);
    };
    const timer = setTimeout(function () {
      if (!flag) {
        //如果真的无法访问
        flag = false;
        clearTimeout(timer);
        reject(flag);
      }
    }, 1500);
  });
};

// 格式化时间 格式：yyyy-mm-dd hh:mm:ss
export const getFormateTime = (time?: number): string => {
  // 有参数时，获取参数的时间；没有时获取当前时间
  let date;
  if (time) {
    date = new Date(time);
  } else {
    date = new Date();
  }
  // 获取年
  const year: string = date.getFullYear().toString();
  // 获取月
  let month: string = date.getMonth().toString();
  // 获取日
  let day: string = date.getDate().toString();
  // 获取时
  let hour: string = date.getHours().toString();
  // 获取分钟
  let minute: string = date.getMinutes().toString();
  // 获取秒
  let second: string = date.getSeconds().toString();

  month =
    parseInt(month) < 9 ? "0" + (month + 1) : (parseInt(month) + 1).toString();
  day = parseInt(day) < 10 ? "0" + day : day;
  hour = parseInt(hour) < 10 ? "0" + hour : hour;
  minute = parseInt(minute) < 10 ? "0" + minute : minute;
  second = parseInt(second) < 10 ? "0" + second : second;

  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
  );
};

// 获取n个小时后的时间，并格式化
export const getHoursAfter = (hours: number) => {
  const dateNow = new Date();
  // 当前时间戳
  const timestamp = dateNow.getTime();
  // n小时后毫秒数
  const milliSecond = timestamp + hours * 60 * 60 * 1000;
  // 调用格式化函数
  return getFormateTime(milliSecond);
};

// 格式化时间 格式：yyyy-mm-ddThh:mm:ss
export const getFormateTimeT = (time?: number): string => {
  // 有参数时，获取参数的时间；没有时获取当前时间
  let date;
  if (time) {
    date = new Date(time);
  } else {
    date = new Date();
  }
  // 获取年
  const year: string = date.getFullYear().toString();
  // 获取月
  let month: string = date.getMonth().toString();
  // 获取日
  let day: string = date.getDate().toString();
  // 获取时
  let hour: string = date.getHours().toString();
  // 获取分钟
  let minute: string = date.getMinutes().toString();
  // 获取秒
  let second: string = date.getSeconds().toString();

  month =
    parseInt(month) < 9 ? "0" + (month + 1) : (parseInt(month) + 1).toString();
  day = parseInt(day) < 10 ? "0" + day : day;
  hour = parseInt(hour) < 10 ? "0" + hour : hour;
  minute = parseInt(minute) < 10 ? "0" + minute : minute;
  second = parseInt(second) < 10 ? "0" + second : second;

  return (
    year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second
  );
};

// 获取指定时间(yyyy-mm-dd hh:mm:ss)；n秒前或者后的时间，并格式化yyyy-mm-ddThh:mm:ss
export const getAssignAfter = (time: string, seconds: number) => {
  const dateNow = new Date(time);
  // 当前时间戳
  const timestamp = dateNow.getTime();

  // n小时后毫秒数
  const milliSecond = timestamp + seconds * 1000;

  // 调用格式化函数
  return getFormateTimeT(milliSecond);
};
/**
 * @description: 将经纬度坐标转换为直角坐标，采用WGS84坐标系 https://blog.csdn.net/abanchao/article/details/128304152
 * @param {number} longitude：经度
 * @param {number} latitude：纬度
 * @param {number} H：高程
 * @return {*} 直角坐标
 */
export const LBHtoXYZ = (
  longitude: number,
  latitude: number,
  H: number
): Matrix4 => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const localToWorld = new Matrix4().set(
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  );
  console.log(longitude, latitude, H);
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  const L = new BigNumber(longitude * (3.1415926535897932 / 180));
  // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
  const B = new BigNumber(latitude * (3.1415926535897932 / 180));
  const a = new BigNumber(6378137.0); // 长半轴
  const b = new BigNumber(6356752.3142451793); // 短半轴
  const e = a
    .exponentiatedBy(2)
    .minus(b.exponentiatedBy(2))
    .squareRoot()
    .dividedBy(a); // 椭球偏心率
  const N = a.dividedBy(
    new BigNumber(1)
      .minus(
        e
          .exponentiatedBy(2)
          .times(new BigNumber(Math.sin(B.toNumber())).exponentiatedBy(2))
      )
      .squareRoot()
  ); // 椭球曲率半径
  const X = N.plus(new BigNumber(H))
    .times(new BigNumber(Math.cos(B.toNumber())))
    .times(new BigNumber(Math.cos(L.toNumber())));

  const Y = N.plus(new BigNumber(H))
    .times(new BigNumber(Math.cos(B.toNumber())))
    .times(new BigNumber(Math.sin(L.toNumber())));

  const Z = N.times(new BigNumber(1).minus(e.exponentiatedBy(2)))
    .plus(new BigNumber(H))
    .times(new BigNumber(Math.sin(B.toNumber())));

  let _eccentricitySquared: number;
  (function computeCoefficients() {
    const flattening = a.minus(b).dividedBy(a);
    _eccentricitySquared = flattening
      .times(2)
      .minus(flattening.exponentiatedBy(2))
      .toNumber();
  })();
  console.log(_eccentricitySquared);

  let latitudeTransition!: number;
  let longitudeTransition!: number;
  let heightTransition: number;
  /**
   * @description: 传入上面计算出来的直角坐标系下的X Y Z;目的是计算出三个经纬度高度的中间值，为computeCoordinateFrame函数做准备
   * @param {BigNumber} X
   * @param {BigNumber} Y
   * @param {BigNumber} Z
   * @return {*}
   */
  function convertXYZToLatLongHeight(X: BigNumber, Y: BigNumber, Z: BigNumber) {
    // handle polar and center-of-earth cases directly.
    if (X.toNumber() != 0.0) {
      longitudeTransition = Math.atan2(Y.toNumber(), X.toNumber());
    } else {
      if (Y.toNumber() > 0.0) longitudeTransition = Math.PI / 2;
      else if (Y.toNumber() < 0.0) longitudeTransition = -Math.PI / 2;
      else {
        // at pole or at center of the earth
        longitudeTransition = 0.0;
        if (Z.toNumber() > 0.0) {
          // north pole.
          latitudeTransition = Math.PI / 2;
          heightTransition = Z.minus(b).toNumber();
        } else if (Z.toNumber() < 0.0) {
          // south pole.
          latitudeTransition = -Math.PI / 2;
          heightTransition = Z.negated().minus(b).toNumber();
        } else {
          // center of earth.
          latitudeTransition = Math.PI / 2;
          heightTransition = b.negated().toNumber();
        }
        return;
      }
    }

    // http://www.colorado.edu/geography/gcraft/notes/datum/gif/xyzllh.gif
    const p = X.exponentiatedBy(2).plus(Y.exponentiatedBy(2)).squareRoot();
    const theta = Math.atan2(Z.times(a).toNumber(), p.times(b).toNumber());
    const eDashSquared = a
      .exponentiatedBy(2)
      .minus(b.exponentiatedBy(2))
      .dividedBy(b.exponentiatedBy(2));

    const sin_theta = Math.sin(theta);
    const cos_theta = Math.cos(theta);

    latitudeTransition = Math.atan(
      eDashSquared
        .times(b)
        .times(sin_theta)
        .times(sin_theta)
        .times(sin_theta)
        .plus(Z)
        .dividedBy(
          new BigNumber(_eccentricitySquared)
            .times(a)
            .times(cos_theta)
            .times(cos_theta)
            .times(cos_theta)
            .negated()
            .plus(p)
        )
        .toNumber()
    );
    const sin_latitude = Math.sin(latitude);
    const N = a.dividedBy(
      new BigNumber(_eccentricitySquared)
        .times(sin_latitude)
        .times(sin_latitude)
        .negated()
        .plus(1.0)
        .squareRoot()
    );
    heightTransition = p.dividedBy(Math.cos(latitude)).minus(N).toNumber();
  }

  convertXYZToLatLongHeight(X, Y, Z);

  // localToWorld先赋值了T，再计算赋值R
  let up!: Vector3;
  let east!: Vector3;
  const north: Vector3 = new Vector3();

  function computeCoordinateFrame(latitude: number, longitude: number) {
    console.log(latitude);
    // Compute up vector
    up = new Vector3(
      Math.cos(longitude) * Math.cos(latitude),
      Math.sin(longitude) * Math.cos(latitude),
      Math.sin(latitude)
    );
    console.log(north);
    north.copy(up);
    console.log(north);
    // Compute east vector
    east = new Vector3(-Math.sin(longitude), Math.cos(longitude), 0);

    // Compute north vector = outer product up x east
    north.cross(east);
  }

  computeCoordinateFrame(latitudeTransition, longitudeTransition);
  console.log("latitudeTransition", latitudeTransition);
  console.log("longitudeTransition", longitudeTransition);
  console.log("east", east);
  console.log("up", up);
  console.log("north", north);
  localToWorld.set(
    east.x,
    north.x,
    up.x,
    X.toNumber(),
    east.y,
    north.y,
    up.y,
    Y.toNumber(),
    east.z,
    north.z,
    up.z,
    Z.toNumber(),
    0,
    0,
    0,
    1
  );
  console.log(localToWorld);
  return localToWorld;
};
