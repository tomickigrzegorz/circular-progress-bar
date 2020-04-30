# Circular Progress Bar

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Simple circular progress bar - [examples](https://tomik23.github.io/circular-progress-bar/).
From now on, one call runs multiple circular-progress-bar.
IntersectionObserver support, the animation starts when the individual chart appears in the view.

![Screenshot1](https://github.com/tomik23/circular-progress-bar/blob/master/circular-progress-bar.png)

## Clone the repo and install dependencies
Before the first use, clone this repository and install node dependencies:

```bash
git clone
cd zooom
yarn
# or
npm i
```

## Watch/Build the app
Watch the app, just call:

```bash
yarn watch
# or
npm run watch
```

Build app:

```bash
yarn build
# or
npm run build 
```
> convert ES6 to ES5 see the section - **Browser Compatibility**

## Sample configuration
We need two things, configuration html diva. And call our script with the pieName name declaration.
Everyone must consist of a class after which the application will be called, for this you also need a data attribute - data-pie. This is JSON's configurable appearance and circular-progress-bar behavior.

```html
<div class="pie" data-pie='{ "round": true, "percent": 80, "colorSlice": "#E91E63", "time": 20 }'></div>
<div class="pie" data-pie='{ "lineargradient": ["#ffff00","#ff0000"], "percent": 20, "colorSlice": "#000", "colorCircle": "#e6e6e6", "strokeWidth": 15, "number": false }'></div>
```
Minimal configuration 
```html
<div class="pie" data-pie='{ "percent": 80 }'></div>
```
### Function call

```javascript
new CircularProgressBar({
  pieName: 'pie'
});
```

## Configuration of the plugin

props | type | default | require | description
---- | :-------: | :-------: | :--------: | -----------
`pieName` | `String` |  | ✔ | Element to show circle progress class name 
`percent` | `Number` | `65` | ✔ | Represents the progress bar and animation of the animation progress expressed by a number e.g. 65%
`colorSlice` | `String` | `'#00a1ff'` | | Progress layer color and background
`colorCircle` | `String` | `'#00a1ff'` | | Bottom circle color
`strokeWidth` | `Number` | `10` |  | Stroke width, chart thickness
`round` | `Boolean` | `false` |  | Path rounding
`opacity` | `Number` | `0.1` |  | Opacity box-shadow
`number` | `Boolean` | `true` |  | Add props number and set to false to hide the number with percent
`size` | `Number` | `200` |  | Size progress bar width and height in px
`time` | `Number` | `20` |  | Displays the speed of the progress bar animation
`fontSize` | `String` | `'3rem'` |  | Font size. The font can be shown in units rem, em, px ...
`fontWeight` | `Number` | `700` |  | Font weight. The number depends on whether the font has the given size.
`fontColor` | `String` | `'#365b74'` |  | Font color
`lineargradient` | `Array` |  |  | Array of colors "lineargradient": ["#ffff00","brown"] [brown / color-name](https://htmlcolorcodes.com/color-names/)

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png" alt="Vivaldi" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Vivaldi |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions