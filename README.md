<h1 align="center">
  Circular Progress Bar
</h1>

<p align="center">
  Simple circular progress bar. From now on, one call runs multiple circular-progress-bar. IntersectionObserver support, the animation starts when the individual chart appears in the view.
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/tomik23/circular-progress-bar">
  <img src="https://img.shields.io/github/size/tomik23/circular-progress-bar/docs/circularProgressBar.min.js">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg">
  </a>
</p>

<p align="center">
  <img src="circular-progress-bar.png">
</p>

## Demo
See the demo - [example](https://tomik23.github.io/circular-progress-bar/)


## Watch/Build the app
Watch the app, just call:

```bash
yarn watch
# or
npm run watch
```

Build app. Convert ES6 to ES5 see the section - **[Browser Compatibility](https://github.com/tomik23/circular-progress-bar#colors-names)**

```bash
yarn build
# or
npm run build
```

## Sample configuration
1. Add a div element to the page `<div class="pie" data-pie='{ "percent": 80 }'></div>`
2. Build the script or download it from the `docs` folder and add `circularProgressBar.min.js` to the page
3. Call the functions `new CircularProgressBar('pie');`

More extensive example:
```html
<div class="pie" data-pie='{ "round": true, "percent": 80, "colorSlice": "#E91E63", "time": 20 }'></div>
<div class="pie" data-pie='{ "lineargradient": ["#ffff00","#ff0000"], "percent": 20, "colorSlice": "#000", "colorCircle": "#e6e6e6", "strokeWidth": 15, "number": false }'></div>
```
Minimal configuration:
```html
<div class="pie" data-pie='{ "percent": 80 }'></div>
```
### Function call

```javascript
// 'pie' is class name div
const circle = new CircularProgressBar('pie');
```
### Update circular-progress-bar dynamically
```javascript
const circle = new CircularProgressBar('pie');

setTimeout(() => {
  const options = {
    // item number you want to update
    index: 1,
    // set a new percentage
    percent: 30
  }
  circle.animationTo(options);
}, 3000); // after 3s update
```

## Configuration of the plugin

props | type | default | require | description
---- | :-------: | :-------: | :--------: | -----------
percent | number |  | ✔ | Represents the progress bar and animation of the animation progress expressed by a number e.g. 65%
colorSlice | string | `'#00a1ff'` | | Progress layer color and background ["#ffff00","brown" *](#colors-names)
colorCircle | string | `'#00a1ff'` | | Bottom circle color Font ["#ffff00","brown" *](#colors-names)
stroke | number | `10` |  | Stroke width, chart thickness
round | boolean | `false` |  | Path rounding
opacity | number | `10` |  | Opacity box-shadow, 10 = 1s, 9 = 0.9 ... 1 = 0.1
number | boolean | `true` |  | Add props number and set to false to hide the number with percent
size | number | `200` |  | Size progress bar width and height in px
fontSize | string | `1.6rem` |  | Font size. The font can be shown in units rem, em, px ...
fontWeight | number string | `400` |  | [number, normal, bold, bolder, lighter]
fontColor | string | `'#365b74'` |  | Font color ["#ffff00","brown" *](#colors-names)
lineargradient | array |  |  | Array of colors "lineargradient": ["#ffff00","brown" *](#colors-names)

## Colors names

[* See colors names](https://htmlcolorcodes.com/color-names/)

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png" alt="Vivaldi" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Vivaldi |
| --------- | --------- | --------- | --------- | --------- |
| IE10+, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions

> *IE10+ If you want the code to be supported in IE10 + you have to add pollyfil