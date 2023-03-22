declare class Billboard {
    type: string;
    material: any;
    _image: string;
    billboard: any;
    constructor();
    set image(url: string);
    get image(): string;
    set position(pos: [number, number, number]);
    get position(): [number, number, number];
}
export { Billboard };
//# sourceMappingURL=Billboard.d.ts.map