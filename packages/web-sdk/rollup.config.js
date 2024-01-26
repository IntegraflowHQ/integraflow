import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
// import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import nodePolyfills from "rollup-plugin-polyfill-node";
import postcss from "rollup-plugin-postcss";

const environment = process.env.NODE_ENV || "development";

const plugins = [
    peerDepsExternal(),
    nodePolyfills(),
    resolve({
        browser: true,
        dedupe: ["react", "react-dom"],
        preferBuiltins: true
    }),
    commonjs(),
    replace({
        "process.env.NODE_ENV": JSON.stringify(environment)
    }),
    babel(),
    typescript({
        tsconfig: "tsconfig.json",
        sourceMap: true,
        inlineSources: true
    }),
    postcss({
        minimize: true
    })
    // terser()
];

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/index.js",
                name: "integraflow",
                sourcemap: "inline",
                format: "umd",
                exports: "named"
            }
        ],
        plugins
    },
    {
        input: "src/web/index.ts",
        output: [
            {
                file: "dist/web-bundle.js",
                name: "webBundle",
                sourcemap: "inline",
                format: "iife",
                exports: "named"
            }
        ],
        plugins
    },
    {
        input: "src/demo/index.ts",
        output: [
            {
                file: "dist/demo/demo-bundle.js",
                name: "demoBundle",
                sourcemap: "inline",
                format: "iife",
                exports: "named"
            }
        ],
        plugins
    }
];
