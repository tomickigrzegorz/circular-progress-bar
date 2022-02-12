/**
 * @typedef {Object} - Default object
 * @prop {String} [colorSlice] - Progress color circle
 * @prop {String} [fontColor] - Font color
 * @prop {String} [fontSize] - Font size
 * @prop {Number} [fontWeight] - Font weight
 * @prop {Array} [linearGradient] - Linear gradien for circle
 * @prop {Boolean} [number] - Show/hide number
 * @prop {Boolean} [round] - Path rounding
 * @prop {String} [fill] - Inner circle color
 * @prop {String} [unit] - Different unit instead of percentage (%) inside the circle
 * @prop {Number} [rotation] - Chart rotation
 * @prop {Number} [size] - Size progress bar width and height in px
 * @prop {Number} [stroke] - Stroke width, chart thickness
 */
/**
 * Returns the default options of the component
 * @return {CPBOptions}
 */
const defaultOptions = {
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
