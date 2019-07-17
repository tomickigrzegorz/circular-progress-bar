# Circular Progress Bar
Simple circular progress bar

## Initialization
Before the first use, clone this repository and install node dependencies:

```yarn``` or ```npm install```

The final code:

```yarn build``` convert ES6 to ES5 see the section - **Browser Compatibility**

## Configuration of the plugin

props | type | default | require | description
---- | :-------: | :-------: | :--------: | -----------
`pieName` | `String` |  | ✔ | Element to show circle progress class name 
`percent` | `Number` | `65` |  | Percent
`colorSlice` | `String` | `'#00a1ff'` | | Progress layer color and background
`colorCircle` | `String` | `'#00a1ff'` | | Bottom circle color
`strokeWidth` | `Number` | `10` |  | Stroke width
`opacity` | `Number` | `0.1` |  | Opacity box-shadow
`number` | `Boolean` | `true` |  | Add props number and set to false to hide the number with percent
`size` | `Number` | `200` |  | Size progress bar width and height in px
`time` | `Number` | `20` |  | Display speed of the bar animation
`fontSize` | `String` | `'3rem'` |  | Percent font size
`fontWeight` | `Number` | `700` |  | Percent font weight
`fontColor` | `String` | `'#365b74'` |  | Percent font color

### Sample configuration
```javascript
new CircularProgressBar({
  pieName: 'pie',
  percent: 80
});
```

## Browser Compatibility

If you want the class to be compatible with the following browsers, see the section - **Initialization**

>Desktop:

| Browser | Version |
| :---- | :-------: |
| Chrome | 74+ |
| Firefox | 66+ |
| Opera | 58+ |
| Edge | 44+ |
| Vivaldi | 2.4+ |
| IE | 9+ |

>Mobile:

| Browser | Version |
| :---- | :-------: |
| Chrome | 74+ |
| Firefox | 66+ |
| Opera | 51+ |
| Ege | 42+ |
| MI Android | 10.6+ |