import type { CPBOptions } from "./helpers/defaults";
export type { CPBOptions };

/** Animated circular SVG progress bar */
export default class CircularProgressBar {
  private _className: string;
  private _globalObj: CPBOptions;
  private _elements: Element[];

  /** Queries all elements matching the class name and assigns data-pie-index attributes */
  constructor(pieName: string, globalObj?: CPBOptions);

  /** Creates SVG elements and starts the initial animation for all matching elements */
  initial(outside?: Element | Element[]): void;

  /** Animates the progress bar to a new percent value */
  animationTo(
    options: CPBOptions & { index: string | number },
    initial?: boolean,
  ): void;
}
