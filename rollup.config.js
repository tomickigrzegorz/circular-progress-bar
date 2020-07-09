import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import compiler from '@ampproject/rollup-plugin-closure-compiler';

const { PRODUCTION } = process.env;

export default {
  input: 'sources/script.js',
  output: {
    file: 'docs/circularProgressBar.min.js',
    format: 'iife',
    name: 'CircularProgressBar',
    sourcemap: !PRODUCTION
  },
  plugins: [
    compiler({
      languageIn: 'ECMASCRIPT6',
      language_out: 'ECMASCRIPT5',
      compilation_level: 'ADVANCED',
      externs: './sources/externs/externs.js'
    }),
    (!PRODUCTION && serve({ open: true, contentBase: ['./docs', './sources'] })),
    (!PRODUCTION && livereload())
  ]
};