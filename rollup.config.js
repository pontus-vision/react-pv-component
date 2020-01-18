import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import svelte from 'rollup-plugin-svelte';
import postcss from 'rollup-plugin-postcss';
// import json from 'rollup-plugin-json';
import json from '@rollup/plugin-json';

import pkg from "./package.json";
const extensions = [ "jsx", "js"];

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true
    }
  ],
  plugins: [
    babel({
      extensions
    }),
    svelte({
      emitCss: true
    }),
    json(),
    external(),
    resolve({
      extensions,
      browser: true
      // ,
      // dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
  
    }),
    typescript({
      rollupCommonJSResolveHack: true,
      exclude: "**/__tests__/**",
      clean: true
    }),
    commonjs({
      include: ["node_modules/**"],
      namedExports: {
        "node_modules/react/react.js": [
          "Children",
          "Component",
          "PropTypes",
          "createElement"
        ],
        "node_modules/react-dom/index.js": ["render"]
      }
    }),
    postcss({
      extract: true,
      minimize: true,
      use: [
        ['sass', {
          includePaths: [
            './theme',
            './node_modules'
          ]
        }]
      ]
    })

  ]
};

