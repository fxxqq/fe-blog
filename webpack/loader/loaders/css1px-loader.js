 const loaderUtils = require("loader-utils");
 module.exports = function(content) {
   this.cacheable && this.cacheable();
   // merge params and default config
   const options = loaderUtils.getOptions(this);
   console.log(content.split(/\r?\n/))
   return content;

 };