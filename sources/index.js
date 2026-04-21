import defaultOptions from "./helpers/defaults.js";
import {
  arcGradient,
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
} from "./helpers/function.js";

/** Animated circular SVG progress bar */
export default class CircularProgressBar {
  _className;
  _globalObj;
  _elements;

  /** Queries all elements matching the class name and assigns data-pie-index attributes */
  constructor(pieName, globalObj = {}) {
    this._className = pieName;
    this._globalObj = globalObj;

    const pieElements = document.querySelectorAll(`.${pieName}`);
    const elements = [...pieElements];

    elements.forEach((item, idx) => {
      const config = JSON.parse(item.getAttribute("data-pie") ?? "{}");
      item.setAttribute(
        "data-pie-index",
        String(config.index || globalObj.index || idx + 1),
      );
    });

    this._elements = elements;
  }

  /** Creates SVG elements and starts the initial animation for all matching elements */
  initial(outside) {
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
  _progress(svg, target, options) {
    const pieName = this._className;
    if (options.number) {
      insertAdElement(svg, createPercentElement(options, pieName));
    }

    const progressCircle = querySelector(`.${pieName}-circle-${options.index}`);
    if (!progressCircle) return;

    const configCircle = {
      fill: "none",
      "stroke-width": options.stroke,
      "stroke-dashoffset": String(CIRCUMFERENCE),
      ...strokeDasharray(),
      ...(options.gradient
        ? { "stroke-linecap": "butt" }
        : strokeLinecap(options)),
    };
    setAttribute(progressCircle, configCircle);

    this.animationTo({ ...options, element: progressCircle }, true);

    if (!options.gradient) {
      progressCircle.setAttribute("style", styleTransform(options));
    }

    if (!options.gradient) {
      setColor(progressCircle, options);
    }

    target.setAttribute(
      "style",
      `width:${options.size}px;height:${options.size}px;`,
    );
  }

  /** Animates the progress bar to a new percent value; also used internally on initial render */
  animationTo(options, initial = false) {
    const pieName = this._className;

    const pieEl = querySelector(`[data-pie-index="${options.index}"]`);
    if (!pieEl) return;

    const dataPie = pieEl.getAttribute("data-pie");
    if (!dataPie) return;

    const previousConfigObj = JSON.parse(dataPie);

    const circleElement = querySelector(`.${pieName}-circle-${options.index}`);
    if (!circleElement) return;

    const capElement = querySelector(
      `.${pieName}-gradient-cap-${options.index}`,
    );

    const commonConfiguration = initial
      ? options
      : {
          ...defaultOptions,
          ...previousConfigObj,
          ...options,
          ...this._globalObj,
          index: String(options.index),
        };

    if (!initial && !commonConfiguration.gradient) {
      setColor(circleElement, commonConfiguration);
    }

    if (!initial && commonConfiguration.number) {
      const fontconfig = {
        fill: commonConfiguration.fontColor,
        ...fontSettings(commonConfiguration),
      };
      const textElement = querySelector(
        `.${pieName}-text-${commonConfiguration.index}`,
      );
      setAttribute(textElement, fontconfig);
    }

    const updateGradientCap = (percent) => {
      if (
        !commonConfiguration.gradient ||
        !commonConfiguration.round ||
        !capElement
      )
        return;

      const cut = commonConfiguration.cut || 0;

      // For a full circle (cut=0), there is no visible end at 100%, so hide cap.
      if (percent <= 0 || (cut === 0 && percent >= 100)) {
        capElement.setAttribute("display", "none");
        return;
      }

      const span = 360 * ((100 - cut) / 100);
      const direction = commonConfiguration.inverse ? -1 : 1;
      const baseRotation = commonConfiguration.rotation ?? -90;
      const theta =
        ((baseRotation + direction * ((percent / 100) * span)) * Math.PI) / 180;

      const x = 50 + 42 * Math.cos(theta);
      const y = 50 + 42 * Math.sin(theta);

      capElement.setAttribute("cx", String(x));
      capElement.setAttribute("cy", String(y));
      capElement.setAttribute(
        "r",
        String((commonConfiguration.stroke ?? 10) / 2),
      );
      capElement.setAttribute("display", "inline");

      const segments = pieEl.querySelectorAll("g[mask] circle");
      if (segments.length > 0) {
        const index = Math.max(
          0,
          Math.min(
            segments.length - 1,
            Math.floor((percent / 100) * segments.length),
          ),
        );
        const color = segments[index]?.getAttribute("stroke");
        if (color) {
          capElement.setAttribute("fill", color);
        }
      }
    };

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
      updateGradientCap(commonConfiguration.percent ?? 0);
      return;
    }

    const angle = JSON.parse(circleElement.getAttribute("data-angle") ?? "0");

    const targetPercent = Math.round(options.percent ?? 0);

    if (targetPercent === 0) {
      if (commonConfiguration.number && centerNumber) {
        centerNumber.textContent = "0";
      }
      circleElement.setAttribute("stroke-dashoffset", String(CIRCUMFERENCE));
    }

    if (targetPercent > 100 || targetPercent < 0) return;

    if (angle === targetPercent) {
      updateGradientCap(targetPercent);
      return;
    }

    let request;
    let i = initial ? 0 : angle;

    const fps = commonConfiguration.speed || 1000;
    const interval = 1000 / fps;
    const tolerance = 0.1;
    let then = performance.now();

    const performAnimation = (now) => {
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

      updateGradientCap(i);

      if (centerNumber && commonConfiguration.number) {
        centerNumber.textContent = `${i}`;
      }

      circleElement.setAttribute("data-angle", String(i));
      circleElement.parentNode?.setAttribute("aria-valuenow", String(i));

      if (i === targetPercent) {
        cancelAnimationFrame(request);
      }
    };

    requestAnimationFrame(performAnimation);
  }

  /** Builds the full SVG structure for a single progress bar element */
  _createSVG(element) {
    const index = element.getAttribute("data-pie-index");
    const dataPie = element.getAttribute("data-pie");

    if (!dataPie) return;
    if (!index) return;

    const json = JSON.parse(dataPie);
    const options = {
      ...defaultOptions,
      ...json,
      ...this._globalObj,
      index: String(this._globalObj.index ?? index),
    };

    const svg = createNSElement("svg");

    const configSVG = {
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

    if (options.gradient) {
      const { mask, group, cap } = arcGradient(options, this._className);
      svg.appendChild(mask);
      svg.appendChild(group);
      svg.appendChild(cap);
    } else {
      if (options.lineargradient) {
        svg.appendChild(gradient(options));
      }
      svg.appendChild(this._circle(options, "top"));
    }

    element.appendChild(svg);

    this._progress(svg, element, options);
  }

  /** Creates a circle element — "bottom" is the background track, "top" is the animated progress arc */
  _circle(options, where = "bottom") {
    const circle = createNSElement("circle");

    let configCircle = {};
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

    const objCircle = {
      fill: options.fill,
      stroke: options.colorCircle,
      "stroke-width": options.strokeBottom || options.stroke,
      ...configCircle,
    };

    if (options.strokeDasharray) {
      Object.assign(objCircle, { ...strokeDasharray(options.strokeDasharray) });
    }

    const typeCircle =
      where === "top"
        ? { class: `${this._className}-circle-${options.index}` }
        : objCircle;

    const objConfig = {
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
