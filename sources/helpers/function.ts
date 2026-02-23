import type { CPBOptions } from "./defaults";

/**
 * Circle circumference for r=42: 2 * PI * 42 ≈ 264
 */
const CIRCUMFERENCE = 264;

const styleTransform = ({
  rotation,
  animationSmooth,
}: Pick<CPBOptions, "rotation" | "animationSmooth">): string => {
  const smoothAnimation = animationSmooth
    ? `transition: stroke-dashoffset ${animationSmooth}`
    : "";

  return `transform:rotate(${rotation}deg);transform-origin: 50% 50%;${smoothAnimation}`;
};

const strokeDasharray = (type?: string): Record<string, string> => {
  return {
    "stroke-dasharray": type || String(CIRCUMFERENCE),
  };
};

const strokeLinecap = ({
  round,
}: Pick<CPBOptions, "round">): Record<string, string> => {
  return {
    "stroke-linecap": round ? "round" : "",
  };
};

const fontSettings = (
  options: Pick<CPBOptions, "fontSize" | "fontWeight">,
): Record<string, string | number | undefined> => {
  return {
    "font-size": options.fontSize,
    "font-weight": options.fontWeight,
  };
};

const querySelector = (element: string): Element | null =>
  document.querySelector(element);

const setColor = (
  element: Element | null,
  {
    lineargradient,
    index,
    colorSlice,
  }: Pick<CPBOptions, "lineargradient" | "index" | "colorSlice">,
): void => {
  element?.setAttribute(
    "stroke",
    lineargradient ? `url(#linear-${index})` : colorSlice ?? "",
  );
};

const setAttribute = (
  element: Element | null,
  object: Record<string, unknown>,
): void => {
  Object.entries(object).forEach(([key, value]) => {
    element?.setAttribute(key, String(value));
  });
};

const createNSElement = (type: string): Element =>
  document.createElementNS("http://www.w3.org/2000/svg", type);

const tspan = (className: string, unit?: string): Element => {
  const element = createNSElement("tspan");

  element.classList.add(className);
  if (unit) element.textContent = unit;
  return element;
};

const dashOffset = (count: number, inverse?: boolean, cut?: number): number => {
  const cutChar = cut ? (CIRCUMFERENCE / 100) * (100 - cut) : CIRCUMFERENCE;
  const angle = CIRCUMFERENCE - (count / 100) * cutChar;

  // https://github.com/tomickigrzegorz/circular-progress-bar/issues/87
  // inverse option is not working in ios safari
  return inverse ? -angle : angle;
};

const insertAdElement = (
  element: Element,
  el: Element,
  type: InsertPosition = "beforeend",
): Element | null => element.insertAdjacentElement(type, el);

const gradient = ({
  index,
  lineargradient,
}: Pick<CPBOptions, "index" | "lineargradient">): Element => {
  const defsElement = createNSElement("defs");
  const linearGradient = createNSElement("linearGradient") as SVGLinearGradientElement;
  linearGradient.id = `linear-${index}`;

  const colors = [...(lineargradient as string[])];
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

const createPercentElement = (options: CPBOptions, className: string): Element => {
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

  const obj: Record<string, unknown> = {
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
