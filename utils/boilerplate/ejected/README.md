# Init Process
- eject
    - sass: https://medium.com/front-end-hacking/how-to-add-sass-or-scss-to-create-react-app-c303dae4b5bc
    - `resolve`
        - `NODE_PATH=src` in `.env`
        - or https://medium.com/@kkomaz/another-solution-to-absolute-path-setup-in-create-react-app-cccb38d8eea8
    - 省略环境变量前缀：注释 `config/env.js` Line 65 
    - [ ] hmr
    - [ ] scss 组织，css modules
- [ ] editorconfig
- [ ] eslint: standard, airbnb-base

    ```
    yarn add eslint --dev
    ./node_modules/.bin/eslint --init
    ```

    - > https://georgespake.com/blog/eslint/
- [ ] react-router
# Sirius
# bumps
- Module build failed: ReferenceError: window is not defined
    - https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/503