class CircularProgressBar {
  constructor(options) {
    const {
      pieName,
      percent,
      colorSlice,
      strokeWidth,
      opacity,
      colorCircle,
      number,
      size,
      fontSize,
      fontWeight,
      time,
      fontColor
    } = options;
    this.pieName = pieName;
    this.pieElement = document.querySelector(`.${pieName}`);
    this.percent = percent || 65;
    this.colorSlice = colorSlice || '#00a1ff';
    this.strokeWidth = strokeWidth || 10;
    this.opacity = opacity || 0.1;
    this.number = typeof number === "undefined" ? true : false;
    this.colorCircle = colorCircle;
    this.size = size || 200;
    this.fontSize = fontSize || '3rem';
    this.fontWeight = fontWeight || 700;
    this.fontColor = fontColor || '#365b74';
    this.time = time || 30;
    this.end = 264;

    this.createSvg();
  }

  hexTorgb(fullhex) {
    const hex = fullhex.substring(1, 7);
    const rgb = `${parseInt(hex.substring(0, 2), 16)}, ${parseInt(hex.substring(2, 4), 16)}, ${parseInt(hex.substring(4, 6), 16)}`;
    return rgb;
  }

  circularProgressBar() {
    let stroke = document.querySelector(`.${this.pieName}-stroke`);

    this.percentElement();

    for (let i = 0; i <= this.end; i++) {
      setTimeout(() => {
        if (i > this.percent) return;
        if (this.number) {
          this.percentElementUpdate(i)
        }
        let d = parseInt(i * 2.64);
        stroke.setAttribute('style', `fill: transparent; stroke: ${this.colorSlice}; stroke-width: ${this.strokeWidth}; stroke-dashoffset: 66; stroke-dasharray: ${d} ${this.end - d}`);
      }, i * this.time);
    }

    const boxShadow = !this.colorCircle
      ? `border-radius: 50%; box-shadow: inset 0px 0px ${this.strokeWidth}px ${this.strokeWidth}px rgba(${this.hexTorgb(this.colorSlice)}, ${this.opacity})`
      : '';

    this.pieElement.setAttribute('style', `width: ${this.size}px; height: ${this.size}px;  position: relative; ${boxShadow}`);

  }

  percentElement() {
    const percent = document.createElement('div');
    percent.className = 'percent'
    percent.setAttribute('style', `position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: ${this.fontSize}; font-weight: ${this.fontWeight}; color: ${this.fontColor}`);
    this.pieElement.appendChild(percent);
  }

  percentElementUpdate(numbers) {
    const percentNumber = document.querySelector(`.${this.pieName} > .percent`);
    percentNumber.innerHTML = `${numbers}%`;
  }

  createSvg() {

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    const circleTop = this.circleSvg();
    const circleBottom = this.circleSvg();
    circleTop.setAttributeNS(null, 'class', `${this.pieName}-stroke`);

    if (this.colorCircle) {
      circleBottom.setAttributeNS(null, 'fill', 'transparent');
      circleBottom.setAttributeNS(null, 'style', `fill: transparent; stroke: ${this.colorCircle}; stroke-width: ${this.strokeWidth}px;`);
      svg.appendChild(circleBottom);
    }

    svg.setAttributeNS(null, 'width', this.size);
    svg.setAttributeNS(null, 'height', this.size);
    svg.setAttributeNS(null, 'viewBox', '0 0 100 100');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    svg.appendChild(circleTop);
    this.pieElement.appendChild(svg)

    this.circularProgressBar()
  }

  circleSvg() {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttributeNS(null, 'cx', 50);
    circle.setAttributeNS(null, 'cy', 50);
    circle.setAttributeNS(null, 'r', 42);
    return circle;
  }

}