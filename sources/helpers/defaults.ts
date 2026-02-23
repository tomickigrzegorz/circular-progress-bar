export interface CPBOptions {
  /** Progress arc color */
  colorSlice?: string;
  /** Background circle color */
  colorCircle?: string;
  /** Percentage text color */
  fontColor?: string;
  /** Font size */
  fontSize?: string;
  /** Font weight */
  fontWeight?: number;
  /** Linear gradient color array or false to disable */
  lineargradient?: string[] | false;
  /** Whether to display the percentage value */
  number?: boolean;
  /** Rounded stroke ends */
  round?: boolean;
  /** SVG fill color */
  fill?: string;
  /** Unit displayed next to the number */
  unit?: string;
  /** Starting point rotation in degrees */
  rotation?: number;
  /** Element size in px */
  size?: number;
  /** Progress stroke width */
  stroke?: number;
  /** Background circle stroke width (overrides stroke) */
  strokeBottom?: number;
  /** Custom stroke-dasharray value */
  strokeDasharray?: string;
  /** Arc cut-off in percent */
  cut?: number;
  /** Reverse animation direction */
  inverse?: boolean;
  /** Disable animation */
  animationOff?: boolean;
  /** CSS transition for smooth animation, e.g. "1s ease" */
  animationSmooth?: string;
  /** Animation speed in frames per second */
  speed?: number;
  /** Vertical text position (dy attribute) */
  textPosition?: string;
  /** Unique element identifier */
  index?: string | number;
  /** Percentage value (0–100) */
  percent?: number;
  /** DOM element (used internally) */
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
