import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const { PRODUCTION } = process.env;

export default {
  // input: 'sources/old.js',
  input: 'sources/index.js',
  output: {
    file: 'docs/circularProgressBar.min.js',
    format: 'iife',
    name: 'CircularProgressBar',
    sourcemap: !PRODUCTION,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    PRODUCTION && terser(),
    !PRODUCTION && serve({ open: true, contentBase: 'docs' }),
    !PRODUCTION && livereload(),
  ],
};