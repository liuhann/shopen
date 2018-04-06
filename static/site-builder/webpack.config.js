const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpackConfig = {
  entry: {
    main: './src/index.js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      // npm install --save-dev less-loader style-loader less-loader less
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      },
      // npm install --save-dev css-loader
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      // npm install --save-dev url-loader file-loader
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 1000000
        }
      },
      // npm install --save-dev babel-loader babel-core babel-preset-env
      /* {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }, */
      {
        test: /\.html$/,
        use: [ {
          loader: 'html-loader',
          options: {
            minimize: true
          }
        }]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {

        }
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'My App',
      template: './index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    })
  ],

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    allowedHosts: [
    ],
    compress: true,
    port: 80,
    proxy: {

    }
  }
}

module.exports = webpackConfig
