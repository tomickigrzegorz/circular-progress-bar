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
      fontColor 
    } = options;
    this.pieName = pieName;
    this.pieElement = document.querySelector(`.${pieName}`);
    this.percent = percent || 65;
    this.colorSlice = colorSlice || '#00a1ff';
    this.strokeWidth = strokeWidth || 10;
    this.opacity = opacity || 0.1;
    this.number = number || true;
    this.colorCircle = colorCircle;
    this.size = size || 200;
    this.fontSize = fontSize || '3rem';
    this.fontWeight = fontWeight || 700;
    this.fontColor = fontColor || '#365b74';
    this.end = 264;

    this.createSvg();
  }

  hexTorgb(fullhex) {
    const hex = fullhex.substring(1, 7);
    const rgb = `
      ${parseInt(hex.substring(0, 2), 16)}, 
      ${parseInt(hex.substring(2, 4), 16)},
      ${parseInt(hex.substring(4, 6), 16)}
    `;
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
      }, i * 30);
    }

    console.log(this.colorCircle);
    const boxShadow = !this.colorCircle ? `box-shadow: inset 0px 0px ${this.strokeWidth}px` : '';

    this.pieElement.setAttribute('style', `position: relative; border-radius: 50%; width: ${this.size}px; height: ${this.size}px; ${boxShadow} ${this.strokeWidth}px rgba(${this.hexTorgb(this.colorSlice)}, ${this.opacity})`);

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
    circleTop.setAttribute('class', `${this.pieName}-stroke`);

    if (this.colorCircle) {
      circleBottom.setAttribute('fill', 'transparent');
      circleBottom.setAttribute('style', `fill: transparent; stroke: ${this.colorCircle}; stroke-width: ${this.strokeWidth}px;`);
      svg.appendChild(circleBottom);
    }

    svg.setAttribute('width', this.size);
    svg.setAttribute('height', this.size);
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

    svg.appendChild(circleTop);
    this.pieElement.appendChild(svg)

    this.circularProgressBar()
  }

  circleSvg() {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', 50);
    circle.setAttribute('cy', 50);
    circle.setAttribute('r', 42);
    return circle;
  }

}