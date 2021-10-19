import defaultOptions from './defaults';

class CircularProgressBar {
  constructor(pieName) {
    this.pieName = pieName;
    this.svg = 'http://www.w3.org/2000/svg';
    const pieElements = document.querySelectorAll(`.${pieName}`);

    const elements = [].slice.call(pieElements);
    // add index to all progressbar
    elements.map((item, index) => {
      item.setAttribute('data-pie-index', index + 1);
    });

    this.elements = elements;
  }

  initial = (outside) => {
    const triggeredOutside = outside || this.elements;
    Array.isArray(triggeredOutside)
      ? triggeredOutside.map((element) => this.elSVG(element))
      : this.elSVG(triggeredOutside);
  };

  progress = (svg, target, options) => {
    if (options.number) {
      svg.insertAdjacentElement('beforeend', this.percent(options));
    }

    const progressCircle = document.querySelector(
      `.${this.pieName}-circle-${options.index}`
    );

    const configCircle = {
      fill: 'none',
      'stroke-width': options.stroke,
      'stroke-dasharray': '264',
      'stroke-linecap': options.round ? 'round' : '',
    };
    this.attr(progressCircle, configCircle);

    // animation progress
    this.animationTo({ ...options, element: progressCircle }, true);

    // set style and rotation
    progressCircle.setAttribute(
      'style',
      `transform:rotate(${options.rotation}deg);transform-origin: 50% 50%`
    );

    // set color
    this.color(progressCircle, options);

    // set width and height on div
    target.setAttribute(
      'style',
      `width:${options.size}px;height:${options.size}px;`
    );
  };

  // set color colorSlice
  color = (element, { lineargradient, index, colorSlice }) => {
    element.setAttribute(
      'stroke',
      lineargradient ? `url(#linear-${index})` : colorSlice
    );
  };

  dashOffset = (count, inverse, cut) => {
    const cutChar = cut ? (264 / 100) * (100 - cut) : 264;
    const angle = 264 - (count / 100) * cutChar;

    return inverse ? -angle : angle;
  };

  // claback function
  animationTo = (options, initial = false) => {
    const pieName = this.pieName;
    const previousConfigObj = JSON.parse(
      document
        .querySelector(`[data-pie-index="${options.index}"]`)
        .getAttribute('data-pie')
    );

    const circleElement = document.querySelector(
      `.${pieName}-circle-${options.index}`
    );

    if (!circleElement) return;

    const commonConfiguration = initial
      ? options
      : { ...defaultOptions, ...previousConfigObj, ...options };

    // update color circle
    if (!initial) {
      this.color(circleElement, commonConfiguration);
    }

    // font color update
    if (!initial && commonConfiguration.number) {
      const fontconfig = {
        fill: commonConfiguration.fontColor,
        'font-size': commonConfiguration.fontSize,
        'font-weight': commonConfiguration.fontWeight,
      };
      const textElement = document.querySelector(
        `.${pieName}-text-${commonConfiguration.index}`
      );
      this.attr(textElement, fontconfig);
    }

    const centerNumber = document.querySelector(
      `.${pieName}-percent-${options.index}`
    );

    if (commonConfiguration.animationOff) {
      if (commonConfiguration.number)
        centerNumber.textContent = `${commonConfiguration.percent}`;
      circleElement.setAttribute(
        'stroke-dashoffset',
        this.dashOffset(
          commonConfiguration.percent,
          commonConfiguration.inverse
        )
      );
      return;
    }

    // get numer percent from data-angel
    let angle = JSON.parse(circleElement.getAttribute('data-angel'));

    // round if number is decimal
    const percent = Math.round(options.percent);

    // if percent 0 then set at start 0%
    if (percent == 0) {
      if (commonConfiguration.number) centerNumber.textContent = '0';
      circleElement.setAttribute('stroke-dashoffset', '264');
    }

    if (percent > 100 || percent <= 0 || angle === percent) return;

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

        angle >= commonConfiguration.percent ? i-- : i++;
      }

      circleElement.setAttribute(
        'stroke-dashoffset',
        this.dashOffset(i, commonConfiguration.inverse, commonConfiguration.cut)
      );
      if (centerNumber && commonConfiguration.number) {
        centerNumber.textContent = `${i}`;
      }
      if (i === percent) {
        circleElement.setAttribute('data-angel', i);
        cancelAnimationFrame(request);
      }
    };

    requestAnimationFrame(performAnimation);
  };

  // set text element
  percent = (options) => {
    const pieName = this.pieName;
    const creatTextElementSVG = this.creNS('text');

    creatTextElementSVG.classList.add(`${pieName}-text-${options.index}`);

    // create tspan element with number
    // and insert to svg text element
    creatTextElementSVG.insertAdjacentElement(
      'afterbegin',
      this.tspan(`${pieName}-percent-${options.index}`)
    );

    // create and insert unit to text element
    creatTextElementSVG.insertAdjacentElement(
      'beforeend',
      this.tspan(`${pieName}-unit-${options.index}`, options.unit)
    );

    // config to svg text
    const config = {
      x: '50%',
      y: '50%',
      fill: options.fontColor,
      'font-size': options.fontSize,
      'font-weight': options.fontWeight,
      'text-anchor': 'middle',
      dy: options.textPosition || '0.35em',
    };

    this.attr(creatTextElementSVG, config);
    return creatTextElementSVG;
  };

  tspan = (className, unit) => {
    const tspan = this.creNS('tspan');
    tspan.classList.add(className);
    if (unit) tspan.textContent = unit;
    return tspan;
  };

  elSVG = (element) => {
    const index = element.getAttribute('data-pie-index');
    const json = JSON.parse(element.getAttribute('data-pie'));

    const options = { ...defaultOptions, ...json, index };

    const svgElement = this.creNS('svg');

    const configSVG = {
      role: 'img',
      width: options.size,
      height: options.size,
      viewBox: '0 0 100 100',
    };

    this.attr(svgElement, configSVG);

    // colorCircle
    if (options.colorCircle) {
      svgElement.appendChild(this.circle(options, 'bottom'));
    }

    // gradient
    if (options.lineargradient) {
      svgElement.appendChild(this.gradient(options));
    }

    svgElement.appendChild(this.circle(options, 'top', true));

    element.appendChild(svgElement);

    this.progress(svgElement, element, options);
  };

  gradient = ({ index, lineargradient }) => {
    const defs = this.creNS('defs');
    const linearGradient = this.creNS('linearGradient');
    linearGradient.id = `linear-${index}`;

    const countGradient = [].slice.call(lineargradient);

    defs.appendChild(linearGradient);

    let number = 0;
    countGradient.map((item) => {
      const stopElements = this.creNS('stop');

      const stopObj = {
        offset: `${number}%`,
        'stop-color': `${item}`,
      };
      this.attr(stopElements, stopObj);

      linearGradient.appendChild(stopElements);
      number += 100 / (countGradient.length - 1);
    });

    return defs;
  };

  circle = (options, where, setAngel = false) => {
    const circle = this.creNS('circle');

    let configCircle = {};
    if (options.cut) {
      const dashoffset = 264 - (100 - options.cut) * 2.64;
      configCircle = {
        'stroke-dasharray': '264',
        'stroke-linecap': options.round ? 'round' : '',
        'stroke-dashoffset': options.inverse ? -dashoffset : dashoffset,
        style: `transform:rotate(${options.rotation}deg);transform-origin: 50% 50%`,
      };
    }

    const objCircle = {
      fill: options.fill,
      stroke: options.colorCircle,
      'stroke-width': options.strokeBottom || options.stroke,
      ...configCircle,
    };

    if (options.strokeDasharray) {
      Object.assign(objCircle, { 'stroke-dasharray': options.strokeDasharray });
    }

    const typeCircle =
      where === 'top'
        ? { class: `${this.pieName}-circle-${options.index}` }
        : objCircle;

    const config = {
      cx: '50%',
      cy: '50%',
      r: 42,
      'shape-rendering': 'geometricPrecision',
      'data-angle': setAngel ? 0 : '',
      ...typeCircle,
    };

    this.attr(circle, config);

    return circle;
  };

  creNS = (type) => document.createElementNS(this.svg, type);

  attr = (element, object) => {
    for (const key in object) {
      element?.setAttribute(key, object[key]);
    }
  };
}

export default CircularProgressBar;
