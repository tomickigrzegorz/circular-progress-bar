import type { CPBOptions } from "./helpers/defaults";
export default class CircularProgressBar {
    private _className;
    private _globalObj;
    private _elements;
    constructor(pieName: string, globalObj?: CPBOptions);
    initial(outside?: Element | Element[]): void;
    private _progress;
    animationTo(options: CPBOptions & {
        index: string | number;
    }, initial?: boolean): void;
    private _createSVG;
    private _circle;
}
