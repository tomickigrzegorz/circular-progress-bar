import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import cleanup from "rollup-plugin-cleanup";

import pkg from "./package.json";

const { PRODUCTION } = process.env;
const input = "sources/index.js";

const targets = {
  targets: {
    browsers: ["defaults", "not IE 11", "maintained node versions"],
  },
};

const targetsIE = {
  targets: {
    browsers: [">0.2%", "not dead", "not op_mini all"],
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
      },
      {
        name: "CircularProgressBar",
        format: "es",
        sourcemap: false,
        file: "dist/circularProgressBar.esm.min.js",
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
  // ie
  {
    input,
    watch: false,
    plugins: pluginsConfig(targetsIE),
    output: [
      {
        name: "CircularProgressBar",
        format: "iife",
        sourcemap: false,
        file: "dist/circularProgressBar.ie.min.js",
        plugins: [terser({ ...terserConfig })],
      },
    ],
  },
];
