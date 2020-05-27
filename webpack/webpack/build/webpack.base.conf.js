'use strict'

const { join, resolve } = require('path')
const webpack = require('webpack')
const glob = require('glob')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// const TerserPlugin = require('terser-webpack-plugin')

const extractCSS = new ExtractTextPlugin({
  filename: 'assets/css/[name].css',
  allChunks: true
})
const extractLESS = new ExtractTextPlugin({
  filename: 'assets/css/[name].css',
  allChunks: true
})

function getCmdParas(name) {
  for (let key in process.argv) {
    if (process.argv[key].indexOf(`--${name}`) > -1) {
      return process.argv[key].split('=')[1]
    }
  }
  return ''
}

let typeName = getCmdParas('type') || '**'
let folderName = getCmdParas('page') || '**'
const entries = {}
const chunks = []
const htmlWebpackPluginArray = []
let pathStr = `./src/pages/${typeName + '/' + folderName}/app.js`

glob.sync(pathStr).forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/app.js')[0]
  entries[chunk] = path
  chunks.push(chunk)

  const filename = chunk + '.html'
  const htmlConf = {
    filename: filename,
    template: path.replace(/.js/g, '.html'),
    inject: 'body',
    favicon: './src/assets/img/favicon.ico',
    hash: true,
    chunks: ['commons', chunk]
  }
  htmlWebpackPluginArray.push(new HtmlWebpackPlugin(htmlConf))
})

const styleLoaderOptions = {
  loader: 'style-loader',
  options: {
    sourceMap: true
  }
}

const cssOptions = [{
    loader: 'css-loader',
    options: {
      sourceMap: true
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true
    }
  }
]

const cssRemOptions = [{
    loader: 'css-loader',
    options: {
      sourceMap: true,
      importLoaders: 2
    }
  },
  {
    loader: 'px2rem-loader',
    options: {
      remUnit: 75
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true
    }
  }
]

const lessOptions = [
  ...cssOptions,
  {
    loader: 'less-loader',
    options: {
      sourceMap: true
    }
  }
]

const lessRemOptions = [
  ...cssRemOptions,
  {
    loader: 'less-loader',
    options: {
      sourceMap: true
    }
  }
]

const webLoader = {
  css: ['css-hot-loader'].concat(
    ExtractTextPlugin.extract({
      use: cssOptions,
      fallback: styleLoaderOptions
    })
  ),
  less: ['css-hot-loader'].concat(
    ExtractTextPlugin.extract({
      use: lessOptions,
      fallback: styleLoaderOptions
    })
  )
}

const wapLoader = {
  css: ['css-hot-loader'].concat(
    ExtractTextPlugin.extract({
      use: cssRemOptions,
      fallback: styleLoaderOptions
    })
  ),
  less: ['css-hot-loader'].concat(
    ExtractTextPlugin.extract({
      use: lessRemOptions,
      fallback: styleLoaderOptions
    })
  )
}

const config = {
  // entry: entries,  // 注释此行默认入口是“./src/index.js”

  // externals: {
  //     'vue': 'Vue',
  //     'vue-router': 'VueRouter',
  //     'vuex': 'Vuex',
  // },
  stats: 'errors-only',
  output: {
    path: resolve(__dirname, '../dist'),
    filename: 'assets/js/[name].js',
    publicPath: '/'
  },
  externals: {
    echarts: 'echarts'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      assets: join(__dirname, '../src/assets'),
    }
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [
          resolve('src/pages/web'),
          resolve('src/components/web'),
          resolve('src/plugins/web')
        ],
        options: {
          loaders: webLoader
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [
          resolve('src/pages/wap'),
          resolve('src/components/wap'),
          resolve('src/plugins/wap')
        ],
        options: {
          loaders: wapLoader
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [
          resolve('src/pages/admin'),
          resolve('src/components/admin'),
          resolve('src/plugins/admin')
        ],
        options: {
          loaders: webLoader
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['css-hot-loader'].concat(
          ExtractTextPlugin.extract({
            use: cssOptions,
            fallback: styleLoaderOptions
          })
        )
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        include: [
          resolve('src/pages/wap'),
          resolve('src/components/wap'),
          resolve('src/plugins/wap')
        ],
        use: ['css-hot-loader'].concat(
          ExtractTextPlugin.extract({
            use: cssRemOptions,
            fallback: styleLoaderOptions
          })
        )
      },
      {
        test: /\.less$/,
        use: ['css-hot-loader'].concat(
          ExtractTextPlugin.extract({
            use: lessOptions,
            fallback: styleLoaderOptions
          })
        )
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            root: resolve(__dirname, 'src'),
            attrs: ['img:src', 'link:href']
          }
        }]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/img/[name].[hash:7].[ext]'
          }
        }]
      },

    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 30,
          name: 'commons',
          enforce: true
        }
      }
    }
  },
  performance: {
    hints: false
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    extractLESS,
    extractCSS
  ]
}
config.plugins = [...config.plugins]
module.exports = config