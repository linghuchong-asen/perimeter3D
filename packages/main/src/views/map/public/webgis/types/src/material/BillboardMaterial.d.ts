import { Color } from '@/math/Color';
declare class BillboardMaterial {
    type: string;
    material: any;
    _image: string;
    textMaterial: any;
    constructor();
    set image(url: string);
    get image(): string;
    get text(): string | undefined;
    set text(value: string | undefined);
    get textFontSize(): string | undefined;
    set textFontSize(value: string | undefined);
    get textFillColor(): Color | undefined;
    set textFillColor(value: Color | undefined);
    get textOutlineColor(): Color | undefined;
    set textOutlineColor(value: Color | undefined);
    get textIsFill(): boolean | undefined;
    set textIsFill(value: boolean | undefined);
    get textIsOutline(): boolean | undefined;
    set textIsOutline(value: boolean | undefined);
    get textOutlineWidth(): number | undefined;
    set textOutlineWidth(value: number | undefined);
}
export { BillboardMaterial };
//# sourceMappingURL=BillboardMaterial.d.ts.map