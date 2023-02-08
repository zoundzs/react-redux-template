const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
module.exports = () => {
  
  const env = dotenv.config().parsed;
  const envKeys = Object.keys(env).reduce((acc, next) => {
    acc[`process.env.${next}`] = JSON.stringify(env[next]);
    return acc;
  }, {})
  return {
    entry: {
      client: path.join(__dirname, 'src', 'client', 'index.js'),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name]-bundle.js',
    },
    devServer: {
      port: 8080,
    },
    plugins : [
      new webpack.DefinePlugin(envKeys),
      new CleanWebpackPlugin(),
      new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'client', 'templates', 'index.ejs'),
        filename: 'index.html',
        inject: 'body',
        // minify: true,
      }),
      
    ],
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        // chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            'css-loader',
            'style-loader',
          ],
        }
      ]
    }
  };
};