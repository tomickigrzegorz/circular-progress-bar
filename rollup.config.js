import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import cleanup from 'rollup-plugin-cleanup';

import pkg from './package.json';

const { PRODUCTION } = process.env;
const input = 'sources/index.js';

export default [
  {
    input,
    plugins: [babel({ babelHelpers: 'bundled' }), cleanup()],
    watch: false,
    output: {
      name: 'CircularProgressBar',
      format: 'iife',
      file: pkg.main,
      sourcemap: true,
    },
  },
  {
    input,
    plugins: [babel({ babelHelpers: 'bundled' }), cleanup()],
    watch: false,
    output: {
      name: 'CircularProgressBar',
      format: 'iife',
      sourcemap: false,
      file: 'dist/CircularProgressBar.min.js',
      plugins: [terser()],
    },
  },
  {
    input,
    plugins: [babel({ babelHelpers: 'bundled' }), cleanup()],
    output: {
      name: 'CircularProgressBar',
      format: 'iife',
      sourcemap: true,
      file: 'docs/circularProgressBar.min.js',
      plugins: [
        terser({
          mangle: true,
          compress: { drop_console: true, drop_debugger: true },
        }),
        !PRODUCTION && serve({ open: true, contentBase: ['docs'] }),
        !PRODUCTION && livereload(),
      ],
    },
  },
  {
    input,
    watch: false,
    plugins: [babel({ babelHelpers: 'bundled' }), cleanup()],
    output: [
      {
        name: 'CircularProgressBar',
        format: 'umd',
        sourcemap: true,
        file: 'dist/circularProgressBar.umd.js',
      },
      {
        name: 'CircularProgressBar',
        format: 'umd',
        sourcemap: false,
        file: 'dist/circularProgressBar.umd.min.js',
        plugins: [
          terser({
            mangle: true,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
      },
    ],
  },
  {
    input,
    watch: false,
    plugins: [babel({ babelHelpers: 'bundled' }), cleanup()],
    output: [
      {
        name: 'CircularProgressBar',
        format: 'es',
        sourcemap: true,
        file: 'dist/circularProgressBar.esm.js',
      },
      {
        name: 'CircularProgressBar',
        format: 'es',
        sourcemap: false,
        file: 'dist/circularProgressBar.esm.min.js',
        plugins: [
          terser({
            mangle: true,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
      },
    ],
  },
];
