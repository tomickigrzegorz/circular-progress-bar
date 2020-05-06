class CircularProgressBar {
  constructor({ pieName }) {
    this.pieName = pieName;
    this.pieElement = document.querySelectorAll(`.${pieName}`);
    this.onChange(this.pieElement);
    this.svg = 'http://www.w3.org/2000/svg';
    this.xmlns = 'http://www.w3.org/2000/xmlns/';
    this.xlink = 'http://www.w3.org/1999/xlink';
  }

  onChange(pies) {
    if ('IntersectionObserver' in window) {
      const config = {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      };

      const ovserver = new IntersectionObserver((changes) => changes.forEach((change) => {
        if (change.intersectionRatio > 0.75) {
          for (let i = 0; i < pies.length; i++) {
            if (pies[i].dataset === change.target.dataset) {
              this.createSvg(change.target, i);
            }
          }
          ovserver.unobserve(change.target);
        }
      }), config);
      for (let i = 0; i < pies.length; i++) {
        ovserver.observe(pies[i]);
      }
      // pies.forEach((pie) => ovserver.observe(pie));
    } else {
      for (let i = 0; i < pies.length; i++) {
        this.createSvg(pies[i], i);
      }
    }
  }

  hexTorgb(fullhex) {
    const hex = fullhex.substring(1, 7);
    const rgb = `${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}`;
    return rgb;
  }

  circularBar() {
    const stroke = document.querySelector(`.${this.pieName}-circle-${this.index}`);

    this.percentElement();

    const options = {
      colorSlice: this.colorSlice,
      strokeWidth: this.strokeWidth,
      end: this.end,
      time: this.time,
      round: this.round,
      percent: this.percent,
      number: this.number,
      index: this.index,
    };

    for (let i = 0; i <= options.end; i++) {
      setTimeout(() => {
        if (i > options.percent) return;
        if (options.number) {
          this.percentElementUpdate(i, options.index);
        }
        const d = i * 2.64;
        stroke.setAttribute('style', `fill: transparent; stroke-width: ${options.strokeWidth}; stroke-dashoffset: 66; stroke-dasharray: ${d} ${options.end - d}; ${options.round}`);
      }, i * options.time);
    }

    stroke.setAttribute('stroke', this.lineargradient ? 'url(#linear)' : this.colorSlice);

    const boxShadow = !this.colorCircle
      ? `border-radius: 50%; box-shadow: inset 0px 0px ${this.strokeWidth}px ${this.strokeWidth}px rgba(${this.hexTorgb(this.colorSlice)}, ${this.opacity})`
      : '';

    this.pieElement[options.index].setAttribute('style', `width: ${this.size}px; height: ${this.size}px;  position: relative; ${boxShadow}`);
  }

  percentElement() {
    const percent = document.createElement('div');
    percent.className = `${this.pieName}-percent-${this.index}`;
    percent.setAttribute('style', `position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: ${this.fontSize}; font-weight: ${this.fontWeight}; color: ${this.fontColor}`);

    this.pieElement[this.index].appendChild(percent);
  }

  percentElementUpdate(numbers, index) {
    const place = document.querySelector(`.${this.pieName}-percent-${index}`);
    place.innerText = `${numbers}%`;

    return place;
  }

  createSvg(target, index) {
    const {
      lineargradient,
      round,
      percent,
      colorSlice,
      strokeWidth,
      opacity,
      number,
      colorCircle,
      size,
      fontSize,
      fontWeight,
      fontColor,
      time,
    } = JSON.parse(target.dataset.pie);

    this.index = index;
    this.percent = percent || 65;
    this.round = round ? 'stroke-linecap: round;' : '';
    this.colorSlice = colorSlice || '#00a1ff';
    this.strokeWidth = strokeWidth || 10;
    this.opacity = opacity || 0.1;
    this.number = typeof number === 'undefined';
    this.colorCircle = colorCircle;
    this.size = size || 200;
    this.fontSize = fontSize || '3rem';
    this.fontWeight = fontWeight || 700;
    this.fontColor = fontColor || '#365b74';
    this.time = time || 30;
    this.end = 264;
    this.lineargradient = lineargradient;

    const svg = document.createElementNS(this.svg, 'svg');

    const circleTop = this.circleSvg();
    const circleBottom = this.circleSvg();
    circleTop.setAttributeNS(null, 'class', `${this.pieName}-circle-${this.index}`);

    if (this.colorCircle) {
      circleBottom.setAttributeNS(null, 'fill', 'transparent');
      circleBottom.setAttributeNS(null, 'style', `fill: transparent; stroke: ${this.colorCircle}; stroke-width: ${this.strokeWidth}px;`);
      svg.appendChild(circleBottom);
    }

    svg.setAttributeNS(null, 'width', this.size);
    svg.setAttributeNS(null, 'height', this.size);
    svg.setAttributeNS(null, 'viewBox', '0 0 100 100');
    svg.setAttributeNS(this.xmlns, 'xmlns:xlink', this.xlink);

    if (this.lineargradient) {
      svg.appendChild(this.linearGradient());
    }
    svg.appendChild(circleTop);

    this.pieElement[this.index].appendChild(svg);
    this.circularBar();
  }

  linearGradient() {
    const defs = document.createElementNS(this.svg, 'defs');
    const linearGradient = document.createElementNS(this.svg, 'linearGradient');
    linearGradient.id = 'linear';

    const countGradient = [].slice.call(this.lineargradient);
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
  }

  circleSvg() {
    const circle = document.createElementNS(this.svg, 'circle');
    circle.setAttributeNS(null, 'cx', 50);
    circle.setAttributeNS(null, 'cy', 50);
    circle.setAttributeNS(null, 'r', 42);
    return circle;
  }
}

export default CircularProgressBar;
