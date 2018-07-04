# fe
- Semantic UI
# be
- [nodemon](https://github.com/remy/nodemon/)
  - 文件改变自动重启服务器
- 使 nodejs 支持 ES6 

  ```bash
  # step 1
  npm install --save-dev babel-cli babel-preset-env

  # step 2: Create a .babelrc file (or use your package.json)
  ## .babelrc
  { "presets": ["env"] }

  ## (or) package.json
  ...
  "babel": {
    "presets": ["env"]
  }

  # step 3: package.json
  "scripts": {
    ...
    "start": "nodemon --exec babel-node -- ./server.js"
  }

  # step 4
  npm start
  ```