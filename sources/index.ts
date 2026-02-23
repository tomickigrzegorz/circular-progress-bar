import type { CPBOptions, InternalOptions } from "./helpers/defaults";
import defaultOptions from "./helpers/defaults";
import {
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
} from "./helpers/function";

/** Animated circular SVG progress bar */
export default class CircularProgressBar {
  private _className: string;
  private _globalObj: CPBOptions;
  private _elements: Element[];

  /** Queries all elements matching the class name and assigns data-pie-index attributes */
  constructor(pieName: string, globalObj: CPBOptions = {}) {
    this._className = pieName;
    this._globalObj = globalObj;

    const pieElements = document.querySelectorAll(`.${pieName}`);
    const elements = [...pieElements];

    elements.forEach((item, idx) => {
      const config = JSON.parse(
        item.getAttribute("data-pie") ?? "{}",
      ) as CPBOptions;
      item.setAttribute(
        "data-pie-index",
        String(config.index || globalObj.index || idx + 1),
      );
    });

    this._elements = elements;
  }

  /** Creates SVG elements and starts the initial animation for all matching elements */
  initial(outside?: Element | Element[]): void {
    const elements = outside || this._elements;
    if (Array.isArray(elements)) {
      elements.forEach((element) => {
        this._createSVG(element);
      });
    } else {
      this._createSVG(elements);
    }
  }

  /** Appends the percent text, configures the progress circle attributes, and triggers animation */
  private _progress(
    svg: Element,
    target: Element,
    options: InternalOptions,
  ): void {
    const pieName = this._className;
    if (options.number) {
      insertAdElement(svg, createPercentElement(options, pieName));
    }

    const progressCircle = querySelector(`.${pieName}-circle-${options.index}`);
    if (!progressCircle) return;

    const configCircle: Record<string, unknown> = {
      fill: "none",
      "stroke-width": options.stroke,
      "stroke-dashoffset": String(CIRCUMFERENCE),
      ...strokeDasharray(),
      ...strokeLinecap(options),
    };
    setAttribute(progressCircle, configCircle);

    this.animationTo({ ...options, element: progressCircle }, true);

    progressCircle.setAttribute("style", styleTransform(options));

    setColor(progressCircle, options);

    target.setAttribute(
      "style",
      `width:${options.size}px;height:${options.size}px;`,
    );
  }

  /** Animates the progress bar to a new percent value; also used internally on initial render */
  animationTo(
    options: CPBOptions & { index: string | number },
    initial = false,
  ): void {
    const pieName = this._className;

    const pieEl = querySelector(`[data-pie-index="${options.index}"]`);
    if (!pieEl) return;

    const dataPie = pieEl.getAttribute("data-pie");
    if (!dataPie) return;

    const previousConfigObj = JSON.parse(dataPie) as CPBOptions;

    const circleElement = querySelector(`.${pieName}-circle-${options.index}`);
    if (!circleElement) return;

    const commonConfiguration: InternalOptions = initial
      ? (options as InternalOptions)
      : {
          ...defaultOptions,
          ...previousConfigObj,
          ...options,
          ...this._globalObj,
          index: String(options.index),
        };

    if (!initial) {
      setColor(circleElement, commonConfiguration);
    }

    if (!initial && commonConfiguration.number) {
      const fontconfig: Record<string, unknown> = {
        fill: commonConfiguration.fontColor,
        ...fontSettings(commonConfiguration),
      };
      const textElement = querySelector(
        `.${pieName}-text-${commonConfiguration.index}`,
      );
      setAttribute(textElement, fontconfig);
    }

    const centerNumber = querySelector(`.${pieName}-percent-${options.index}`);

    if (commonConfiguration.animationOff) {
      if (commonConfiguration.number && centerNumber) {
        centerNumber.textContent = `${commonConfiguration.percent}`;
      }
      circleElement.setAttribute(
        "stroke-dashoffset",
        String(
          dashOffset(
            (commonConfiguration.percent ?? 0) *
              ((100 - (commonConfiguration.cut || 0)) / 100),
            commonConfiguration.inverse,
          ),
        ),
      );
      return;
    }

    const angle = JSON.parse(
      circleElement.getAttribute("data-angel") ?? "0",
    ) as number;

    const targetPercent = Math.round(options.percent ?? 0);

    if (targetPercent === 0) {
      if (commonConfiguration.number && centerNumber) {
        centerNumber.textContent = "0";
      }
      circleElement.setAttribute("stroke-dashoffset", String(CIRCUMFERENCE));
    }

    if (targetPercent > 100 || targetPercent < 0 || angle === targetPercent)
      return;

    let request: number;
    let i = initial ? 0 : angle;

    const fps = commonConfiguration.speed || 1000;
    const interval = 1000 / fps;
    const tolerance = 0.1;
    let then = performance.now();

    const performAnimation = (now: number): void => {
      request = requestAnimationFrame(performAnimation);
      const delta = now - then;

      if (delta >= interval - tolerance) {
        then = now - (delta % interval);
        i = i < (commonConfiguration.percent ?? 0) ? i + 1 : i - 1;
      }

      circleElement.setAttribute(
        "stroke-dashoffset",
        String(
          dashOffset(i, commonConfiguration.inverse, commonConfiguration.cut),
        ),
      );
      if (centerNumber && commonConfiguration.number) {
        centerNumber.textContent = `${i}`;
      }

      circleElement.setAttribute("data-angel", String(i));
      (circleElement.parentNode as Element | null)?.setAttribute(
        "aria-valuenow",
        String(i),
      );

      if (i === targetPercent) {
        cancelAnimationFrame(request);
      }
    };

    requestAnimationFrame(performAnimation);
  }

  /** Builds the full SVG structure for a single progress bar element */
  private _createSVG(element: Element): void {
    const index = element.getAttribute("data-pie-index");
    const dataPie = element.getAttribute("data-pie");

    if (!dataPie) return;
    if (!index) return;

    const json = JSON.parse(dataPie) as CPBOptions;
    const options: InternalOptions = {
      ...defaultOptions,
      ...json,
      ...this._globalObj,
      index: String(this._globalObj.index ?? index),
    };

    const svg = createNSElement("svg");

    const configSVG: Record<string, unknown> = {
      role: "progressbar",
      width: options.size,
      height: options.size,
      viewBox: "0 0 100 100",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
    };

    setAttribute(svg, configSVG);

    if (options.colorCircle) {
      svg.appendChild(this._circle(options));
    }

    if (options.lineargradient) {
      svg.appendChild(gradient(options));
    }

    svg.appendChild(this._circle(options, "top"));

    element.appendChild(svg);

    this._progress(svg, element, options);
  }

  /** Creates a circle element — "bottom" is the background track, "top" is the animated progress arc */
  private _circle(
    options: InternalOptions,
    where: "top" | "bottom" = "bottom",
  ): Element {
    const circle = createNSElement("circle");

    let configCircle: Record<string, unknown> = {};
    if (options.cut) {
      const dashoffset =
        CIRCUMFERENCE - (100 - (options.cut ?? 0)) * (CIRCUMFERENCE / 100);
      configCircle = {
        "stroke-dashoffset": options.inverse ? -dashoffset : dashoffset,
        style: styleTransform(options),
        ...strokeDasharray(),
        ...strokeLinecap(options),
      };
    }

    const objCircle: Record<string, unknown> = {
      fill: options.fill,
      stroke: options.colorCircle,
      "stroke-width": options.strokeBottom || options.stroke,
      ...configCircle,
    };

    if (options.strokeDasharray) {
      Object.assign(objCircle, { ...strokeDasharray(options.strokeDasharray) });
    }

    const typeCircle: Record<string, unknown> =
      where === "top"
        ? { class: `${this._className}-circle-${options.index}` }
        : objCircle;

    const objConfig: Record<string, unknown> = {
      cx: "50%",
      cy: "50%",
      r: 42,
      "shape-rendering": "geometricPrecision",
      ...typeCircle,
    };

    setAttribute(circle, objConfig);

    return circle;
  }
}
