const CWebp = require('cwebp').CWebp
const { getOptions } = require("loader-utils");
const validateOptions = require("schema-utils");
/**
 * 普通图片转 .webp图片
 * @param {string | buffer} img 图片绝对路径或二进制流
 * @param {number} quality 生成 webp 图片的质量，默认75
 * @returns .webp 文件流
 */
async function convertToWebp(img, quality = 75) {
  let encoder = new CWebp(img)
  encoder.quality = quality
  let buffer = await encoder.toBuffer()
  return buffer
}

const schema = {
  "additionalProperties": true,
  "properties": {
    "quality": {
      "description": "quality factor (0:small..100:big), default=75",
      "type": "number"
    }
  },
  "type": "object"
}


module.exports = async function (source) {
  if (source instanceof Buffer) {
    // 异步模式
    let callback = this.async()
    // 获取 options
    const options = getOptions(this) || {}
    // 验证 options
    validateOptions(schema, options, {
      name: 'webp Loader',
      baseDataPath: 'options'
    })
    try {
      if (content instanceof Buffer) {
        // 普通图片转 .webp
        let buffer = await convertToWebp(content, options.quality)
        callback(null, buffer)
        //当然我本身也可以返回二进制数据提供给下一个loader
      }

    } catch (err) {
      callback(err)
    }
  }
}
moudle.exports.raw = true; //不设置，就会拿到字符串

