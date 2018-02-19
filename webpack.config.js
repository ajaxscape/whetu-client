const path = require('path')
const webpack = require('webpack')
const {getIfUtils, removeEmpty} = require('webpack-config-utils')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const nodeEnv = process.env.NODE_ENV || 'production'
const {ifDevelopment, ifProduction} = getIfUtils(nodeEnv)

module.exports = removeEmpty({
  entry: {
    index: './src/client/index.js',
    // multi: './src/client/multi.js',
    // single: './src/client/single.js',
    css: './src/client/index.scss'
  },

  output: {
    filename: ifProduction('[name]-bundle-[hash].js', '[name]-bundle.js'),
    path: path.resolve(__dirname, 'public')
  },

  module: {
    rules: [
      {
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {url: false}
          }, 'sass-loader']
        })
      },
      {
        test: /\.js/,
        use: ['babel-loader?cacheDirectory'],
        include: [/src\/client/, /node_modules/],
        exclude: /node_modules\/(?!whetu-engine|!whetu-render|!query-string)/
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            name: 'whetu-engine.[hash].js'
          }
        }
      }
    ]
  },

  devtool: 'eval-source-map',

  devServer: ifDevelopment({
    host: '0.0.0.0',
    port: 3000,
    stats: 'normal'
  }),

  plugins: removeEmpty([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),

    new HtmlWebpackPlugin({
      hash: true,
      filename: 'index.html',
      template: './src/client/views/index.html',
      title: 'Whetu',
      expanseServer: `${process.env.EXPANSE_SERVICE || 'ws://localhost:40510'}`,
      environment: nodeEnv
    }),

    new CopyWebpackPlugin([{from: 'src/client/assets', to: 'assets'}]),

    ifProduction(
      new ExtractTextPlugin('[name]-bundle-[hash].css'),
      new ExtractTextPlugin('[name]-bundle.css'),
      new UglifyJsPlugin({sourceMap: true})
    )
  ]),

  node: {
    fs: 'empty'
  }
})
