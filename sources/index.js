import defaultOptions from './defaults';

class CircularProgressBar {
  constructor(pieName) {
    this.pieName = pieName;
    this.pieElement = document.querySelectorAll(`.${pieName}`);
    this.svg = 'http://www.w3.org/2000/svg';

    this.initial(this.pieElement);
  }

  initial = (elements) => {
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
        .map((el) => parseInt(hex.length % 2 ? el + el : el, 16))
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

    if (number)
      svg.insertAdjacentHTML('beforeend', this.percentElement(options));

    const element = document.querySelector(`.${this.pieName}-circle-${index}`);
    const objsvg = {
      fill: 'none',
      transform: 'rotate(-90, 50, 50)',
      'stroke-width': stroke,
      'stroke-linecap': round ? 'round' : '',
    };
    this.setAttr(element, objsvg, false);

    // animation
    this.animationTo({ ...options, element }, true);

    // set linear gradient
    element.setAttribute(
      'stroke',
      lineargradient ? `url(#linear-${index})` : colorSlice
    );

    // box shadow
    const boxShadow = !colorCircle
      ? `border-radius:50%;box-shadow:inset 0px 0px ${stroke}px ${stroke}px ${this.hexTorgb(colorSlice, opacity)}`
      : '';

    target.setAttribute(
      'style',
      `${size}px;height:${size}px;position:relative;${boxShadow}`
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

  percentElement = ({ index, fontSize, fontWeight, fontColor }) => {
    const textTemplate = `
    <text id="${this.pieName}-percent-${index}" x="50%" y="50%" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fontColor}" text-anchor="middle" dominant-baseline="central" />`;
    return textTemplate;
  };

  createSvg = (element, index) => {
    const dataOptions = JSON.parse(element.getAttribute('data-pie'));
    const options = { ...defaultOptions, ...dataOptions, ...index };

    const svg = document.createElementNS(this.svg, 'svg');

    const objSvg = {
      width: options.size,
      height: options.size,
      viewBox: '0 0 100 100',
    };
    this.setAttr(svg, objSvg, false);

    if (options.colorCircle) {
      svg.appendChild(this.circleSvg(dataOptions, 'bottom'));
    }

    if (options.lineargradient) {
      svg.appendChild(this.linearGradient(options.index, options));
    }

    svg.appendChild(this.circleSvg(dataOptions, 'top', true));

    element.appendChild(svg);

    this.circularBar(svg, element, options);
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

      const objStop = {
        offset: `${number}%`,
        'stop-color': `${countGradient[i]}`,
      };
      this.setAttr(stop, objStop, false);

      linearGradient.appendChild(stop);
      number += 100 / (countGradient.length - 1);
    }

    return defs;
  };

  circleSvg = (options, where, setAngel = false) => {
    const circleElement = document.createElementNS(this.svg, 'circle');
    const typeCircle =
      where === 'top'
        ? { class: `${this.pieName}-circle-${options.index}` }
        : {
          fill: 'none',
          stroke: options.colorCircle,
          'stroke-width': options.stroke,
        };

    const objCircle = {
      cx: 50,
      cy: 50,
      r: 42,
      'shape-rendering': 'geometricPrecision',
      'data-angle': setAngel ? 0 : '',
      ...typeCircle,
    };
    this.setAttr(circleElement, objCircle, false);

    return circleElement;
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
