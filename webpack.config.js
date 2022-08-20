/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');

const dirApp = path.join(__dirname, 'app');
const dirShared = path.join(__dirname, 'shared');
const dirStyles = path.join(__dirname, 'styles');
const dirNode = 'node_modules';

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev';

module.exports = {
  entry: [path.join(dirApp, 'index.ts'), path.join(dirStyles, 'index.scss')],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ''
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
        loader: 'file-loader',
        options: {
          name(file) {
            return '[hash].[ext]';
          }
        }
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist'
  },
  resolve: {
    modules: [dirApp, dirShared, dirStyles, dirNode],
    extensions: ['.ts', '.js'],
    fallback: {
      crypto: false,
      buffer: require.resolve('buffer/')
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './shared',
          to: ''
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      THREE: 'three'
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })
  ],
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                'svgo',
                {
                  plugins: extendDefaultPlugins([
                    {
                      name: 'removeViewBox',
                      active: false
                    },
                    {
                      name: 'addAttributesToSVGElement',
                      params: {
                        attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }]
                      }
                    }
                  ])
                }
              ]
            ]
          }
        }
      })
    ]
  }
};
