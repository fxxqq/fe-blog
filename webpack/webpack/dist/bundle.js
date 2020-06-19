(function(graph){
            function require(moduleId){
                function localRequire(relativePath){
                   return require(graph[moduleId].dependencies[relativePath]) 
                }
                var exports = {};
                (function(require,exports,code){
                    eval(code)
                })(localRequire,exports,graph[moduleId].code)
                return exports;
            }
            require('./src/index.js')
        })({"./src/index.js":{"dependencies":{"./moduleA.js":"./src/moduleA.js","./moduleB.js":"./src/moduleB.js"},"code":"\"use strict\";\n\nvar _moduleA = _interopRequireDefault(require(\"./moduleA.js\"));\n\nvar _moduleB = _interopRequireDefault(require(\"./moduleB.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }"},"./src/moduleA.js":{"dependencies":{"./moduleC.js":"./src/moduleC.js"},"code":"\"use strict\";\n\nvar _moduleC = _interopRequireDefault(require(\"./moduleC.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log(\"moduleA\");"},"./src/moduleB.js":{"dependencies":{},"code":"\"use strict\";\n\nconsole.log(\"moduleB\");"},"./src/moduleC.js":{"dependencies":{},"code":"\"use strict\";\n\nconsole.log('moduleC');"}})