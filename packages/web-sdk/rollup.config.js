import alias from "@rollup/plugin-alias";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import nodePolyfills from "rollup-plugin-polyfill-node";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

const environment = process.env.NODE_ENV || "development";
const isProd = environment === "production";

const minPlugins = isProd ? [terser()] : [];

const plugins = [
    peerDepsExternal({
        packageJsonPath: "./package.json"
    }),
    nodePolyfills(),
    alias({
        entries: [
            { find: "react", replacement: "preact/compat" },
            { find: "react-dom/test-utils", replacement: "preact/test-utils" },
            { find: "react-dom", replacement: "preact/compat" },
            { find: "react/jsx-runtime", replacement: "preact/jsx-runtime" }
        ]
    }),
    resolve({
        browser: true,
        dedupe: ["react", "react-dom"],
        preferBuiltins: true
    }),
    commonjs(),
    replace({
        "process.env.NODE_ENV": JSON.stringify(environment),
        preventAssignment: true
    }),
    babel({
        presets: [
            "@babel/preset-react",
            "@babel/preset-typescript",
            "@babel/preset-env"
        ],
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
        input: "src/index.ts",
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
