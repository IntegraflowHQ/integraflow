const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const environment = process.env.NODE_ENV || 'development';
const isProd = environment === 'production';
const devtool = environment === 'development' ? 'inline-source-map' : false;

const moduleCfg = {
  rules: [
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.s[ac]ss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    },
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
        {
          loader: 'postcss-loader',
          options: { postcssOptions: { plugins: [['postcss-preset-env']] } },
        },
      ],
    },
  ],
};

const resolve = {
  extensions: ['.ts', '.tsx', '.js'],
  alias: {
    react: 'preact/compat',
    'react-dom/test-utils': 'preact/test-utils',
    'react-dom': 'preact/compat',
    'react/jsx-runtime': 'preact/jsx-runtime',
  },
};

const optimization = {
  minimize: isProd,
  minimizer: [
    new TerserPlugin({
      parallel: true,
      extractComments: {
        banner: false,
      },
      terserOptions: {
        compress: {
          // IE10 issues
          typeofs: false,
          pure_funcs: ['console.log', 'console.info'],
        },
      },
    }),
  ],
};

const output = {
  filename: '[name].js',
  path: path.resolve(__dirname, 'dist'),
};

module.exports = [
  {
    mode: environment,
    entry: {
      index: './src/index.ts',
    },
    devtool,
    module: moduleCfg,
    resolve,
    optimization,
    output: { ...output, library: 'integraflow', libraryTarget: 'umd', globalObject: 'this' },
  },
  {
    target: ['web', 'es5'],
    mode: environment,
    entry: {
      'web-bundle': './src/web/index.ts',
    },
    devtool,
    module: moduleCfg,
    resolve,
    optimization,
    output,
  },
  {
    target: ['web', 'es5'],
    mode: environment,
    entry: {
      'demo-bundle': './src/demo/index.ts',
    },
    devtool,
    module: moduleCfg,
    resolve,
    optimization,
    output: { ...output, path: path.resolve(__dirname, 'dist/demo'), },
    plugins: [new HtmlWebpackPlugin()],
  },
];
