/*!
* @name circular-progress-bar
* @version 1.2.5
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
        stroke: 10,
    };

    /**
     * Circle circumference for r=42: 2 * PI * 42 ≈ 264
     */
    const CIRCUMFERENCE = 264;
    /** Builds the CSS transform style and optional smooth transition for an SVG element */
    const styleTransform = ({ rotation, animationSmooth, }) => {
        const smoothAnimation = animationSmooth
            ? `transition: stroke-dashoffset ${animationSmooth}`
            : "";
        return `transform:rotate(${rotation}deg);transform-origin: 50% 50%;${smoothAnimation}`;
    };
    /** Returns stroke-dasharray attribute; defaults to full circumference when no argument */
    const strokeDasharray = (type) => {
        return {
            "stroke-dasharray": type || String(CIRCUMFERENCE),
        };
    };
    /** Returns stroke-linecap attribute: "round" or empty string */
    const strokeLinecap = ({ round, }) => {
        return {
            "stroke-linecap": round ? "round" : "",
        };
    };
    /** Returns font-size and font-weight attributes for the SVG text element */
    const fontSettings = (options) => {
        return {
            "font-size": options.fontSize,
            "font-weight": options.fontWeight,
        };
    };
    /** Shorthand for document.querySelector */
    const querySelector = (element) => document.querySelector(element);
    /** Sets the stroke color — gradient URL or solid colorSlice */
    const setColor = (element, { lineargradient, index, colorSlice, }) => {
        element?.setAttribute("stroke", lineargradient ? `url(#linear-${index})` : (colorSlice ?? ""));
    };
    /** Iterates an object and sets each key-value pair as an attribute on the element */
    const setAttribute = (element, object) => {
        Object.entries(object).forEach(([key, value]) => {
            element?.setAttribute(key, String(value));
        });
    };
    /** Creates an SVG namespace element of the given tag type */
    const createNSElement = (type) => document.createElementNS("http://www.w3.org/2000/svg", type);
    /** Creates an SVG tspan element with a class and optional text content */
    const tspan = (className, unit) => {
        const element = createNSElement("tspan");
        element.classList.add(className);
        if (unit)
            element.textContent = unit;
        return element;
    };
    const dashOffset = (count, inverse, cut) => {
        const cutChar = cut ? (CIRCUMFERENCE / 100) * (100 - cut) : CIRCUMFERENCE;
        const angle = CIRCUMFERENCE - (count / 100) * cutChar;
        // https://github.com/tomickigrzegorz/circular-progress-bar/issues/87
        // inverse option is not working in ios safari
        return inverse ? -angle : angle;
    };
    /** Inserts an element relative to another using insertAdjacentElement */
    const insertAdElement = (element, el, type = "beforeend") => element.insertAdjacentElement(type, el);
    /** Builds an SVG <defs> element containing a linearGradient with evenly spaced color stops */
    const gradient = ({ index, lineargradient, }) => {
        const defsElement = createNSElement("defs");
        const linearGradient = createNSElement("linearGradient");
        linearGradient.id = `linear-${index}`;
        const colors = [...lineargradient];
        const step = 100 / (colors.length - 1);
        defsElement.appendChild(linearGradient);
        colors.forEach((color, i) => {
            const stopElement = createNSElement("stop");
            setAttribute(stopElement, {
                offset: `${i * step}%`,
                "stop-color": color,
            });
            linearGradient.appendChild(stopElement);
        });
        return defsElement;
    };
    /** Creates the SVG text element with percent and unit tspan children */
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
            ...fontSettings(options),
        };
        setAttribute(creatTextElementSVG, obj);
        return creatTextElementSVG;
    };

    /** Animated circular SVG progress bar */
    class CircularProgressBar {
        _className;
        _globalObj;
        _elements;
        /** Queries all elements matching the class name and assigns data-pie-index attributes */
        constructor(pieName, globalObj = {}) {
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
        /** Creates SVG elements and starts the initial animation for all matching elements */
        initial(outside) {
            const elements = outside || this._elements;
            if (Array.isArray(elements)) {
                elements.forEach((element) => {
                    this._createSVG(element);
                });
            }
            else {
                this._createSVG(elements);
            }
        }
        /** Appends the percent text, configures the progress circle attributes, and triggers animation */
        _progress(svg, target, options) {
            const pieName = this._className;
            if (options.number) {
                insertAdElement(svg, createPercentElement(options, pieName));
            }
            const progressCircle = querySelector(`.${pieName}-circle-${options.index}`);
            if (!progressCircle)
                return;
            const configCircle = {
                fill: "none",
                "stroke-width": options.stroke,
                "stroke-dashoffset": String(CIRCUMFERENCE),
                ...strokeDasharray(),
                ...strokeLinecap(options),
            };
            setAttribute(progressCircle, configCircle);
            this.animationTo({ ...options, element: progressCircle }, true);
            progressCircle.setAttribute("style", styleTransform(options));
            setColor(progressCircle, options);
            target.setAttribute("style", `width:${options.size}px;height:${options.size}px;`);
        }
        /** Animates the progress bar to a new percent value; also used internally on initial render */
        animationTo(options, initial = false) {
            const pieName = this._className;
            const pieEl = querySelector(`[data-pie-index="${options.index}"]`);
            if (!pieEl)
                return;
            const dataPie = pieEl.getAttribute("data-pie");
            if (!dataPie)
                return;
            const previousConfigObj = JSON.parse(dataPie);
            const circleElement = querySelector(`.${pieName}-circle-${options.index}`);
            if (!circleElement)
                return;
            const commonConfiguration = initial
                ? options
                : {
                    ...defaultOptions,
                    ...previousConfigObj,
                    ...options,
                    ...this._globalObj,
                    index: String(options.index),
                };
            if (!initial) {
                setColor(circleElement, commonConfiguration);
            }
            if (!initial && commonConfiguration.number) {
                const fontconfig = {
                    fill: commonConfiguration.fontColor,
                    ...fontSettings(commonConfiguration),
                };
                const textElement = querySelector(`.${pieName}-text-${commonConfiguration.index}`);
                setAttribute(textElement, fontconfig);
            }
            const centerNumber = querySelector(`.${pieName}-percent-${options.index}`);
            if (commonConfiguration.animationOff) {
                if (commonConfiguration.number && centerNumber) {
                    centerNumber.textContent = `${commonConfiguration.percent}`;
                }
                circleElement.setAttribute("stroke-dashoffset", String(dashOffset((commonConfiguration.percent ?? 0) *
                    ((100 - (commonConfiguration.cut || 0)) / 100), commonConfiguration.inverse)));
                return;
            }
            const angle = JSON.parse(circleElement.getAttribute("data-angel") ?? "0");
            const targetPercent = Math.round(options.percent ?? 0);
            if (targetPercent === 0) {
                if (commonConfiguration.number && centerNumber) {
                    centerNumber.textContent = "0";
                }
                circleElement.setAttribute("stroke-dashoffset", String(CIRCUMFERENCE));
            }
            if (targetPercent > 100 || targetPercent < 0 || angle === targetPercent)
                return;
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
                    i = i < (commonConfiguration.percent ?? 0) ? i + 1 : i - 1;
                }
                circleElement.setAttribute("stroke-dashoffset", String(dashOffset(i, commonConfiguration.inverse, commonConfiguration.cut)));
                if (centerNumber && commonConfiguration.number) {
                    centerNumber.textContent = `${i}`;
                }
                circleElement.setAttribute("data-angel", String(i));
                circleElement.parentNode?.setAttribute("aria-valuenow", String(i));
                if (i === targetPercent) {
                    cancelAnimationFrame(request);
                }
            };
            requestAnimationFrame(performAnimation);
        }
        /** Builds the full SVG structure for a single progress bar element */
        _createSVG(element) {
            const index = element.getAttribute("data-pie-index");
            const dataPie = element.getAttribute("data-pie");
            if (!dataPie)
                return;
            if (!index)
                return;
            const json = JSON.parse(dataPie);
            const options = {
                ...defaultOptions,
                ...json,
                ...this._globalObj,
                index: String(this._globalObj.index ?? index),
            };
            const svg = createNSElement("svg");
            const configSVG = {
                role: "progressbar",
                width: options.size,
                height: options.size,
                viewBox: "0 0 100 100",
                "aria-valuemin": "0",
                "aria-valuemax": "100",
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
        /** Creates a circle element — "bottom" is the background track, "top" is the animated progress arc */
        _circle(options, where = "bottom") {
            const circle = createNSElement("circle");
            let configCircle = {};
            if (options.cut) {
                const dashoffset = CIRCUMFERENCE - (100 - (options.cut ?? 0)) * (CIRCUMFERENCE / 100);
                configCircle = {
                    "stroke-dashoffset": options.inverse ? -dashoffset : dashoffset,
                    style: styleTransform(options),
                    ...strokeDasharray(),
                    ...strokeLinecap(options),
                };
            }
            const objCircle = {
                fill: options.fill,
                stroke: options.colorCircle,
                "stroke-width": options.strokeBottom || options.stroke,
                ...configCircle,
            };
            if (options.strokeDasharray) {
                Object.assign(objCircle, { ...strokeDasharray(options.strokeDasharray) });
            }
            const typeCircle = where === "top"
                ? { class: `${this._className}-circle-${options.index}` }
                : objCircle;
            const objConfig = {
                cx: "50%",
                cy: "50%",
                r: 42,
                "shape-rendering": "geometricPrecision",
                ...typeCircle,
            };
            setAttribute(circle, objConfig);
            return circle;
        }
    }

    return CircularProgressBar;

}));
//# sourceMappingURL=circularProgressBar.umd.js.map
