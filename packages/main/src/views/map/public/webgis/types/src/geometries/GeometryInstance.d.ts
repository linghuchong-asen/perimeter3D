import { Vector3 } from 'three';
interface Options {
    geometry: any;
    translate?: Vector3;
    rotation?: Vector3;
    scale?: Vector3;
    heading?: number;
    pitch?: number;
    roll?: number;
    matrix?: any;
}
declare class GeometryInstance {
    geometry: any;
    translate: Vector3;
    rotation: Vector3;
    scale: Vector3;
    heading: number;
    pitch: number;
    roll: number;
    matrix: any;
    constructor(options: Options);
}
export { GeometryInstance };
//# sourceMappingURL=GeometryInstance.d.ts.map