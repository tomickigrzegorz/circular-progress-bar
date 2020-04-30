import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { uglify } from 'rollup-plugin-uglify';

const { PRODUCTION } = process.env;

export default {
  input: 'sources/index.js',
  output: {
    file: 'docs/circularProgressBar.min.js',
    format: 'iife',
    name: 'CircularProgressBar'
  },
  plugins: [
    commonjs(),
    resolve(),
    babel({ exclude: 'node_modules/**' }),
    (PRODUCTION && uglify()),
    copy({
      targets: [
        { src: 'sources/index.html', dest: 'docs/' }
      ]
    }),
    (!PRODUCTION && serve({ open: true, contentBase: 'docs' })),
    (!PRODUCTION && livereload())
  ]
};