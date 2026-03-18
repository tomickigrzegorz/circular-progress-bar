/**
 * Circle circumference for r=42: 2 * PI * 42 ≈ 264
 */
const CIRCUMFERENCE = 264;

/** Builds the CSS transform style and optional smooth transition for an SVG element */
const styleTransform = ({ rotation, animationSmooth }) => {
  const smoothAnimation = animationSmooth
    ? `transition: stroke-dashoffset ${animationSmooth}`
    : "";

  return `transform:rotate(${rotation}deg);transform-origin: 50% 50%;${smoothAnimation}`;
};

/** Returns stroke-dasharray attribute; defaults to full circumference when no argument */
const strokeDasharray = (type) => {
  return {
    "stroke-dasharray": type || String(CIRCUMFERENCE),
  };
};

/** Returns stroke-linecap attribute: "round" or empty string */
const strokeLinecap = ({ round }) => {
  return {
    "stroke-linecap": round ? "round" : "",
  };
};

/** Returns font-size and font-weight attributes for the SVG text element */
const fontSettings = (options) => {
  return {
    "font-size": options.fontSize,
    "font-weight": options.fontWeight,
  };
};

/** Shorthand for document.querySelector */
const querySelector = (element) => document.querySelector(element);

/** Sets the stroke color — gradient URL or solid colorSlice */
const setColor = (element, { lineargradient, index, colorSlice }) => {
  element?.setAttribute(
    "stroke",
    lineargradient ? `url(#linear-${index})` : (colorSlice ?? ""),
  );
};

/** Iterates an object and sets each key-value pair as an attribute on the element */
const setAttribute = (element, object) => {
  Object.entries(object).forEach(([key, value]) => {
    element?.setAttribute(key, String(value));
  });
};

/** Creates an SVG namespace element of the given tag type */
const createNSElement = (type) =>
  document.createElementNS("http://www.w3.org/2000/svg", type);

/** Creates an SVG tspan element with a class and optional text content */
const tspan = (className, unit) => {
  const element = createNSElement("tspan");

  element.classList.add(className);
  if (unit) element.textContent = unit;
  return element;
};

const dashOffset = (count, inverse, cut) => {
  const cutChar = cut ? (CIRCUMFERENCE / 100) * (100 - cut) : CIRCUMFERENCE;
  const angle = CIRCUMFERENCE - (count / 100) * cutChar;

  // https://github.com/tomickigrzegorz/circular-progress-bar/issues/87
  // inverse option is not working in ios safari
  return inverse ? -angle : angle;
};

/** Inserts an element relative to another using insertAdjacentElement */
const insertAdElement = (element, el, type = "beforeend") =>
  element.insertAdjacentElement(type, el);

/** Builds an SVG <defs> element containing a linearGradient with evenly spaced color stops */
const gradient = ({ index, lineargradient }) => {
  const defsElement = createNSElement("defs");
  const linearGradient = createNSElement("linearGradient");
  linearGradient.id = `linear-${index}`;

  const colors = [...lineargradient];
  const step = 100 / (colors.length - 1);

  defsElement.appendChild(linearGradient);

  colors.forEach((color, i) => {
    const stopElement = createNSElement("stop");
    setAttribute(stopElement, {
      offset: `${i * step}%`,
      "stop-color": color,
    });
    linearGradient.appendChild(stopElement);
  });

  return defsElement;
};

/** Creates the SVG text element with percent and unit tspan children */
const createPercentElement = (options, className) => {
  const creatTextElementSVG = createNSElement("text");

  creatTextElementSVG.classList.add(`${className}-text-${options.index}`);

  insertAdElement(
    creatTextElementSVG,
    tspan(`${className}-percent-${options.index}`),
  );

  insertAdElement(
    creatTextElementSVG,
    tspan(`${className}-unit-${options.index}`, options.unit),
  );

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
  CIRCUMFERENCE,
  createNSElement,
  createPercentElement,
  dashOffset,
  fontSettings,
  gradient,
  insertAdElement,
  querySelector,
  setAttribute,
  setColor,
  strokeDasharray,
  strokeLinecap,
  styleTransform,
};
