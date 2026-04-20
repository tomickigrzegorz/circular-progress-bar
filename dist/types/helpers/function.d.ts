import type { CPBOptions } from "./defaults";
/**
 * Circle circumference for r=42: 2 * PI * 42 ≈ 264
 */
declare const CIRCUMFERENCE = 264;
/** Builds the CSS transform style and optional smooth transition for an SVG element */
declare const styleTransform: ({ rotation, animationSmooth, }: Pick<CPBOptions, "rotation" | "animationSmooth">) => string;
/** Returns stroke-dasharray attribute; defaults to full circumference when no argument */
declare const strokeDasharray: (type?: string) => Record<string, string>;
/** Returns stroke-linecap attribute: "round" or empty string */
declare const strokeLinecap: ({ round, }: Pick<CPBOptions, "round">) => Record<string, string>;
/** Returns font-size and font-weight attributes for the SVG text element */
declare const fontSettings: (options: Pick<CPBOptions, "fontSize" | "fontWeight">) => Record<string, string | number | undefined>;
/** Shorthand for document.querySelector */
declare const querySelector: (element: string) => Element | null;
/** Sets the stroke color — gradient URL or solid colorSlice */
declare const setColor: (element: Element | null, { lineargradient, index, colorSlice, }: Pick<CPBOptions, "lineargradient" | "index" | "colorSlice">) => void;
/** Iterates an object and sets each key-value pair as an attribute on the element */
declare const setAttribute: (element: Element | null, object: Record<string, unknown>) => void;
/** Creates an SVG namespace element of the given tag type */
declare const createNSElement: (type: string) => Element;
declare const dashOffset: (count: number, inverse?: boolean, cut?: number) => number;
/** Inserts an element relative to another using insertAdjacentElement */
declare const insertAdElement: (element: Element, el: Element, type?: InsertPosition) => Element | null;
/** Builds an SVG <defs> element containing a linearGradient with evenly spaced color stops */
declare const gradient: ({ index, lineargradient, }: Pick<CPBOptions, "index" | "lineargradient">) => Element;
/** Creates the SVG text element with percent and unit tspan children */
declare const createPercentElement: (options: CPBOptions, className: string) => Element;
/** Builds the arc-gradient SVG structure (mask + colored segments group) */
declare const arcGradient: (options: Pick<CPBOptions, "gradient" | "gradientStops" | "index" | "stroke" | "round" | "rotation">, className: string) => { mask: Element; group: Element };
export { arcGradient, CIRCUMFERENCE, createNSElement, createPercentElement, dashOffset, fontSettings, gradient, insertAdElement, querySelector, setAttribute, setColor, strokeDasharray, strokeLinecap, styleTransform, };
