import babel from '@rollup/plugin-babel';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const { PRODUCTION } = process.env;

const plugins = () => {
  return [
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    PRODUCTION && terser(),
    !PRODUCTION && serve({ open: true, contentBase: 'docs' }),
    !PRODUCTION && livereload(),
  ];
};

export default [
  {
    input: 'sources/index.js',
    output: {
      file: 'docs/circularProgressBar.min.js',
      format: 'iife',
      name: 'CircularProgressBar',
    },
    plugins: plugins(),
  },
  {
    input: 'sources/index.js',
    watch: false,
    output: {
      file: 'docs/circularProgressBar.umd.min.js',
      format: 'umd',
      name: 'CircularProgressBar',
    },
    plugins: plugins(),
  },
];
