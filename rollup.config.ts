import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import progress from 'rollup-plugin-progress';
import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import copy from 'rollup-plugin-copy';
import json from 'rollup-plugin-json';

export default {
  input: 'lib/index.ts',
  output: [
    {
      file: './dist/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: './dist/index.es.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    }
  ],
  plugins: [
    cleaner({
      targets: [
        './dist/'
      ],
    }),
    progress(),
    external(),
    resolve({preferBuiltins: true}),
    json({
      preferConst: true,
      compact: true,
      namedExports: false,
    }),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
    }),
    commonjs(),
    terser({ecma: 5}),
    copy({
      targets: [
        {src: 'docs/example.js', dest: 'dist/examples'}
      ],
    })
  ],
};