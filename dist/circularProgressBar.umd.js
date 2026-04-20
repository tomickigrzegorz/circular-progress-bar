/*!
* @name circular-progress-bar
* @version 1.4.0
* @author Grzegorz Tomicki
* @link https://github.com/tomickigrzegorz/circular-progress-bar
* @license MIT
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CircularProgressBar = factory());
})(this, (function () { 'use strict';

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
    stroke: 10
  };

  const CIRCUMFERENCE = 264;
  const styleTransform = _ref => {
    let {
      rotation,
      animationSmooth
    } = _ref;
    const smoothAnimation = animationSmooth ? `transition: stroke-dashoffset ${animationSmooth}` : "";
    return `transform:rotate(${rotation}deg);transform-origin: 50% 50%;${smoothAnimation}`;
  };
  const strokeDasharray = type => {
    return {
      "stroke-dasharray": type || String(CIRCUMFERENCE)
    };
  };
  const strokeLinecap = _ref2 => {
    let {
      round
    } = _ref2;
    return {
      "stroke-linecap": round ? "round" : "butt"
    };
  };
  const fontSettings = options => {
    return {
      "font-size": options.fontSize,
      "font-weight": options.fontWeight
    };
  };
  const querySelector = element => document.querySelector(element);
  const setColor = (element, _ref3) => {
    let {
      lineargradient,
      index,
      colorSlice
    } = _ref3;
    element?.setAttribute("stroke", lineargradient ? `url(#linear-${index})` : colorSlice ?? "");
  };
  const setAttribute = (element, object) => {
    Object.entries(object).forEach(_ref4 => {
      let [key, value] = _ref4;
      element?.setAttribute(key, String(value));
    });
  };
  const createNSElement = type => document.createElementNS("http://www.w3.org/2000/svg", type);
  const tspan = (className, unit) => {
    const element = createNSElement("tspan");
    element.classList.add(className);
    if (unit) element.textContent = unit;
    return element;
  };
  const dashOffset = (count, inverse, cut) => {
    const cutChar = cut ? CIRCUMFERENCE / 100 * (100 - cut) : CIRCUMFERENCE;
    const angle = CIRCUMFERENCE - count / 100 * cutChar;
    return inverse ? -angle : angle;
  };
  const insertAdElement = function (element, el, type) {
    if (type === void 0) {
      type = "beforeend";
    }
    return element.insertAdjacentElement(type, el);
  };
  const gradient = _ref5 => {
    let {
      index,
      lineargradient
    } = _ref5;
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
        "stop-color": color
      });
      linearGradient.appendChild(stopElement);
    });
    return defsElement;
  };
  const createPercentElement = (options, className) => {
    const creatTextElementSVG = createNSElement("text");
    creatTextElementSVG.classList.add(`${className}-text-${options.index}`);
    insertAdElement(creatTextElementSVG, tspan(`${className}-percent-${options.index}`));
    insertAdElement(creatTextElementSVG, tspan(`${className}-unit-${options.index}`, options.unit));
    const obj = {
      x: "50%",
      y: "50%",
      fill: options.fontColor,
      "text-anchor": "middle",
      dy: options.textPosition || "0.35em",
      ...fontSettings(options)
    };
    setAttribute(creatTextElementSVG, obj);
    return creatTextElementSVG;
  };
  const hexToRgb = hex => {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
    return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
  };
  const buildStops = (gradient, gradientStops) => {
    const useEqual = !gradientStops || gradientStops.length !== gradient.length;
    return gradient.map((color, i) => ({
      pos: useEqual ? i / (gradient.length - 1) : Math.min(100, Math.max(0, gradientStops[i])) / 100,
      rgb: hexToRgb(color)
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
  const arcGradient = (options, className) => {
    const STEPS = 120;
    const segLen = CIRCUMFERENCE / STEPS;
    const gap = CIRCUMFERENCE - segLen;
    const stops = buildStops(options.gradient, options.gradientStops);
    const mask = createNSElement("mask");
    mask.id = `arc-gradient-mask-${options.index}`;
    const maskCircle = createNSElement("circle");
    setAttribute(maskCircle, {
      cx: "50%",
      cy: "50%",
      r: 42,
      fill: "none",
      stroke: "white",
      "stroke-width": options.stroke,
      "stroke-dasharray": String(CIRCUMFERENCE),
      "stroke-dashoffset": String(CIRCUMFERENCE),
      "shape-rendering": "geometricPrecision",
      ...strokeLinecap(options)
    });
    maskCircle.classList.add(`${className}-circle-${options.index}`);
    mask.appendChild(maskCircle);
    const group = createNSElement("g");
    group.setAttribute("style", `transform:rotate(${options.rotation ?? -90}deg);transform-origin:50% 50%;`);
    group.setAttribute("mask", `url(#arc-gradient-mask-${options.index})`);
    for (let i = 0; i < STEPS; i++) {
      const t = i / (STEPS - 1);
      const color = interpolateColor(stops, t);
      const dashoffset = CIRCUMFERENCE - i * segLen;
      const seg = createNSElement("circle");
      setAttribute(seg, {
        cx: "50%",
        cy: "50%",
        r: 42,
        fill: "none",
        stroke: color,
        "stroke-width": options.stroke,
        "stroke-dasharray": `${segLen + 0.5} ${gap}`,
        "stroke-dashoffset": String(dashoffset),
        "shape-rendering": "geometricPrecision"
      });
      group.appendChild(seg);
    }
    return {
      mask,
      group
    };
  };

  class CircularProgressBar {
    constructor(pieName, globalObj) {
      if (globalObj === void 0) {
        globalObj = {};
      }
      this._className = void 0;
      this._globalObj = void 0;
      this._elements = void 0;
      this._className = pieName;
      this._globalObj = globalObj;
      const pieElements = document.querySelectorAll(`.${pieName}`);
      const elements = [...pieElements];
      elements.forEach((item, idx) => {
        const config = JSON.parse(item.getAttribute("data-pie") ?? "{}");
        item.setAttribute("data-pie-index", String(config.index || globalObj.index || idx + 1));
      });
      this._elements = elements;
    }
    initial(outside) {
      const elements = outside || this._elements;
      if (Array.isArray(elements)) {
        elements.forEach(element => {
          this._createSVG(element);
        });
      } else {
        this._createSVG(elements);
      }
    }
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
        ...strokeLinecap(options)
      };
      setAttribute(progressCircle, configCircle);
      this.animationTo({
        ...options,
        element: progressCircle
      }, true);
      progressCircle.setAttribute("style", styleTransform(options));
      if (!options.gradient) {
        setColor(progressCircle, options);
      }
      target.setAttribute("style", `width:${options.size}px;height:${options.size}px;`);
    }
    animationTo(options, initial) {
      if (initial === void 0) {
        initial = false;
      }
      const pieName = this._className;
      const pieEl = querySelector(`[data-pie-index="${options.index}"]`);
      if (!pieEl) return;
      const dataPie = pieEl.getAttribute("data-pie");
      if (!dataPie) return;
      const previousConfigObj = JSON.parse(dataPie);
      const circleElement = querySelector(`.${pieName}-circle-${options.index}`);
      if (!circleElement) return;
      const commonConfiguration = initial ? options : {
        ...defaultOptions,
        ...previousConfigObj,
        ...options,
        ...this._globalObj,
        index: String(options.index)
      };
      if (!initial && !commonConfiguration.gradient) {
        setColor(circleElement, commonConfiguration);
      }
      if (!initial && commonConfiguration.number) {
        const fontconfig = {
          fill: commonConfiguration.fontColor,
          ...fontSettings(commonConfiguration)
        };
        const textElement = querySelector(`.${pieName}-text-${commonConfiguration.index}`);
        setAttribute(textElement, fontconfig);
      }
      const centerNumber = querySelector(`.${pieName}-percent-${options.index}`);
      if (commonConfiguration.animationOff) {
        if (commonConfiguration.number && centerNumber) {
          centerNumber.textContent = `${commonConfiguration.percent}`;
        }
        circleElement.setAttribute("stroke-dashoffset", String(dashOffset((commonConfiguration.percent ?? 0) * ((100 - (commonConfiguration.cut || 0)) / 100), commonConfiguration.inverse)));
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
      if (targetPercent > 100 || targetPercent < 0 || angle === targetPercent) return;
      let request;
      let i = initial ? 0 : angle;
      const fps = commonConfiguration.speed || 1000;
      const interval = 1000 / fps;
      const tolerance = 0.1;
      let then = performance.now();
      const performAnimation = now => {
        request = requestAnimationFrame(performAnimation);
        const delta = now - then;
        if (delta >= interval - tolerance) {
          then = now - delta % interval;
          i = i < (commonConfiguration.percent ?? 0) ? i + 1 : i - 1;
        }
        circleElement.setAttribute("stroke-dashoffset", String(dashOffset(i, commonConfiguration.inverse, commonConfiguration.cut)));
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
        index: String(this._globalObj.index ?? index)
      };
      const svg = createNSElement("svg");
      const configSVG = {
        role: "progressbar",
        width: options.size,
        height: options.size,
        viewBox: "0 0 100 100",
        "aria-valuemin": "0",
        "aria-valuemax": "100"
      };
      setAttribute(svg, configSVG);
      if (options.colorCircle) {
        svg.appendChild(this._circle(options));
      }
      if (options.gradient) {
        const {
          mask,
          group
        } = arcGradient(options, this._className);
        svg.appendChild(mask);
        svg.appendChild(group);
      } else {
        if (options.lineargradient) {
          svg.appendChild(gradient(options));
        }
        svg.appendChild(this._circle(options, "top"));
      }
      element.appendChild(svg);
      this._progress(svg, element, options);
    }
    _circle(options, where) {
      if (where === void 0) {
        where = "bottom";
      }
      const circle = createNSElement("circle");
      let configCircle = {};
      if (options.cut) {
        const dashoffset = CIRCUMFERENCE - (100 - (options.cut ?? 0)) * (CIRCUMFERENCE / 100);
        configCircle = {
          "stroke-dashoffset": options.inverse ? -dashoffset : dashoffset,
          style: styleTransform(options),
          ...strokeDasharray(),
          ...strokeLinecap(options)
        };
      }
      const objCircle = {
        fill: options.fill,
        stroke: options.colorCircle,
        "stroke-width": options.strokeBottom || options.stroke,
        ...configCircle
      };
      if (options.strokeDasharray) {
        Object.assign(objCircle, {
          ...strokeDasharray(options.strokeDasharray)
        });
      }
      const typeCircle = where === "top" ? {
        class: `${this._className}-circle-${options.index}`
      } : objCircle;
      const objConfig = {
        cx: "50%",
        cy: "50%",
        r: 42,
        "shape-rendering": "geometricPrecision",
        ...typeCircle
      };
      setAttribute(circle, objConfig);
      return circle;
    }
  }

  return CircularProgressBar;

}));
//# sourceMappingURL=circularProgressBar.umd.js.map
