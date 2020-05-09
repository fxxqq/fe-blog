const path = require('path');

const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const QiniuUpload = require('./plugins/QiniuUpload')
const MyWebpackPlugin = require('./plugins/MyWebpackPlugin')
const WebpackConsoleLog = require('./plugins/webpackConsoleLog')
  // const BuildTimePlugin = require('./plugins/build-time')
module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production'
  return {
    entry: [
      "babel-polyfill",
      path.join(__dirname, './src/index.js')
    ],
    devServer: {
      port: 3000, //端口号
    },
    output: {
      // 给输出的 JavaScript 文件名称加上 Hash 值
      filename: '[name]_[chunkhash:8].js',
      path: path.resolve(__dirname, './dist'),
      // 指定存放 JavaScript 文件的 CDN 目录 URL
      publicPath: '//wcdn.6fed.com/',
    },
    module: {
      rules: [{
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.html$/,
          use: [{
            loader: "html-loader",
            options: {
              minimize: true
            }
          }]
        },
        {
          test: /\.less$/,
          use: [
            devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'less-loader',
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [{
            loader: 'file-loader',
            options: {
              limit: 1,
              name: 'img/[name].[hash:7].[ext]',
              publicPath: "http://wcdn.6fed.com"
            }
          }],
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebPackPlugin({
        template: "./public/index.html",
        filename: "index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "css/[name].css",
        chunkFilename: "[id].css"
      }),
      // new QiniuUpload({
      //   qiniu: {
      //     accessKey: 'HCct3FpW17hnRMdsSCnogNeqtklD5nIiUa9hOrvi',
      //     secretKey: '7Pp2QhmgJo0SdwpKCiuq5M1VMFHbZNj68mjLBwRz',
      //     bucket: 'webpack-plugin-upload',
      //     keyPrefix: 'webpack-plugins-statics/',
      //     include: [
      //       'css/**',
      //     ],
      //     exclude: [
      //       path.resolve(__dirname, "index.html")
      //     ],
      //   }
      // }),
      new MyWebpackPlugin(),
      // new BuildTimePlugin()
    ]
  }
};