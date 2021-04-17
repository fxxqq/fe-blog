1. 减小打包后的文件大小
2. 首页按需引入文件，减少白屏时间
3. 优化 webpack 打包时间，提高开发效率
4. webpack4 splitChunks 合理拆包
5. webpack externals

引入 webpack 测速插件 `speed-measure-webpack-plugin`，因此我便将该插件引入项目中，先用来检测每个项目编译构建的速度，看看到底是哪个 loader、plugin 耗时久。测速后，发现主要是搜索解析文件，将 vue、es6 语法、sass/scss/less 文件转换成 js、css 的 loader，以及压缩打包资源的 plugin 耗时比较久。发现问题后，就可以针对性地进行优化，主要采取如下措施：

第三方依赖多，搜索解析文件慢：采用缓存策略，hard-source-webpack-plugin 为依赖模块提供中间缓存，极大程度地提升二次构建速度。
loader 解析转换慢：配置 loader 的 test、include、exclude，缩小文件解析搜索范围。
压缩打包资源 plugin 执行慢：比如 uglify-webpack-plugin，可以开启缓存、多进程。
