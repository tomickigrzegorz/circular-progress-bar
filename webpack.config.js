const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

function prodPlugin(plugin, mode) {
  return mode ? () => { } : plugin;
}

module.exports = (env, { mode }) => {
  const inDev = mode === 'development';
  return {
    devtool: inDev ? 'eval-source-map' : 'none',
    entry: {
      CircularProgressBar: './sources/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'docs'),
      filename: './[name].js',
      library: '[name]',
      libraryExport: 'default',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.(css|sass|scss)$/,
          use: [
            inDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              },
            },
          ],
        },
      ],
    },
    plugins: [
      prodPlugin(
        new CleanWebpackPlugin({
          verbose: true,
        }),
        mode
      ),
      new HtmlWebPackPlugin({
        filename: 'index.html',
        template: './sources/index.html',
      }),
      new MiniCssExtractPlugin({
        filename: './CircularProgressBar.css',
      }),
      prodPlugin(
        new BundleAnalyzerPlugin({
          openAnalyzer: true,
          generateStatsFile: true,
        }),
        mode
      ),
    ],
  };
};