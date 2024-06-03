## 2024-05-04 (v1.2.4)
### Fixed
- "cut" property not working with "animationOff" - [#92](https://github.com/tomickigrzegorz/circular-progress-bar/pull/92)


## 2024-02-20 (v1.2.3)
### Fixed
- percentage of circle don't stop round when percent is "0" - [#90](https://github.com/tomickigrzegorz/circular-progress-bar/issues/90)

## 2024-02-17 (v1.2.1)
- update dependencies

### Fixed
- percentage of circle no longer changing after reaching 0% - [#83](https://github.com/tomickigrzegorz/circular-progress-bar/issues/83)

## 2023-12-08 (v1.2.0)

### Fixed
- Percentage of circle no longer changing after reaching 0% - [#83](https://github.com/tomickigrzegorz/circular-progress-bar/issues/83)

## 2022-02-12 (v1.1.9)

### Added
- `index` - new props. You can add `index` both to the `data-pie` and to the global configuration. From now on you can set your own index of the entire div - `data-pie-index`. You can easily refer to an element, such as in the example "GLOBAL CONFIGURATION"

### Build
- added script to change library version everywhere during production build

### Improvements
- reducing the size of the library by mangle properties and methods:
```js
mangle: {
  properties: {
    regex: /^_/,
  },
},
```
## 2022-01-26 (v1.1.8)

### Added
- separate version for IE in dist folder

## 2021-11-26 (v1.1.6)

### Improvements
- creating a dist folder with libraries in iife, esm, umd format as well as their minimized versions [#58](https://github.com/tomickigrzegorz/circular-progress-bar/pull/58)

## 2021-10-27 (v1.1.5)

### Changed
- code optimization for production smaller bundle size [#57](https://github.com/tomickigrzegorz/circular-progress-bar/pull/57)

## 2021-10-26 (v1.1.4)

### Added
- global configuration for the library [#56](https://github.com/tomickigrzegorz/circular-progress-bar/pull/56)


## 2021-10-22 (v1.1.3)

### Added
- `animationSmooth` - new props (animation type setting, e.g. `500ms ease-out`) [#50](https://github.com/tomickigrzegorz/circular-progress-bar/issues/50)

## 2021-10-20 (v1.1.2)

### Added
- aria-label [#49](https://github.com/tomickigrzegorz/circular-progress-bar/issues/49)
### Fixed
- transform-origin issue [#52](https://github.com/tomickigrzegorz/circular-progress-bar/issues/52)


## 2021-10-19 (v1.1.0)

### Changed

- removing IntersectionObserver from code

## 2021-10-07 (v1.0.21)

### Added
- a class to the svg `text` and `tspan` element

### Changed

- the number of updateable properties has been extended: `colorSlice`, `fontColor`, `fontSize`, `fontWeight`
- default `fontColor: '#365b74'` to `#000`
- new example 'mixed'

## 2021-09-20 (v1.0.20)

### Added

- `strokeDasharray` - added to the lower circle

### Changed

- remove `box-shadow` from now on to get this effect you should do it in css styles
- name `data-index` to `data-pie-index`

## 2021-08-21 (v1.0.19)

### Added

- `unit` - different unit instead of percentage (%) inside the circle
- `fill` - inner circle color

## 2021-08-18 (v1.0.18)

### Added

- `cut` - angle of the circle sector

## 2021-08-16 (v1.0.17)

### Added

- `textPosition` - the position of the SVG TEXT element vertically
- `speed` - frame rate animation [fps]. Let's say you want the animation to be 60fps, just add the parameter "speed": 60

## 2021-08-02 (v1.0.16)

### Added

- `rotation` - chart rotation
- `strokeBottom` - if "strokBottom" is set, it is used to generate a background circle size

## 2021-07-15 (v1.0.15)

### Fixed

- without number [#33](https://github.com/tomickigrzegorz/circular-progress-bar/issues/33)

## 2021-07-13 (v1.0.14)

### Added

- `animationOff` - turn off the progress animation

## 2021-07-13 (v1.0.13)

### Added

- `inverse` - counterclockwise animation

## 2021-05-23 (v1.0.12)

### Fixed

- if 0% is set [#26](https://github.com/tomickigrzegorz/circular-progress-bar/issues/26)

## 2021-05-23 (v1.0.11)

### Added

- `zero-at-start` - from now on you can set 0%

## 2021-02-01 (v1.0.10)

### Changed

- improv: Removal of the requirement to enter the `index` of the progress bar in `data-pie`

## 2020-11-25 (v1.0.9)

### Fixed

- reducing the size of charts on mobile devices [#19](https://github.com/tomickigrzegorz/circular-progress-bar/issues/19)
- the animation does not start if the progress-bar is shown vertically [#21](https://github.com/tomickigrzegorz/circular-progress-bar/issues/21)

## 2020-11-24 (v1.0.8)

### Added

- UMD version

### Changed
- chore: "scroll down" information to the section in the examples

## 2020-10-26 (v1.0.7)

### Fixed

- stroke-width undefined [#12](https://github.com/tomickigrzegorz/circular-progress-bar/issues/12)

## 2020-10-24 (v1.0.7)

### Fixed

- problem with class renaming [#10](https://github.com/tomickigrzegorz/circular-progress-bar/issues/10)

## 2020-10-23 (v1.0.7)

### Added

- new `animationTo` functionality
- adding babel

### Changed

- update devDependencies
- update README.md
- removed 'rollup-plugin-closure-compiler'

## 2020-08-26 (v1.0.6)

### Fixed

- several circular-progress-bars [#6](https://github.com/tomickigrzegorz/circular-progress-bar/issues/6)

## 2020-07-18

### Changeds

- update README.md

## 2020-07-09

### Added

- IE9 and IE10 support
- webpack -> rollup, bundle size reduction at 50%

### Changed

- update devDependencies

## 2020-05-22

### Fixed

- vertical centering of the text element

## 2020-05-21

### Changed

- no showing divs with percentages if percentages are off
- replacing div with percentages by the svg text element

## 2020-05-01

### Added

- linear gradient

### Changed

- update devDependencies

## 2020-04-17

### Added

- Eslint

### Changed

- update devDependencies
- refactoring
- update readme

## 2020-04-15

### Added

- polyfill for IntersectionObserver

## 2020-04-14

### Added

- path rounding

### Changed

- update devDependencies

## 2020-04-12

### Added

- IntersectionObserver support, now the animation starts when the individual chart appears in the view

### Changed

- update devDependencies
