import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import nodePolyfills from "rollup-plugin-polyfill-node";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-ts";

const environment = process.env.NODE_ENV || "development";
const isInternal = process.env.BUILD_INTERNAL === "true";
const isProd = environment === "production";

const minPlugins = isProd ? [terser()] : [];

const plugins = [
    peerDepsExternal({
        packageJsonPath: "./package.json"
    }),
    nodePolyfills(),
    resolve({
        browser: true,
        preferBuiltins: true
    }),
    commonjs(),
    replace({
        "process.env.NODE_ENV": JSON.stringify(environment),
        preventAssignment: true
    }),
    babel({
        presets: ["@babel/preset-react", "@babel/preset-typescript", "@babel/preset-env"],
        plugins: ["@babel/plugin-transform-react-jsx"],
        babelHelpers: "bundled",
        exclude: ["../../node_modules/**", "node_modules/**"]
    }),
    typescript({
        tsconfig: "tsconfig.json",
        sourceMap: true,
        inlineSources: true
    }),
    postcss({
        minimize: isProd
    })
];

export default [
    {
        input: isInternal || !isProd ? "src/index.internal.ts" : "src/index.ts",
        output: [
            {
                file: "dist/index.js",
                name: "integraflow",
                sourcemap: "inline",
                format: "es",
                exports: "named"
            }
        ],
        plugins: [...plugins, ...minPlugins]
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
        plugins: [...plugins, ...minPlugins]
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
        plugins: [...plugins, ...minPlugins]
    }
];
