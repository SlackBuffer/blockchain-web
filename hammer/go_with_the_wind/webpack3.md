- `npm info webpack`
- `npm install --save webpack@3.8.1`
- `node_modules/.bin/webpack -v` 查看当前项目的 webpack 版本
- `node_modules/.bin/webpack` 用当前目录的 webpack 编译
    - `"webpack": "node_modules/.bin/webpack"`
    - `npm run webpack src/app.js dist/app.bundle.js`
    - > https://blog.csdn.net/wsj__wsj/article/details/
- `node_modules/.bin/webpack src/app.js dist/app.bundle.js --watch`
    - 监听文件，一改动就自动执行编译命令
    - 用于开发环境
- `node_modules/.bin/webpack src/app.js dist/app.bundle.js -p` 
    - 压缩生成的文件
    - 用于生产环境
- 向 npm 脚本传参需用 `--` 隔开
    - `npm run webpack -- --watch`
- 配置文件 webpack.config.js
    - 配置好 entry 和 output 后可以简化命令
    - 一般会把常用命令写在 package.json 文件中
- `-D` 等于 `--save-dev`
# plugins
- html-webpack-plugin
    - 动态生成 html
    - `template`
    - `minify`
    - `hash: true`：为 html 引入的 js 加 hash，有利于线上 cache（CDN 会利用 hash 缓存文件），js 内容以改变 hash 就改变、文件名改变，CDN 就可以重新缓存
    - > https://github.com/jantimon/html-webpack-plugin
- extract-text-webpack-plugin
    - 将 css 作为单独文件释放出来
    - https://github.com/webpack-contrib/extract-text-webpack-plugin
- clean-webpack-plugin
    - 生产环境用得较多
    - 只有最新的一份 JS 有用，没用的就可以清空掉，只留最新 build 出来的
    - https://github.com/johnagan/clean-webpack-plugin
# loader
- 格式转换器
## css
- style loader, css loader
    - `use` 数组里从右到左处理
    - https://github.com/webpack-contrib/css-loader
    - https://github.com/webpack-contrib/style-loader
- sass loader
    - https://github.com/webpack-contrib/sass-loader
    - https://github.com/sass/node-sass
- 转换过后的 css 嵌入 js
## server
- webpack-dev-server
    - `open: true` 自动在浏览器打开主页
    - 设置 `proxy` 可以避免跨域问题，前端的请求会代理过去
    - https://github.com/webpack/webpack-dev-server
## webpack 和 babel 配置 react 开发环境 
- `npm install --save react react-dom`
- `npm install --save-dev babel-core babel-preset-react babel-preset-env`
- 创建 .babelrc
- babel loader
    - 转换 react 代码
# 配置多个 html 文件
# pug（jade）作为模板引擎
- `npm install --save-dev pug pug-html-loader raw-loader`
- https://github.com/pugjs/pug
# HMR
- 模块热替换不刷新页面，只替换改变的模块
- https://webpack.js.org/guides/hot-module-replacement/
- chunkhash 表示每个文件使用不同的 hash 值；hash 表示所有文件使用同一个 hash
- 要把 extract-text-webpack-plugin 禁用掉才看得出效果
# 生产环境/开发环境
- 使用环境变量来区分
- `"prod": "NODE_ENV=production node_modules/.bin/webpack -p"`
    - 定义一个环境变量名为 `NODE_ENV`，需大写，值是 `production`，表示线上环境使用上述命令
    - 用 `process.env.NODE_ENV` 引用
- 更好的解决方法见 hello-redux 项目
# 打包图片
- css 中插入图片
    - file loader
    - https://github.com/webpack-contrib/file-loader
- 在 html 中插入 svg 图片要用包
    - https://github.com/webpack-contrib/html-loader
- js 中插入图片
- 压缩图片
    - image webpack loader
    - https://github.com/tcoopman/image-webpack-loader
    - `ls -lh src/images`, `ls -lh dist/images`