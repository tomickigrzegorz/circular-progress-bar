/**
 *
 * @param {Object} object
 * @returns {String}
 */
const styleTransform = ({ rotation, animationSmooth }) => {
  const smoothAnimation = animationSmooth
    ? `transition: stroke-dashoffset ${animationSmooth}`
    : "";

  return `transform:rotate(${rotation}deg);transform-origin: 50% 50%;${smoothAnimation}`;
};

/**
 * Set "stroke-dasharray": "1, 2"
 * @param {String} type
 * @returns {Object}
 */
const strokeDasharray = (type) => {
  return {
    "stroke-dasharray": type || "264",
  };
};

/**
 * Set type stroke-linecap
 * @param {String} round
 * @returns {Object}
 */
const strokeLinecap = ({ round }) => {
  return {
    "stroke-linecap": round ? "round" : "",
  };
};

/**
 * Set font sieze/weight
 *
 * @param {Object} options
 * @returns {Object}
 */
const fontSettings = (options) => {
  return {
    "font-size": options.fontSize,
    "font-weight": options.fontWeight,
  };
};

/**
 *
 * @param {String} element
 * @returns {HTMLElement}
 */
const querySelector = (element) => document.querySelector(element);

/**
 * Set color or linear-gradient
 *
 * @param {String} element
 * @param {Object} object
 */
const setColor = (element, { lineargradient, index, colorSlice }) => {
  element.setAttribute(
    "stroke",
    lineargradient ? `url(#linear-${index})` : colorSlice,
  );
};

/**
 * Set attribute to specific element
 *
 * @param {String} element
 * @param {Object} object
 */
const setAttribute = (element, object) => {
  for (const key in object) {
    element?.setAttribute(key, object[key]);
  }
};

/**
 * Create svg element
 *
 * @param {String} type
 * @returns {SVGElement}
 */
const createNSElement = (type) =>
  document.createElementNS("http://www.w3.org/2000/svg", type);

/**
 * Create svg tspan
 *
 * @param {String} className
 * @param {String} unit
 * @returns {HTMLElement}
 */
const tspan = (className, unit) => {
  const element = createNSElement("tspan");

  element.classList.add(className);
  if (unit) element.textContent = unit;
  return element;
};

/**
 * Function generate stroke-dashoffset
 *
 * @param {Number} count
 * @param {Boolean} inverse - Counterclockwise animation
 * @param {Number} cut - Angle of the circle sector
 * @returns {Number}
 */
const dashOffset = (count, inverse, cut) => {
  const cutChar = cut ? (264 / 100) * (100 - cut) : 264;
  const angle = 264 - (count / 100) * cutChar;

  // https://github.com/tomickigrzegorz/circular-progress-bar/issues/87
  // inverse option is not working in ios safari
  // return inverse ? `${264 - angle}` : angle;
  return inverse ? -angle : angle;
};

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} el
 * @param {String} type
 */
const insertAdElement = (element, el, type = "beforeend") =>
  element.insertAdjacentElement(type, el);

/**
 * Generator function linear-gradient stop svg elements
 *
 * @param {Object} object
 */
const gradient = ({ index, lineargradient }) => {
  const defsElement = createNSElement("defs");
  const linearGradient = createNSElement("linearGradient");
  linearGradient.id = `linear-${index}`;

  const countGradient = [].slice.call(lineargradient);

  defsElement.appendChild(linearGradient);

  let number = 0;
  countGradient.map((item) => {
    const stopElements = createNSElement("stop");

    const stopObj = {
      offset: `${number}%`,
      "stop-color": `${item}`,
    };
    setAttribute(stopElements, stopObj);

    linearGradient.appendChild(stopElements);
    number += 100 / (countGradient.length - 1);
  });

  return defsElement;
};

/**
 * A function that generates tspan
 * elements with a number and unit
 *
 * @param {Object} options - Global configuration
 * @param {String} className
 */
const percent = (options, className) => {
  const creatTextElementSVG = createNSElement("text");

  creatTextElementSVG.classList.add(`${className}-text-${options.index}`);

  // create tspan element with number
  // and insert to svg text element
  insertAdElement(
    creatTextElementSVG,
    tspan(`${className}-percent-${options.index}`),
  );

  // create and insert unit to text element
  insertAdElement(
    creatTextElementSVG,
    tspan(`${className}-unit-${options.index}`, options.unit),
  );

  // config to svg text
  const obj = {
    x: "50%",
    y: "50%",
    fill: options.fontColor,
    "text-anchor": "middle",
    dy: options.textPosition || "0.35em",
    ...fontSettings(options),
  };

  setAttribute(creatTextElementSVG, obj);
  return creatTextElementSVG;
};

export {
  createNSElement,
  dashOffset,
  fontSettings,
  gradient,
  insertAdElement,
  percent,
  querySelector,
  setAttribute,
  setColor,
  strokeDasharray,
  strokeLinecap,
  styleTransform,
};
