// 创建 run-loader.js
const fs = require("fs");
const path = require("path");
const { runLoaders } = require("loader-runner");

let options = ['mdtest.md', 'md-loader']
  // let options = ['main.js', 'babel-loader']
runLoaders({
    resource: `./src/${options[0]}`,
    loaders: [path.resolve(__dirname, `./loaders/${options[1]}`)],
    readResource: fs.readFile.bind(fs),
  },
  (err, result) =>
  (err ? console.error(err) : console.log(result))
);