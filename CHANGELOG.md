## 2021-09-20 (v1.0.20)

### Added

- 'strokeDasharray' - added to the lower circle

### Changed

- remove `box-shadow` from now on to get this effect you should do it in css styles
- name `data-index` to `data-pie-index`

## 2021-08-21 (v1.0.19)

### Added

- 'unit' - different unit instead of percentage (%) inside the circle
- 'fill' - inner circle color

## 2021-08-18 (v1.0.18)

### Added

- 'cut' - angle of the circle sector

## 2021-08-16 (v1.0.17)

### Added

- 'textPosition' - the position of the SVG TEXT element vertically
- 'speed' - frame rate animation [fps]. Let's say you want the animation to be 60fps, just add the parameter "speed": 60

## 2021-08-02 (v1.0.16)

### Added

- 'rotation' - chart rotation
- 'strokeBottom' - if "strokBottom" is set, it is used to generate a background circle size

## 2021-07-15 (v1.0.15)

### Changed

- Fix: Without number [#33](https://github.com/tomik23/circular-progress-bar/issues/33)

## 2021-07-13 (v1.0.14)

### Added

- 'animationOff' - turn off the progress animation

## 2021-07-13 (v1.0.13)

### Added

- 'inverse' - counterclockwise animation

## 2021-05-23 (v1.0.12)

### Changed

- Fix: If 0% is set [#26](https://github.com/tomik23/circular-progress-bar/issues/26)

## 2021-05-23 (v1.0.11)

### Added

- 'zero-at-start' - from now on you can set 0%

## 2021-02-01 (v1.0.10)

### Changed

- Improv: Removal of the requirement to enter the 'index' of the progress bar in 'data-pie'

## 2020-11-25 (v1.0.9)

### Changed

- Fix: Reducing the size of charts on mobile devices [#19](https://github.com/tomik23/circular-progress-bar/issues/19)
- Fix: The animation does not start if the progress-bar is shown vertically [#21](https://github.com/tomik23/circular-progress-bar/issues/21)

## 2020-11-24 (v1.0.8)

### Added

- UMD version
- Chore: "scroll down" information to the section in the examples

## 2020-10-26 (v1.0.7)

### Changed

- Fix: stroke-width undefined [#12](https://github.com/tomik23/circular-progress-bar/issues/12)

## 2020-10-24 (v1.0.7)

### Changed

- Fix: Problem with class renaming [#10](https://github.com/tomik23/circular-progress-bar/issues/10)

## 2020-10-23 (v1.0.7)

### Added

- New 'animationTo' functionality
- Adding babel

### Changed

- Update devDependencies
- Update README.md
- Removed 'rollup-plugin-closure-compiler'

## 2020-08-26 (v1.0.6)

### Changed

- Fix: Several circular-progress-bars [#6](https://github.com/tomik23/circular-progress-bar/issues/6)

## 2020-07-18

### Changed

- Update README.md

## 2020-07-09

### Added

- IE9 and IE10 support
- webpack -> rollup, bundle size reduction at 50%

### Changed

- Update devDependencies

## 2020-05-22

### Changed

- Fixed: vertical centering of the text element

## 2020-05-21

### Changed

- No showing divs with percentages if percentages are off
- Replacing div with percentages by the svg text element

## 2020-05-01

### Added

- Linear gradient

### Changed

- Update devDependencies

## 2020-04-17

### Added

- Eslint

### Changed

- Update devDependencies
- Refactoring
- Update readme

## 2020-04-15

### Added

- Polyfill for IntersectionObserver

## 2020-04-14

### Added

- Path rounding

### Changed

- Update devDependencies

## 2020-04-12

### Added

- IntersectionObserver support, now the animation starts when the individual chart appears in the view

### Changed

- Update devDependencies
