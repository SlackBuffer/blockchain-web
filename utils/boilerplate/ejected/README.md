# Init Process
- eject
  - sass: https://medium.com/front-end-hacking/how-to-add-sass-or-scss-to-create-react-app-c303dae4b5bc
  - `resolve`
    - `NODE_PATH=src` in `.env`
    - or https://medium.com/@kkomaz/another-solution-to-absolute-path-setup-in-create-react-app-cccb38d8eea8
  - 省略环境变量前缀：注释 `config/env.js` Line 65
  - 模块 hmr，css hmr
    - 模块 hmr：页面不刷新
      - > https://github.com/gaearon/react-hot-loader#migrating-from-create-react-app
    - css 热加载：页面不刷新
      - 默认自带
  - [ ] scss 组织，css modules
- js 分片
- react-router-dom
- [ ] axios
- [ ] 引入所有 models
- editorconfig
  - dva
- eslint

  ```
  yarn add eslint --dev
  ./node_modules/.bin/eslint --init
  ```

  - > https://georgespake.com/blog/eslint/
  - > https://www.robinwieruch.de/react-eslint-webpack-babel/#eslintBabel
  - https://alligator.io/react/linting-react/
  - https://stackoverflow.com/questions/50672331/failed-to-compile-create-react-app-due-to-lint-warnings-after-ejecting
- antd (rejected) 按需加载

  ```bash
  yarn add babel-plugin-import

  # https://algate.coding.me/2018/04/17/React-create-react-app%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD%E9%85%8D%E7%BD%AEantd/index.html
  # webpack.config.dev.js & webpack.config.prod.js: babel-loader/options
  plugins: [
      ['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }]
  ]
  ```

# Sirius

# bumps

- Module build failed: ReferenceError: window is not defined
  - https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/503
