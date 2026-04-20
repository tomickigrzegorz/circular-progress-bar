import type { CPBOptions } from "./defaults";

/** Circle circumference for r=42: 2 * PI * 42 ≈ 264 */
export declare const CIRCUMFERENCE: number;

/** Builds the CSS transform style and optional smooth transition for an SVG element */
export declare const styleTransform: (
  options: Pick<CPBOptions, "rotation" | "animationSmooth">,
) => string;

/** Returns stroke-dasharray attribute; defaults to full circumference when no argument */
export declare const strokeDasharray: (type?: string) => Record<string, string>;

/** Returns stroke-linecap attribute: "round" or empty string */
export declare const strokeLinecap: (
  options: Pick<CPBOptions, "round">,
) => Record<string, string>;

/** Returns font-size and font-weight attributes for the SVG text element */
export declare const fontSettings: (
  options: Pick<CPBOptions, "fontSize" | "fontWeight">,
) => Record<string, string | number | undefined>;

/** Shorthand for document.querySelector */
export declare const querySelector: (element: string) => Element | null;

/** Sets the stroke color — gradient URL or solid colorSlice */
export declare const setColor: (
  element: Element | null,
  options: Pick<CPBOptions, "lineargradient" | "index" | "colorSlice">,
) => void;

/** Iterates an object and sets each key-value pair as an attribute on the element */
export declare const setAttribute: (
  element: Element | null,
  object: Record<string, unknown>,
) => void;

/** Creates an SVG namespace element of the given tag type */
export declare const createNSElement: (type: string) => Element;

export declare const dashOffset: (
  count: number,
  inverse?: boolean,
  cut?: number,
) => number;

/** Inserts an element relative to another using insertAdjacentElement */
export declare const insertAdElement: (
  element: Element,
  el: Element,
  type?: InsertPosition,
) => Element | null;

/** Builds an SVG <defs> element containing a linearGradient with evenly spaced color stops */
export declare const gradient: (
  options: Pick<CPBOptions, "index" | "lineargradient">,
) => Element;

/** Creates the SVG text element with percent and unit tspan children */
export declare const createPercentElement: (
  options: CPBOptions,
  className: string,
) => Element;

/** Builds the arc-gradient SVG structure (mask + colored segments group) */
export declare const arcGradient: (
  options: Pick<CPBOptions, "gradient" | "gradientStops" | "index" | "stroke" | "round" | "rotation">,
  className: string,
) => { mask: Element; group: Element };
