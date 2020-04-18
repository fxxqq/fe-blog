// 创建 run-loader.js
const fs = require("fs");
const path = require("path");
const { runLoaders } = require("loader-runner");

runLoaders({
    resource: "./mdtest.md",
    loaders: [path.resolve(__dirname, "./loaders/md-loader")],
    readResource: fs.readFile.bind(fs),
  },
  (err, result) =>
  (err ? console.error(err) : console.log(result))
);