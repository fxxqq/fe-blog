const qiniu = require('qiniu');
const path = require('path');
const { createFilter } = require('./utils');

class qiniuUploadPlugin {
  // 七牛SDK mac对象
  mac = null;

  constructor(options) {
    // 读取传入选项
    this.options = options || {};
    // 检查选项中的参数
    this.checkQiniuConfig();
    // 初始化七牛mac对象

    this.mac = new qiniu.auth.digest.Mac(
      this.options.qiniu.accessKey,
      this.options.qiniu.secretKey
    );
  }
  checkQiniuConfig() {
    // 配置未传qiniu，读取环境变量中的配置
    if (!this.options.qiniu) {

      this.options.qiniu = {
        accessKey: process.env.QINIU_ACCESS_KEY,
        secretKey: process.env.QINIU_SECRET_KEY,
        bucket: process.env.QINIU_BUCKET,
        keyPrefix: process.env.QINIU_KEY_PREFIX || ''
      };
    }
    const qiniu = this.options.qiniu;
    if (!qiniu.accessKey || !qiniu.secretKey || !qiniu.bucket) {
      throw new Error('invalid qiniu config');
    }
  }

  apply(compiler) {
      compiler.hooks.afterEmit.tapPromise('qiniuUploadPlugin', (compilation) => {
            return new Promise((resolve, reject) => {
                  // 总上传数量
                  const uploadCount = Object.keys(compilation.assets).length;
                  // 已上传数量
                  let currentUploadedCount = 0;
                  // 七牛SDK相关参数
                  const { include, exclude, bucket, keyPrefix } = this.options.qiniu
                  const putPolicy = new qiniu.rs.PutPolicy({ scope: bucket });
                  const uploadToken = putPolicy.uploadToken(this.mac);
                  const config = new qiniu.conf.Config();
                  config.zone = qiniu.zone.Zone_z1;
                  const formUploader = new qiniu.form_up.FormUploader()
                  const putExtra = new qiniu.form_up.PutExtra();
                  // 因为是批量上传，需要在最后将错误对象回调
                  let globalError = null;
                  console.log(Object.keys(compilation.assets))

                  // excludeDir
                  // const includeExcludeFilter = createFilter(include, exclude);
                  // const filter = id => extensionRegExp.test(id) && includeExcludeFilter(id);
                  // 遍历编译资源文件

                  for (const filename of Object.keys(compilation.assets)) {
                    // 开始上传
                    formUploader.putFile(
                        uploadToken,
                        keyPrefix + filename,
                        path.resolve(compilation.outputOptions.path, filename),
                        putExtra,
                        (err) => {
                          console.log(`uploade ${filename} result: ${err ? `Error:${err.message}` : 'Success'}`)
                            currentUploadedCount++;
                            if (err) {
                                globalError = err;
                            }
                            if (currentUploadedCount === uploadCount) {
                                globalError ? reject(globalError) : resolve();
                            }
                        });
                }
            })
        });
    }
}

module.exports = qiniuUploadPlugin;