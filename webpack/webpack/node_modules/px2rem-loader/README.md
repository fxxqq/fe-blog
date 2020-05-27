# px2rem-loader

a [webpack](http://webpack.github.io/) loader for [px2rem](https://github.com/songsiqi/px2rem)

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Downloads][downloads-image]][downloads-url]

[npm-image]: https://img.shields.io/npm/v/px2rem-loader.svg
[npm-url]: https://npmjs.org/package/px2rem-loader
[travis-image]: https://img.shields.io/travis/Jinjiang/px2rem-loader.svg
[travis-url]: https://travis-ci.org/Jinjiang/px2rem-loader
[downloads-image]: http://img.shields.io/npm/dm/px2rem-loader.svg
[downloads-url]: https://npmjs.org/package/px2rem-loader

## Install

`npm install px2rem-loader`

## webpack config

```
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'px2rem-loader',
        // options here
        options: {
          remUni: 75,
          remPrecision: 8
        }
      }]
    }]
  }
}
```

Please see [px2rem](https://github.com/songsiqi/px2rem) for more information about query parameters of px2rem.
