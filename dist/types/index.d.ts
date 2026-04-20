import type { CPBOptions } from "./helpers/defaults";
export type { CPBOptions };
/** Animated circular SVG progress bar */
export default class CircularProgressBar {
    private _className;
    private _globalObj;
    private _elements;
    /** Queries all elements matching the class name and assigns data-pie-index attributes */
    constructor(pieName: string, globalObj?: CPBOptions);
    /** Creates SVG elements and starts the initial animation for all matching elements */
    initial(outside?: Element | Element[]): void;
    /** Appends the percent text, configures the progress circle attributes, and triggers animation */
    private _progress;
    /** Animates the progress bar to a new percent value; also used internally on initial render */
    animationTo(options: CPBOptions & {
        index: string | number;
    }, initial?: boolean): void;
    /** Builds the full SVG structure for a single progress bar element */
    private _createSVG;
    /** Creates a circle element — "bottom" is the background track, "top" is the animated progress arc */
    private _circle;
}
