export interface CPBOptions {
    colorSlice?: string;
    colorCircle?: string;
    fontColor?: string;
    fontSize?: string;
    fontWeight?: number;
    lineargradient?: string[] | false;
    number?: boolean;
    round?: boolean;
    fill?: string;
    unit?: string;
    rotation?: number;
    size?: number;
    stroke?: number;
    strokeBottom?: number;
    strokeDasharray?: string;
    cut?: number;
    inverse?: boolean;
    animationOff?: boolean;
    animationSmooth?: string;
    speed?: number;
    textPosition?: string;
    index?: string | number;
    percent?: number;
    element?: Element;
}
export type InternalOptions = CPBOptions & {
    index: string;
};
declare const defaultOptions: CPBOptions;
export default defaultOptions;
