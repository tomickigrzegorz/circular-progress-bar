var CircularProgressBar = (function () {
  'use strict';

  const defaultOptions = {
    colorSlice: '#00a1ff',
    fontColor: '#000',
    fontSize: '1.6rem',
    fontWeight: 400,
    lineargradient: false,
    number: true,
    round: false,
    fill: 'none',
    unit: '%',
    rotation: -90,
    size: 200,
    stroke: 10
  };

  const styleTransform = ({
    rotation,
    animationSmooth
  }) => {
    const smoothAnimation = animationSmooth ? `transition: stroke-dashoffset ${animationSmooth}` : '';
    return `transform:rotate(${rotation}deg);transform-origin: 50% 50%;${smoothAnimation}`;
  };
  const strokeDasharray = type => {
    return {
      'stroke-dasharray': type || '264'
    };
  };
  const strokeLinecap = ({
    round
  }) => {
    return {
      'stroke-linecap': round ? 'round' : ''
    };
  };
  const fontSettings = options => {
    return {
      'font-size': options.fontSize,
      'font-weight': options.fontWeight
    };
  };
  const querySelector = element => document.querySelector(element);
  const setColor = (element, {
    lineargradient,
    index,
    colorSlice
  }) => {
    element.setAttribute('stroke', lineargradient ? `url(#linear-${index})` : colorSlice);
  };
  const setAttribute = (element, object) => {
    for (const key in object) {
      element == null ? void 0 : element.setAttribute(key, object[key]);
    }
  };
  const createNSElement = type => document.createElementNS('http://www.w3.org/2000/svg', type);
  const tspan = (className, unit) => {
    const element = createNSElement('tspan');
    element.classList.add(className);
    if (unit) element.textContent = unit;
    return element;
  };
  const dashOffset = (count, inverse, cut) => {
    const cutChar = cut ? 264 / 100 * (100 - cut) : 264;
    const angle = 264 - count / 100 * cutChar;
    return inverse ? -angle : angle;
  };
  const insertAdElement = (element, el, type = 'beforeend') => element.insertAdjacentElement(type, el);
  const gradient = ({
    index,
    lineargradient
  }) => {
    const defsElement = createNSElement('defs');
    const linearGradient = createNSElement('linearGradient');
    linearGradient.id = `linear-${index}`;
    const countGradient = [].slice.call(lineargradient);
    defsElement.appendChild(linearGradient);
    let number = 0;
    countGradient.map(item => {
      const stopElements = createNSElement('stop');
      const stopObj = {
        offset: `${number}%`,
        'stop-color': `${item}`
      };
      setAttribute(stopElements, stopObj);
      linearGradient.appendChild(stopElements);
      number += 100 / (countGradient.length - 1);
    });
    return defsElement;
  };
  const percent = (options, className) => {
    const creatTextElementSVG = createNSElement('text');
    creatTextElementSVG.classList.add(`${className}-text-${options.index}`);
    insertAdElement(creatTextElementSVG, tspan(`${className}-percent-${options.index}`));
    insertAdElement(creatTextElementSVG, tspan(`${className}-unit-${options.index}`, options.unit));
    const obj = {
      x: '50%',
      y: '50%',
      fill: options.fontColor,
      'text-anchor': 'middle',
      dy: options.textPosition || '0.35em',
      ...fontSettings(options)
    };
    setAttribute(creatTextElementSVG, obj);
    return creatTextElementSVG;
  };

  class CircularProgressBar {
    constructor(pieName, globalObj = {}) {
      this._className = pieName;
      this._globalObj = globalObj;
      const pieElements = document.querySelectorAll(`.${pieName}`);
      const elements = [].slice.call(pieElements);
      elements.map((item, idx) => {
        const id = JSON.parse(item.getAttribute("data-pie"));
        item.setAttribute("data-pie-index", id.index || globalObj.index || idx + 1);
      });
      this._elements = elements;
    }
    initial(outside) {
      const triggeredOutside = outside || this._elements;
      Array.isArray(triggeredOutside) ? triggeredOutside.map(element => this._createSVG(element)) : this._createSVG(triggeredOutside);
    }
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
        ...strokeLinecap(options)
      };
      setAttribute(progressCircle, configCircle);
      this.animationTo({ ...options,
        element: progressCircle
      }, true);
      progressCircle.setAttribute("style", styleTransform(options));
      setColor(progressCircle, options);
      target.setAttribute("style", `width:${options.size}px;height:${options.size}px;`);
    }
    animationTo(options, initial = false) {
      const pieName = this._className;
      const previousConfigObj = JSON.parse(querySelector(`[data-pie-index="${options.index}"]`).getAttribute("data-pie"));
      const circleElement = querySelector(`.${pieName}-circle-${options.index}`);
      if (!circleElement) return;
      const commonConfiguration = initial ? options : { ...defaultOptions,
        ...previousConfigObj,
        ...options,
        ...this._globalObj
      };
      if (!initial) {
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
        if (commonConfiguration.number) centerNumber.textContent = `${commonConfiguration.percent}`;
        circleElement.setAttribute("stroke-dashoffset", dashOffset(commonConfiguration.percent, commonConfiguration.inverse));
        return;
      }
      let angle = JSON.parse(circleElement.getAttribute("data-angel"));
      const percent = Math.round(options.percent);
      if (percent == 0) {
        if (commonConfiguration.number) centerNumber.textContent = "0";
        circleElement.setAttribute("stroke-dashoffset", "264");
      }
      if (percent > 100 || percent <= 0 || angle === percent) return;
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
          angle >= commonConfiguration.percent ? i-- : i++;
        }
        circleElement.setAttribute("stroke-dashoffset", dashOffset(i, commonConfiguration.inverse, commonConfiguration.cut));
        if (centerNumber && commonConfiguration.number) {
          centerNumber.textContent = `${i}`;
        }
        circleElement.setAttribute("data-angel", i);
        circleElement.parentNode.setAttribute("aria-valuenow", i);
        if (i === percent) {
          cancelAnimationFrame(request);
        }
      };
      requestAnimationFrame(performAnimation);
    }
    _createSVG(element) {
      const index = element.getAttribute("data-pie-index");
      const json = JSON.parse(element.getAttribute("data-pie"));
      const options = { ...defaultOptions,
        ...json,
        index,
        ...this._globalObj
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
      if (options.lineargradient) {
        svg.appendChild(gradient(options));
      }
      svg.appendChild(this._circle(options, "top"));
      element.appendChild(svg);
      this._progress(svg, element, options);
    }
    _circle(options, where = "bottom") {
      const circle = createNSElement("circle");
      let configCircle = {};
      if (options.cut) {
        const dashoffset = 264 - (100 - options.cut) * 2.64;
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
        Object.assign(objCircle, { ...strokeDasharray(options.strokeDasharray)
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

})();
//# sourceMappingURL=circularProgressBar.js.map
