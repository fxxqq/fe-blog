const loaderUtils = require('loader-utils');
module.exports = function (source) {
    // 获取用户为当前Loader传入的options
    console.log(loaderUtils.getOptions(this));
    return source;
}

