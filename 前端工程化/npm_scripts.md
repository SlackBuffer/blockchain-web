- [curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.9/install.sh | bash
node version manager](https://docs.npmjs.com/getting-started/installing-node#using-a-version-manager-to-install-nodejs-and-npm)
- 创建 `package.json`
    - 运行 `npm init`，输入参数
        - `npm init -y` 创建默认的 `package.json`
            - `-y` 即 `--yes`
        - 编辑 `~/.npm-init.js` 定制要输入的参数
- 指定依赖
    - `dependencies` 指定生产环境的依赖包
        - 运行 `npm install <package_name> --save`，或手动编辑
    - `devDependencies` 指定开发、测试环境的依赖包
        - 运行 `npm install <package_name> --save-dev`，或手动编辑
    - [`npm install`](https://docs.npmjs.com/cli/install) 安装所需的所有依赖
        - [install](https://docs.npmjs.com/cli/install)
    - > [Semantic Versioning](https://docs.npmjs.com/getting-started/semantic-versioning)
- 包和模块
    - `package.json` 里描述的文件或目录称为包
    - 任何可以用 Node.js 的 `require()` 加载的文件或目录称为模块
- 权限错误的消除
    - 法 1：用 nvm 重新安装，不需现在当前版本
    - 法 2：更改 npm 默认目录
---
- npm 使用 `scripts` 字段在 package.json 里定义脚本命令
- `scripts` 字段是对象，每一个属性对应一个脚本
- 命令行下使用 `npm run 属性名` 来运行脚本

    ```
    // package.json

    {
        "scripts": {
            "build": "node build.js"
        }
    }

    // Terminal

    npm run build
    # equivalent to
    node build.js
    ```

- 运行 `num run` 查看当前项目的所有 npm 脚本
- npm 脚本原理：
    - 每当执行 `npm run`，自动新建一个 Shell，在 Shell 里执行指定的脚本命令
        - 因此不光是 Node 脚本，任何可执行的脚本都可以写在里面
    - `npm run` 新建的 Shell 会将当前目录的 `node_modules/.bin` 子目录加入 PATH 变量，执行结束后再将 PATH 变量恢复原样
        - 所以 `node_modules/.bin` 子目录里面的所有脚本都可以直接用脚本名调用而不必加上路径

            ```
            "test": "./nodu_modules/.bin/mocha test"
            // 简写
            "test": "mocha test"
            ```

- npm 脚本的退出码遵循 Shell 脚本规则，退出码不为 0 就认为脚本执行失败
- 通配符

    ```
    "lint": "jshint *.js"
    "lint": "jshint **/*.js"
    "test": "tap test/\*.js"
    ```

    - `*` 表示任意文件名，`**` 表示任意一层目录（later)
    - 若要将通配符传入原始命令，为防止被 Shell 转义要将星号转义
- 传参
    - 使用 `--` 标明

    ```
    "lint": "jshint **.js"
    # 向以上命令传参
    npm run lint -- --reporter checkstyle > checkstyle.xml

    # 或再封装一个命令
    "lint:chckstyle": "npm run lint -- --reporter checkstyle > checkstyle.xml"
    ```

- 执行顺序
    - `&` 表示并行执行
    - `&&` 是继发执行（前一个执行成功才执行下一个任务）

    ```
    npm run script1.js & script2.js
    npm run script1.js && script2.js
    ```
    - 以上是 Bash 的功能，可以使用 Node 的任务管理模块：script-runner、npm-run-all、redrun

- 默认值
    - npm 对两个脚本提供了默认值，无需定义即可使用

    ```
    # 根目录下要有 server.js
    "start": "node server.js"
    # 根目录下要有 binding.gyp
    "install": "node-gyp rebuld"
    ```

- 钩子
    - npm 脚本有 `pre` 和 `post` 两个构成
    - 如 `build` 脚本命令的钩子就是 `prebuild` 和 `postbuild`
        - 可以在这两个钩子里完成一些准备和清理工作

        ```
        "clean": "rimraf ./dist && mkdir dist",        
        "prebuild": "npm run clean",
        "build": "cross-env NODE_ENV=production webpack",
        "postbuild": "echo I run after the build script"
        ```

        - 用户执行 `npm run build` 时自动按照 `npm run prebuild && npm run build && npm run postbuild` 的顺序执行
    - 用户自定义的脚本也可以加上 `pre` 和 `post` 钩子
    - npm 提供一个 `npm_lifecycle_event` 变量，返回当前正在运行的脚本名称
- 简写形式
    - `npm start` === `npm run start`
    - `npm stop` === `npm run stop`
    - `npm test` === `npm run test`
    - `npm restart` === `npm run stop && npm run restart && npm run start`
- 变量
    - 通过环境变量 `process.env` 和 `npm_package_` 前缀，npm 脚本可以拿到 package.json 里面的字段
    - 通过 `npm_config_` 前缀可以拿到 npm 的配置变量，即 `npm config get xxx` 返回的值
    - `env` 命令可以列出所有的环境变量
