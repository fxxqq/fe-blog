var loaderUtils = require('loader-utils')
var Px2rem = require('px2rem')

module.exports = function (source) {
  var options = loaderUtils.getOptions(this)
  var px2remIns = new Px2rem(options)
  return px2remIns.generateRem(source)
}
