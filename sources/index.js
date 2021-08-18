import defaultOptions from './defaults';

class CircularProgressBar {
  constructor(pieName) {
    this.pieName = pieName;
    this.svg = 'http://www.w3.org/2000/svg';
    const pieElements = document.querySelectorAll(`.${pieName}`);

    const elements = [].slice.call(pieElements);
    // add index to all progressbar
    elements.map((item, index) => {
      item.setAttribute('data-index', index + 1);
    });

    this.initial(elements);
  }

  initial = (elements) => {
    if ('IntersectionObserver' in window) {
      const config = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      };

      const ovserver = new IntersectionObserver((entries, observer) => {
        entries.map((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.75) {
            this.createSvg(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, config);

      elements.map((item) => {
        ovserver.observe(item);
      });
    } else {
      elements.map((element) => {
        this.createSvg(element);
      });
    }
  };

  hex2rgb = (hex, opacity = 10) => {
    const c =
      typeof hex === 'string' ? parseInt(hex.replace('#', ''), 16) : hex;
    return `rgba(${c >> 16}, ${(c & 0xff00) >> 8}, ${c & 0xff}, ${
      opacity / 100
    })`;
  };

  progressBar = (svg, target, options) => {
    if (options.number) {
      svg.insertBefore(this.percentElement(options), svg.firstElementChild);
    }

    const element = document.querySelector(
      `.${this.pieName}-circle-${options.index}`
    );

    const config = {
      fill: 'none',
      'stroke-width': options.stroke,
      'stroke-dasharray': 264,
      'stroke-linecap': options.round ? 'round' : '',
    };

    this.setAttr(element, config, false);

    element.setAttribute(
      'style',
      `transform:rotate(${
        options.rotation || -90
      }deg);transform-origin: 50% 50%`
    );

    // animation
    this.animationTo({ ...options, element }, true);

    // set linear gradient
    element.setAttribute(
      'stroke',
      options.lineargradient
        ? `url(#linear-${options.index})`
        : options.colorSlice
    );

    // box shadow
    const boxShadow = !options.colorCircle
      ? `border-radius:50%;box-shadow:inset 0px 0px ${options.stroke}px ${
          options.stroke
        }px ${this.hex2rgb(options.colorSlice, options.opacity)}`
      : '';

    // set width and height on div
    target.setAttribute(
      'style',
      `width:${options.size}px;height:${options.size}px;position:relative;${boxShadow}`
    );
  };

  getDashOffset = (count, inverse, cut) => {
    const cutChar = cut ? (264 / 100) * (100 - cut) : 264;
    const angle = 264 - (count / 100) * cutChar;

    return inverse ? -angle : angle;
  };

  animationTo = (options, initial = false) => {
    // round if number is decimal
    const percent = Math.round(options.percent);

    const previousConfigObj = JSON.parse(
      document.querySelector(`[data-index="${options.index}"]`).dataset.pie
    );

    const element = document.querySelector(
      `.${this.pieName}-circle-${options.index}`
    );

    if (!element) return;

    // get numer percent from data-angel
    let angle = JSON.parse(element.getAttribute('data-angel'));

    const config = initial
      ? options
      : { ...defaultOptions, ...previousConfigObj, ...options };

    const place = document.querySelector(
      `.${this.pieName}-percent-${options.index}`
    );

    if (config.animationOff) {
      if (config.number) place.textContent = `${config.percent}%`;
      element.setAttribute(
        'stroke-dashoffset',
        this.getDashOffset(config.percent, config.inverse)
      );
      return;
    }

    // if percent 0 then set at start 0%
    if (percent == 0) {
      if (config.number) place.textContent = '0%';
      element.setAttribute('stroke-dashoffset', 264);
    }

    if (percent > 100 || percent <= 0 || angle === percent) return;

    let request;
    let i = initial ? 0 : angle;

    const fps = config.speed || 1000;
    const interval = 1000 / fps;
    const tolerance = 0.1;
    let then = performance.now();

    const performAnimation = (now) => {
      request = requestAnimationFrame(performAnimation);
      const delta = now - then;

      if (delta >= interval - tolerance) {
        then = now - (delta % interval);

        angle >= config.percent ? i-- : i++;
      }

      element.setAttribute(
        'stroke-dashoffset',
        this.getDashOffset(i, config.inverse, config.cut)
      );
      if (place && config.number) {
        place.textContent = `${i}%`;
      }
      if (i === percent) {
        element.setAttribute('data-angel', i);
        cancelAnimationFrame(request);
      }
    };

    requestAnimationFrame(performAnimation);
  };

  // set text element
  percentElement = (options) => {
    const text = document.createElementNS(this.svg, 'text');

    const config = {
      class: `${this.pieName}-percent-${options.index}`,
      x: '50%',
      y: '50%',
      fill: options.fontColor,
      'font-size': options.fontSize,
      'font-weight': options.fontWeight,
      'text-anchor': 'middle',
      dy: options.textPosition || '0.35em',
    };

    this.setAttr(text, config, false);
    return text;
  };

  createSvg = (element) => {
    const json = JSON.parse(element.getAttribute('data-pie'));
    const index = element.getAttribute('data-index');

    const options = { ...defaultOptions, ...json, index };

    const svg = document.createElementNS(this.svg, 'svg');
    const config = {
      role: 'img',
      width: options.size,
      height: options.size,
      viewBox: '0 0 100 100',
    };

    this.setAttr(svg, config, false);

    if (options.colorCircle) {
      svg.appendChild(this.circleSvg(options, 'bottom'));
    }

    if (options.lineargradient) {
      svg.appendChild(this.gradient(options));
    }

    svg.appendChild(this.circleSvg(options, 'top', true));

    element.appendChild(svg);

    this.progressBar(svg, element, options);
  };

  gradient = ({ index, lineargradient }) => {
    const defs = document.createElementNS(this.svg, 'defs');
    const linearGradient = document.createElementNS(this.svg, 'linearGradient');
    linearGradient.id = `linear-${index}`;

    const countGradient = [].slice.call(lineargradient);

    defs.appendChild(linearGradient);

    let number = 0;
    countGradient.map((item) => {
      const stop = document.createElementNS(this.svg, 'stop');

      const obj = {
        offset: `${number}%`,
        'stop-color': `${item}`,
      };
      this.setAttr(stop, obj, false);

      linearGradient.appendChild(stop);
      number += 100 / (countGradient.length - 1);
    });

    return defs;
  };

  circleSvg = (options, where, setAngel = false) => {
    const circle = document.createElementNS(this.svg, 'circle');

    let configCircle = {};
    if (options.cut) {
      const dashoffset = 264 - (100 - options.cut) * 2.64;
      configCircle = {
        'stroke-dasharray': 264,
        'stroke-linecap': options.round ? 'round' : '',
        'stroke-dashoffset': options.inverse ? -dashoffset : dashoffset,
        style: `transform:rotate(${
          options.rotation || -90
        }deg);transform-origin: 50% 50%`,
      };
    }

    const objCircle = {
      fill: 'none',
      stroke: options.colorCircle,
      'stroke-width': options.strokeBottom || options.stroke,
      ...configCircle,
    };

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

    this.setAttr(circle, config, false);

    return circle;
  };

  setAttr = (element, object, type = false) => {
    for (const key in object) {
      if (type) {
        element.setAttributeNS(null, key, object[key]);
      } else {
        element.setAttribute(key, object[key]);
      }
    }
  };
}

export default CircularProgressBar;
