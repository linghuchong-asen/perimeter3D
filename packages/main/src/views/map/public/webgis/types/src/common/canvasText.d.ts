import { CanvasTexture } from 'three';
import { Color } from '@/math/Color';
interface CreateCanvasTextParam {
    text?: string;
    fontSize?: string;
    fillColor?: Color;
    outlineColor?: Color;
    isFill?: boolean;
    isOutline?: boolean;
    outlineWidth?: number;
}
export declare const createCanvasText: (param: CreateCanvasTextParam) => CanvasTexture;
export {};
//# sourceMappingURL=canvasText.d.ts.map