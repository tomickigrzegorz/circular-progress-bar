import defaultOptions from "./helpers/defaults";
import {
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
} from "./helpers/function";

/**
 * @class
 */
export default class CircularProgressBar {
  /**
   * CircularProgressBar constructor
   *
   * @param {String} pieName - class name
   * @param {Object} globalObj - global configuration
   */
  constructor(pieName, globalObj = {}) {
    this._className = pieName;
    this._globalObj = globalObj;

    const pieElements = document.querySelectorAll(`.${pieName}`);
    const elements = [].slice.call(pieElements);
    // add index to all progressbar
    elements.map((item, idx) => {
      const id = JSON.parse(item.getAttribute("data-pie"));
      item.setAttribute(
        "data-pie-index",
        id.index || globalObj.index || idx + 1,
      );
    });

    this._elements = elements;
  }

  /**
   * @param {object} outside
   */
  initial(outside) {
    const triggeredOutside = outside || this._elements;
    Array.isArray(triggeredOutside)
      ? triggeredOutside.map((element) => this._createSVG(element))
      : this._createSVG(triggeredOutside);
  }

  /**
   * @param {SVGAElement} svg
   * @param {HTMLElement} target
   * @param {Object} options
   */
  _progress(svg, target, options) {
    const pieName = this._className;
    if (options.number) {
      insertAdElement(svg, percent(options, pieName));
    }

    const progressCircle = querySelector(`.${pieName}-circle-${options.index}`);

    const configCircle = {
      fill: "none",
      "stroke-width": options.stroke,
      "stroke-dashoffset": "264",
      ...strokeDasharray(),
      ...strokeLinecap(options),
    };
    setAttribute(progressCircle, configCircle);

    // animation progress
    this.animationTo({ ...options, element: progressCircle }, true);

    // set style and rotation
    progressCircle.setAttribute("style", styleTransform(options));

    // set color
    setColor(progressCircle, options);

    // set width and height on div
    target.setAttribute(
      "style",
      `width:${options.size}px;height:${options.size}px;`,
    );
  }

  /**
   * Callback function
   *
   * @param {Object} options
   * @param {Boolean} initial
   */
  animationTo(options, initial = false) {
    const pieName = this._className;
    const previousConfigObj = JSON.parse(
      querySelector(`[data-pie-index="${options.index}"]`).getAttribute(
        "data-pie",
      ),
    );

    const circleElement = querySelector(`.${pieName}-circle-${options.index}`);

    if (!circleElement) return;

    // merging all configuration objects
    const commonConfiguration = initial
      ? options
      : {
          ...defaultOptions,
          ...previousConfigObj,
          ...options,
          ...this._globalObj,
        };

    // update color circle
    if (!initial) {
      setColor(circleElement, commonConfiguration);
    }

    // font color update
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

    const centerNumber = querySelector(`.${pieName}-percent-${options.index}`);

    if (commonConfiguration.animationOff) {
      if (commonConfiguration.number)
        centerNumber.textContent = `${commonConfiguration.percent}`;
      circleElement.setAttribute(
        "stroke-dashoffset",
        dashOffset(commonConfiguration.percent * ((100 - (commonConfiguration.cut || 0)) / 100), commonConfiguration.inverse),
      );
      return;
    }

    // get numer percent from data-angel
    let angle = JSON.parse(circleElement.getAttribute("data-angel"));

    // round if number is decimal
    const percent = Math.round(options.percent);

    // if percent 0 then set at start 0%
    if (percent === 0) {
      if (commonConfiguration.number) centerNumber.textContent = "0";
      circleElement.setAttribute("stroke-dashoffset", "264");
    }

    if (percent > 100 || percent < 0 || angle === percent) return;

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

        // angle >= commonConfiguration.percent ? i-- : i++;
        i = i < commonConfiguration.percent ? i + 1 : i - 1;
      }

      circleElement.setAttribute(
        "stroke-dashoffset",
        dashOffset(i, commonConfiguration.inverse, commonConfiguration.cut),
      );
      if (centerNumber && commonConfiguration.number) {
        centerNumber.textContent = `${i}`;
      }

      circleElement.setAttribute("data-angel", i);
      circleElement.parentNode.setAttribute("aria-valuenow", i);

      if (i === percent) {
        cancelAnimationFrame(request);
      }

      // return;
    };

    requestAnimationFrame(performAnimation);
  }

  /**
   * Create svg elements
   *
   * @param {HTMLElement} element
   */
  _createSVG(element) {
    const index = element.getAttribute("data-pie-index");
    const json = JSON.parse(element.getAttribute("data-pie"));

    const options = { ...defaultOptions, ...json, index, ...this._globalObj };

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

    // colorCircle
    if (options.colorCircle) {
      svg.appendChild(this._circle(options));
    }

    // gradient
    if (options.lineargradient) {
      svg.appendChild(gradient(options));
    }

    svg.appendChild(this._circle(options, "top"));

    element.appendChild(svg);

    this._progress(svg, element, options);
  }

  /**
   * Create circle top/bottom
   *
   * @param {Object} options
   * @param {String} where
   * @returns {SVGElement}
   */
  _circle(options, where = "bottom") {
    const circle = createNSElement("circle");

    let configCircle = {};
    if (options.cut) {
      const dashoffset = 264 - (100 - options.cut) * 2.64;
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
