import { Scene as ThreeScene } from 'three';
import { PerspectiveCamera } from './Camera';
import { PrimitiveGroup } from '../primitive/PrimitiveGroup';
import { AmbientLight } from 'three';
declare const camera: PerspectiveCamera;
declare class Scene extends ThreeScene {
    constructor();
    camera: PerspectiveCamera;
    light: AmbientLight;
    primitives: PrimitiveGroup;
    getPrimitiveById(id: string): any;
}
export { Scene, camera };
//# sourceMappingURL=Scene.d.ts.map