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

/** Returns stroke-linecap attribute: "round" or "butt" (SVG default) */
const strokeLinecap = ({ round }) => {
  return {
    "stroke-linecap": round ? "round" : "butt",
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
  const step = colors.length > 1 ? 100 / (colors.length - 1) : 0;

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

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
};

const buildStops = (gradient, gradientStops) => {
  const useEqual = !gradientStops || gradientStops.length !== gradient.length;

  return gradient.map((color, i) => ({
    pos: useEqual
      ? i / (gradient.length - 1)
      : Math.min(100, Math.max(0, gradientStops[i])) / 100,
    rgb: hexToRgb(color),
  }));
};

const interpolateColor = (stops, t) => {
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i].pos) {
      const local = (t - stops[i - 1].pos) / (stops[i].pos - stops[i - 1].pos);
      const a = stops[i - 1].rgb;
      const b = stops[i].rgb;
      const r = Math.round(a[0] + (b[0] - a[0]) * local);
      const g = Math.round(a[1] + (b[1] - a[1]) * local);
      const bl = Math.round(a[2] + (b[2] - a[2]) * local);
      return `rgb(${r},${g},${bl})`;
    }
  }
  const last = stops[stops.length - 1].rgb;
  return `rgb(${last[0]},${last[1]},${last[2]})`;
};

const getGradientColorAt = (gradient, gradientStops, t) => {
  const stops = buildStops(gradient, gradientStops);
  const clamped = Math.max(0, Math.min(1, t));
  return interpolateColor(stops, clamped);
};

// Positions (0–1) where the gradient color changes between adjacent bands.
// Reads positions from the already-built `stops` so normalization lives in one
// place (buildStops). Used to place transparent gaps between hard-stop bands.
const gapBoundaries = (gradient, stops) => {
  if (!gradient || !stops || stops.length !== gradient.length) return [];
  const boundaries = [];
  for (let i = 0; i < gradient.length - 1; i++) {
    if (gradient[i] !== gradient[i + 1]) {
      boundaries.push(stops[i + 1].pos);
    }
  }
  return boundaries;
};

const arcGradient = (options, className) => {
  const STEPS = 120;
  const segLen = CIRCUMFERENCE / STEPS;
  const gap = CIRCUMFERENCE - segLen;
  const visibleRatio = (100 - (options.cut || 0)) / 100;
  const rotation = options.rotation ?? -90;
  const inverse = !!options.inverse;
  const stroke = options.stroke ?? 10;

  // Single transform applied to the segments group; the mask inherits it via
  // mask="url(...)". Rotation puts the path origin (3 o'clock) at the progress
  // start angle. For inverse, prefix with a y-axis flip around y=50 to reverse
  // the path's clockwise direction without moving the start point.
  const transform = inverse
    ? `rotate(${rotation} 50 50) translate(0 100) scale(1 -1)`
    : `rotate(${rotation} 50 50)`;

  const stops = buildStops(options.gradient, options.gradientStops);

  // gradientGap: transparent gaps (in %) at each color-change boundary.
  // Gaps require explicit gradientStops (hard color bands); without matching
  // stops there are no defined bands, so the option is silently ignored.
  const gapWidth = options.gradientGap ? options.gradientGap / 100 : 0;
  const halfGap = gapWidth / 2;
  const hasStops =
    Array.isArray(options.gradientStops) &&
    options.gradientStops.length === options.gradient.length;
  const boundaries =
    gapWidth > 0 && hasStops ? gapBoundaries(options.gradient, stops) : [];

  const mask = createNSElement("mask");
  mask.id = `arc-gradient-mask-${options.index}`;

  const maskCircle = createNSElement("circle");
  setAttribute(maskCircle, {
    cx: "50%",
    cy: "50%",
    r: 42,
    fill: "none",
    stroke: "white",
    "stroke-width": stroke,
    "stroke-dasharray": String(CIRCUMFERENCE),
    "stroke-dashoffset": String(CIRCUMFERENCE),
    "shape-rendering": "geometricPrecision",
    // Keep mask seam crisp; round cap here leaks the gradient endpoint color at the start.
    "stroke-linecap": "butt",
  });
  maskCircle.classList.add(`${className}-circle-${options.index}`);
  mask.appendChild(maskCircle);

  const group = createNSElement("g");
  group.setAttribute("transform", transform);
  group.setAttribute("mask", `url(#arc-gradient-mask-${options.index})`);

  const startCap = createNSElement("circle");
  setAttribute(startCap, {
    cx: "50",
    cy: "50",
    r: String(stroke / 2),
    fill: options.gradient[0],
    display: "none",
    "shape-rendering": "geometricPrecision",
  });
  startCap.classList.add(`${className}-gradient-start-cap-${options.index}`);

  const endCap = createNSElement("circle");
  setAttribute(endCap, {
    cx: "50",
    cy: "50",
    r: String(stroke / 2),
    fill: options.gradient[0],
    display: "none",
    "shape-rendering": "geometricPrecision",
  });
  endCap.classList.add(`${className}-gradient-end-cap-${options.index}`);

  for (let i = 0; i < STEPS; i++) {
    // Sample at segment centers, then map [0, visibleRatio] to [0, 1] so the
    // gradient runs from gradient[0] at the start of the visible arc to
    // gradient[100%] at the end. Segments past visibleRatio sit in the cut
    // zone and stay hidden by the mask.
    const sample = (i + 0.5) / STEPS;
    const t = Math.min(1, sample / visibleRatio);
    // Skip segments whose center lands within half a gap of a boundary; strict
    // `<` keeps the gap symmetric around the boundary, leaving transparent space.
    if (boundaries.some((b) => Math.abs(t - b) < halfGap)) continue;
    const color = interpolateColor(stops, t);
    const dashoffset = CIRCUMFERENCE + 0.5 - i * segLen;

    const seg = createNSElement("circle");
    setAttribute(seg, {
      cx: "50%",
      cy: "50%",
      r: 42,
      fill: "none",
      stroke: color,
      "stroke-width": stroke,
      "stroke-dasharray": `${segLen + 0.5} ${gap}`,
      "stroke-dashoffset": String(dashoffset),
      "shape-rendering": "geometricPrecision",
    });
    group.appendChild(seg);
  }

  return { mask, group, startCap, endCap };
};

export {
  CIRCUMFERENCE,
  arcGradient,
  createNSElement,
  createPercentElement,
  dashOffset,
  fontSettings,
  getGradientColorAt,
  gradient,
  insertAdElement,
  querySelector,
  setAttribute,
  setColor,
  strokeDasharray,
  strokeLinecap,
  styleTransform,
};
