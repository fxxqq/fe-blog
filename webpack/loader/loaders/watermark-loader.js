const path = require("path");
const images = require("images");
const loaderUtils = require('loader-utils');

module.exports = function (content) {
    // 获取本loader对应的配置参数
    // 获取水印文件路径
    const { watermarkPath = '' } = this.query;
    // 获取需要处理的图片路径
    const url = loaderUtils.interpolateName(this, "[path][name].[ext]", {
        content: source,
        context: this.context
    });
    // 给图片打上水印
    const file = images(path.resolve(this.context, url))
        .draw(images(path.resolve(this.rootContext, watermarkPath)), 10, 10)
        .encode(path.extname(url) || 'png');
    // 发射文件
    this.emitFile(url, file);
    // 返回数据
    const publicPath = `__webpack_public_path__ + ${JSON.stringify(url)}`;

    return `module.exports = ${publicPath};`;
};

module.exports.raw = true;

