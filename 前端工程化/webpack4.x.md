# 主要概念
- [安装](https://webpack.js.org/guides/installation/)
- webpack 是一个 JS app 的静态模块打包工具
- webpack 用来编译 JS 模块
    - webpack 处理 app 时，递归构建包括了 app 需要的每一个模块的依赖图，然后将所有模块打包成一个或多个包裹（bundles）
- 4.0.0 以后 webpack 的配置文件不再是必须的
- Entry
    - 入口（entry point）只是 webpack 从哪个模块开始构建依赖图
    - 通过入口模块 webpack 知道它依赖的模块和库
    - 每个依赖被处理并生成叫做包裹的文件
    - 在 `webpack.config.js` 里配
    - 默认入口是 `./src`
- Output
    - `output` 属性告诉 webpack 包括的输出路径和名称
    - 默认是 `./dist`
- Loaders
    - webpack 本身只能理解 JS
    - Loaders 使得 webpack 可以处理其他文件
    - Loaders 把文件转换成有效的 webpack 可以处理的模块，从而包括到依赖图里，最终得以转化成包裹
    - `test` 属性用于匹配可以转换的文件类型
    - `use` 属性指示用哪个 loader 去执行转换
- Plugins
    - 可以用于打包优化，压缩尺寸等等
    - 使用前先 `require()` 在加到 `plugins` 数组里
        - 每个插件可能被用作不同多次使用，需要用 `new` 新建实例
- Mode
    - `mode` 参数值可以是 `development` 或 `production`
    - webpack 会根据所选的模式进行优化
- 在 `./src` 里编辑
- `./dist` （distribution）里的是 webpack 处理后的输出
# 上手
- 项目初始化

    ```
    mkdir webpack-demo && cd webpack-demo
    npm init -y
    npm install webpack webpack-cli --save-dev
    ```

<!-- - `index.html` 放 `./dist` 里 -->
- 安装依赖库

    ```
    # 比如 lodash
    npm install --save lodash
    ```

- 运行 `npx webpack` 来构建
    - 未配置 webpack.config.js 时，webpack 默认把 `./src` 的脚本作为入口，在 `./dist` 里生成 `./dist/index.html'` 指定的 bundle JS 文件
- 加上 webpackage.config.js 方便复杂的配置
- 配置 webpack.config.js 的 `entry`，`output`
- 运行 `npx webpack --config webpack.config.js` 来构建
    - 只有一个配置文件 `--config webpack.config.js` 可省略
- 在 package.json 里配置 npm scripts 来创建构建的快捷方式

    ```js
    {
        // ...
    
        "scripts": {
            "build": "webpack"
        }

        // ...
    }
    ```

    - 此后可以用 `npm run build
- 安装相应模块以便可以导入 css 文件
    - `npm install --save-dev style-loader css-loader`
- 配置 webpack.config.js

    ```js
    module.exports = {
        // ...

        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        'style-loader', //  从 js 字符串生成样式节点
                        'css-loader',   // 将 css 转成 CommonJS
                    ]
                }
            ]
        }
    };
    ```

- 构建后插入的 css 出现在目标 html 文件 `<head>` 标签里，时内联样式
- [用 sass-loader 载入 Sass/SCSS 文件并编译成 CSS](https://webpack.js.org/loaders/sass-loader/)
    - 安装 `npm install sass-loader node-sass webpack --save-dev`

    ```
    module.exports = {
        ...
        module: {
            rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        }]

        },
        plugins: [
            extractSass
        ]
    };

    ```