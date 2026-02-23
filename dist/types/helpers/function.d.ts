import type { CPBOptions } from "./defaults";
/**
 * Circle circumference for r=42: 2 * PI * 42 ≈ 264
 */
declare const CIRCUMFERENCE = 264;
declare const styleTransform: ({ rotation, animationSmooth, }: Pick<CPBOptions, "rotation" | "animationSmooth">) => string;
declare const strokeDasharray: (type?: string) => Record<string, string>;
declare const strokeLinecap: ({ round, }: Pick<CPBOptions, "round">) => Record<string, string>;
declare const fontSettings: (options: Pick<CPBOptions, "fontSize" | "fontWeight">) => Record<string, string | number | undefined>;
declare const querySelector: (element: string) => Element | null;
declare const setColor: (element: Element | null, { lineargradient, index, colorSlice, }: Pick<CPBOptions, "lineargradient" | "index" | "colorSlice">) => void;
declare const setAttribute: (element: Element | null, object: Record<string, unknown>) => void;
declare const createNSElement: (type: string) => Element;
declare const dashOffset: (count: number, inverse?: boolean, cut?: number) => number;
declare const insertAdElement: (element: Element, el: Element, type?: InsertPosition) => Element | null;
declare const gradient: ({ index, lineargradient, }: Pick<CPBOptions, "index" | "lineargradient">) => Element;
declare const createPercentElement: (options: CPBOptions, className: string) => Element;
export { CIRCUMFERENCE, createNSElement, createPercentElement, dashOffset, fontSettings, gradient, insertAdElement, querySelector, setAttribute, setColor, strokeDasharray, strokeLinecap, styleTransform, };
