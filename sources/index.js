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
    return `rgba(${c >> 16}, ${(c & 0xff00) >> 8}, ${c & 0xff}, ${opacity / 100
      })`;
  };

  progressBar = (svg, target, options) => {
    const {
      index,
      number,
      stroke,
      round,
      lineargradient,
      colorSlice,
      colorCircle,
      opacity,
      size,
    } = options;

    if (number) {
      svg.insertBefore(this.percentElement(options), svg.firstElementChild);
    }

    const element = document.querySelector(`.${this.pieName}-circle-${index}`);
    const config = {
      fill: 'none',
      transform: 'rotate(-90, 50, 50)',
      'stroke-width': stroke,
      'stroke-linecap': round ? 'round' : '',
    };
    this.setAttr(element, config, false);

    // animation
    this.animationTo({ ...options, element }, true);

    // set linear gradient
    element.setAttribute(
      'stroke',
      lineargradient ? `url(#linear-${index})` : colorSlice
    );

    // box shadow
    const boxShadow = !colorCircle
      // eslint-disable-next-line prettier/prettier
      ? `border-radius:50%;box-shadow:inset 0px 0px ${stroke}px ${stroke}px ${this.hex2rgb(colorSlice, opacity)}`
      : '';

    // set width and height on div
    target.setAttribute(
      'style',
      `width:${size}px;height:${size}px;position:relative;${boxShadow}`
    );
  };

  animationTo = (options, initial = false) => {
    // round if number is decimal
    const percent = Math.round(options.percent);

    const element = document.querySelector(
      `.${this.pieName}-circle-${options.index}`
    );
    if (!element) return;

    // get numer percent from data-angel
    let angle = JSON.parse(element.getAttribute('data-angel'));

    const config = initial ? options : { ...defaultOptions, ...options };
    const place = document.querySelector(
      `.${this.pieName}-percent-${options.index}`
    );

    if (percent > 100 || percent < 0 || angle === percent) return;

    let request;
    let i = initial ? 0 : angle;
    const performAnimation = () => {
      if (angle >= config.percent) {
        i--;
      } else {
        i++;
      }

      request = requestAnimationFrame(performAnimation);

      element.setAttribute('stroke-dasharray', i * 2.64 + ', 20000');
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
  percentElement = ({ index, fontSize, fontWeight, fontColor }) => {
    const text = document.createElementNS(this.svg, 'text');
    const config = {
      class: `${this.pieName}-percent-${index}`,
      x: '50%',
      y: '50%',
      'font-size': fontSize,
      'font-weight': fontWeight,
      fill: fontColor,
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
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

  circleSvg = ({ index, colorCircle, stroke }, where, setAngel = false) => {
    const circle = document.createElementNS(this.svg, 'circle');
    const objCircle = {
      fill: 'none',
      stroke: colorCircle,
      'stroke-width': stroke,
    };
    const typeCircle =
      where === 'top'
        ? { class: `${this.pieName}-circle-${index}` }
        : objCircle;

    const config = {
      cx: 50,
      cy: 50,
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
