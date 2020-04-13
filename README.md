# Circular Progress Bar

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Simple circular progress bar - [examples](https://tomik23.github.io/circular-progress-bar/).
From now on, one call runs multiple circular-progress-bar.
IntersectionObserver support, the animation starts when the individual chart appears in the view.

## Initialization
Before the first use, clone this repository and install node dependencies:

```yarn``` or ```npm install```

The final code:

```yarn build``` convert ES6 to ES5 see the section - **Browser Compatibility**

## Configuration of the plugin

props | type | default | require | description
---- | :-------: | :-------: | :--------: | -----------
`pieName` | `String` |  | ✔ | Element to show circle progress class name 
`percent` | `Number` | `65` | ✔ | Represents the progress bar and animation of the animation progress expressed by a number e.g. 65%
`colorSlice` | `String` | `'#00a1ff'` | | Progress layer color and background
`colorCircle` | `String` | `'#00a1ff'` | | Bottom circle color
`strokeWidth` | `Number` | `10` |  | Stroke width
`opacity` | `Number` | `0.1` |  | Opacity box-shadow
`number` | `Boolean` | `true` |  | Add props number and set to false to hide the number with percent
`size` | `Number` | `200` |  | Size progress bar width and height in px
`time` | `Number` | `20` |  | Displays the speed of the progress bar animation
`fontSize` | `String` | `'3rem'` |  | Font size. The font can be shown in units rem, em, px ...
`fontWeight` | `Number` | `700` |  | Font weight. The number depends on whether the font has the given size.
`fontColor` | `String` | `'#365b74'` |  | Font color, must be in HEX

### Sample configuration
We need two things, configuration html diva. And call our script with the pieName name declaration.
Everyone must consist of a class after which the application will be called, for this you also need a data attribute - data-pie. This is JSON's configurable appearance and circular-progress-bar behavior.

```html
<div class="pie" data-pie='{ "percent": 80, "colorSlice": "#E91E63", "time": 20 }'></div>
<div class="pie" data-pie='{ "percent": 20, "colorSlice": "#000", "colorCircle": "#e6e6e6", "strokeWidth": 15, "number": false }'></div>
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

## Browser Compatibility

If you want the class to be compatible with the following browsers, see the section - **Initialization**

### Desktop:

| Browser | Version |
| :---- | :-------: |
| Chrome | 74+ |
| Firefox | 66+ |
| Opera | 58+ |
| Edge | 44+ |
| Vivaldi | 2.4+ |
| IE | 11+ |

### Mobile:

| Browser | Version |
| :---- | :-------: |
| Chrome | 74+ |
| Firefox | 66+ |
| Opera | 51+ |
| Ege | 42+ |
| MI Android | 10.6+ |