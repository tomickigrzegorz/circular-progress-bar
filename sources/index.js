import defaultOptions from './defaults';

class CircularProgressBar {
  constructor(pieName) {
    this.pieName = pieName;
    this.pieElement = document.querySelectorAll(`.${pieName}`);
    this.svg = 'http://www.w3.org/2000/svg';
    this.xmlns = 'http://www.w3.org/2000/xmlns/';
    this.xlink = 'http://www.w3.org/1999/xlink';

    this.onChange(this.pieElement);
  }

  onChange = (elements) => {
    if ('IntersectionObserver' in window) {
      const config = {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      };

      let i = 0;
      const ovserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.75) {
            this.createSvg(entry.target, i);
            observer.unobserve(entry.target);
            i++;
          }
        });
      }, config);

      elements.forEach((item) => {
        ovserver.observe(item);
      });
    } else {
      for (let i = 0; i < elements.length; i++) {
        this.createSvg(elements[i], i);
      }
    }
  };

  hexTorgb = (hex, opacity) => {
    return (
      'rgba(' +
      // eslint-disable-next-line no-param-reassign
      (hex = hex.replace('#', ''))
        .match(new RegExp('(.{' + hex.length / 3 + '})', 'g'))
        .map(function (l) {
          return parseInt(hex.length % 2 ? l + l : l, 16);
        })
        .concat(opacity / 100 || 1)
        .join(',') +
      ')'
    );
  };

  circularBar = (svg, target, options) => {
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

    const element = document.querySelector(`.${this.pieName}-circle-${index}`);

    if (number) svg.appendChild(this.percentElement(options));

    element.setAttribute('fill', 'none');
    element.setAttribute('stroke-width', stroke);
    element.setAttribute('stroke-linecap', round ? 'round' : '');
    element.setAttribute('transform', `rotate(-90, 50, 50)`);

    // animation
    this.animationTo({ ...options, element }, true);

    // set linear gradient
    element.setAttribute(
      'stroke',
      lineargradient ? `url(#linear-${index})` : colorSlice
    );

    // box shadow
    const boxShadow = !colorCircle
      ? `border-radius: 50%; box-shadow: inset 0px 0px ${stroke}px ${stroke}px ${this.hexTorgb(colorSlice, opacity)}`
      : '';

    target.setAttribute(
      'style',
      `${size}px; height: ${size}px;  position: relative; ${boxShadow}`
    );
  };

  animationTo = (options, initial = false) => {
    const { index, percent } = options;
    const getElement = document.querySelector(`.pie-circle-${index}`);
    if (!getElement) return;
    let angle = JSON.parse(getElement.getAttribute('data-angel'));

    const previous = JSON.parse(
      this.pieElement[index].getAttribute('data-pie')
    );
    const config = initial
      ? options
      : { ...previous, ...defaultOptions, ...options };
    const element = document.querySelector(`.pie-circle-${index}`);
    const place = document.getElementById(`${this.pieName}-percent-${index}`);

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

  percentElement = (options) => {
    const { index, fontSize, fontWeight, fontColor } = options;
    const text = document.createElementNS(this.svg, 'text');
    text.id = `${this.pieName}-percent-${index}`;
    text.setAttributeNS(null, 'x', '50%');
    text.setAttributeNS(null, 'y', '50%');
    text.setAttributeNS(null, 'font-size', fontSize);
    text.setAttributeNS(null, 'font-weight', fontWeight);
    text.setAttributeNS(null, 'fill', fontColor);
    text.setAttributeNS(null, 'text-anchor', 'middle');
    text.setAttributeNS(null, 'alignment-baseline', 'central');

    return text;
  };

  getDataPie = (index) =>
    JSON.parse(this.pieElement[index].getAttribute('data-pie'));

  createSvg = (target, index) => {
    const dataPie = JSON.parse(target.getAttribute('data-pie'));
    const options = { ...defaultOptions, ...dataPie, ...index };

    const svg = document.createElementNS(this.svg, 'svg');

    const circleTop = this.circleSvg(true);
    const circleBottom = this.circleSvg();

    circleTop.setAttribute('class', `${this.pieName}-circle-${dataPie.index}`);

    if (options.colorCircle) {
      circleBottom.setAttributeNS(null, 'fill', 'none');
      circleBottom.setAttributeNS(null, 'stroke', options.colorCircle);
      circleBottom.setAttributeNS(null, 'stroke-width', `${options.stroke}`);
      svg.appendChild(circleBottom);
    }

    svg.setAttributeNS(null, 'width', options.size);
    svg.setAttributeNS(null, 'height', options.size);
    svg.setAttributeNS(null, 'viewBox', `0 0 100 100`);
    svg.setAttributeNS(this.xmlns, 'xmlns', this.xmlns);

    if (options.lineargradient) {
      svg.appendChild(this.linearGradient(options.index, options));
    }

    svg.appendChild(circleTop);

    target.appendChild(svg);

    this.circularBar(svg, target, options);
  };

  linearGradient = (index, options) => {
    const defs = document.createElementNS(this.svg, 'defs');
    const linearGradient = document.createElementNS(this.svg, 'linearGradient');
    linearGradient.id = `linear-${index}`;

    const countGradient = [].slice.call(options.lineargradient);
    defs.appendChild(linearGradient);

    let number = 0;
    for (let i = 0; i < countGradient.length; i++) {
      const stop = document.createElementNS(this.svg, 'stop');
      stop.setAttributeNS(null, 'offset', `${number}%`);
      stop.setAttribute('style', `stop-color: ${countGradient[i]};`);
      linearGradient.appendChild(stop);
      number += 100 / (countGradient.length - 1);
    }

    return defs;
  };

  circleSvg = (setAngel = false) => {
    const circle = document.createElementNS(this.svg, 'circle');
    circle.setAttributeNS(null, 'cx', '50');
    circle.setAttributeNS(null, 'cy', '50');
    circle.setAttributeNS(null, 'r', '42');
    circle.setAttributeNS(null, 'shape-rendering', 'geometricPrecision');
    if (setAngel) circle.setAttribute('data-angel', 0);

    return circle;
  };

  setAttr = (target, object, type = false) => {
    for (const [key, value] of Object.entries(object)) {
      if (type) {
        target.setAttributeNS(null, key, value);
      } else {
        target.setAttribute(key, value);
      }
    }
  };
}

export default CircularProgressBar;
