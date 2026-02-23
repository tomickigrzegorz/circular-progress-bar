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

export type InternalOptions = CPBOptions & { index: string };

const defaultOptions: CPBOptions = {
  colorSlice: "#00a1ff",
  fontColor: "#000",
  fontSize: "1.6rem",
  fontWeight: 400,
  lineargradient: false,
  number: true,
  round: false,
  fill: "none",
  unit: "%",
  rotation: -90,
  size: 200,
  stroke: 10,
};

export default defaultOptions;
