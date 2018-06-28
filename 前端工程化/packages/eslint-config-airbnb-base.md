- [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb-base)
- 查看最新版本的依赖

    ```
    npm info "eslint-config-airbnb-base@latest" peerDependencies
    ```

- 安装依赖

    ```
    (
    export PKG=eslint-config-airbnb-base;
    npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@latest"
    )
    ```

- 在项目目录运行 `$ ./node_modules/.bin/eslint --init` 后，选择 popular - airbnb - no react，自动完成 `.eslintrc.js` 的创建