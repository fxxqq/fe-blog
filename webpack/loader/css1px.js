const fs = require("fs");
const path = require("path");
const { runLoaders } = require("loader-runner");

runLoaders({
    resource: "./src/index.txt",
    loaders: [path.resolve(__dirname, "./loaders/css1px-loader.js")],
    readResource: fs.readFile.bind(fs),
  },
  (err, result) =>
  (err ? console.error(err) : console.log(result))
);