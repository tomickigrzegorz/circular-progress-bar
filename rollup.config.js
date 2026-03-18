import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import cleanup from "rollup-plugin-cleanup";

import pkg from "./package.json";

const banner = `/*!\n* @name circular-progress-bar\n* @version ${pkg.version}\n* @author ${pkg.author}\n* @link https://github.com/tomickigrzegorz/circular-progress-bar\n* @license MIT\n*/`;

const { PRODUCTION } = process.env;
const input = "sources/index.js";

const targets = {
  targets: {
    browsers: ["defaults", "maintained node versions"],
  },
};

const pluginsConfig = (target) => [
  babel({
    babelHelpers: "bundled",
    presets: [
      [
        "@babel/preset-env",
        {
          // debug: true,
          // useBuiltIns: 'usage',
          useBuiltIns: "entry",
          corejs: 3,
          loose: true,
          ...target,
        },
      ],
    ],
    plugins: [["@babel/proposal-class-properties", { loose: true }]],
  }),
  cleanup(),
];

const terserConfig = {
  mangle: {
    properties: {
      regex: /^_/,
    },
  },
};

export default [
  // ------------------------------------------------------------
  // iife
  {
    input,
    plugins: pluginsConfig(targets),
    watch: false,
    output: {
      banner,
      name: "CircularProgressBar",
      format: "iife",
      file: pkg.main,
      sourcemap: true,
    },
  },
  {
    input,
    plugins: pluginsConfig(targets),
    watch: false,
    output: {
      banner,
      name: "CircularProgressBar",
      format: "iife",
      sourcemap: false,
      file: "dist/circularProgressBar.min.js",
      plugins: [
        terser({
          ...terserConfig,
        }),
      ],
    },
  },
  {
    input,
    plugins: pluginsConfig(targets),
    output: {
      name: "CircularProgressBar",
      format: "iife",
      sourcemap: true,
      file: "docs/circularProgressBar.min.js",
      plugins: [
        terser({
          ...terserConfig,
        }),
        !PRODUCTION && serve({ open: true, contentBase: ["docs"] }),
        !PRODUCTION && livereload(),
      ],
    },
  },
  // ------------------------------------------------------------
  // umd
  {
    input,
    watch: false,
    plugins: pluginsConfig(targets),
    output: [
      {
        name: "CircularProgressBar",
        format: "umd",
        sourcemap: true,
        file: "dist/circularProgressBar.umd.js",
        banner,
      },
      {
        name: "CircularProgressBar",
        format: "umd",
        sourcemap: false,
        file: "dist/circularProgressBar.umd.min.js",
        plugins: [
          terser({
            ...terserConfig,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
      },
    ],
  },
  // ------------------------------------------------------------
  // esm
  {
    input,
    watch: false,
    plugins: pluginsConfig(targets),
    output: [
      {
        name: "CircularProgressBar",
        format: "es",
        sourcemap: true,
        file: "dist/circularProgressBar.esm.js",
        banner,
      },
      {
        name: "CircularProgressBar",
        format: "es",
        sourcemap: false,
        file: "dist/circularProgressBar.esm.min.js",
        banner,
        plugins: [
          terser({
            ...terserConfig,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
      },
    ],
  },
];
