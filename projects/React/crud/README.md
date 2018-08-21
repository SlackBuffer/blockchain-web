# fe
- Semantic UI
- 表单错误信息提示
  - 支持一个处理方式下各个输入框的错误提示可分别清除
  - 后端有相同验证
  - 有错误时的提交逻辑
- 改：
  - 共用新增的表单；加对应 item 的 id 作为 url 参数；生命周期函数里加判断，若带 id 参数，就去数据库请求数据，填充输入框
- `mapStateToProps(state, props)` 接两个参数的写法
- `componentWillReceiveProps`：`this.props.game` 该开始没有值，通过异步得到值，接受新的 props 值时得到
- Redirect 跳转（GameFormPage）
# be
- [nodemon](https://github.com/remy/nodemon/)
  - 文件改变自动重启服务器
- 后端解析前端提交的数据要用 `body-parser` 包
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

- 后端对错误路由的中间件处理
- 后端验证用户输入
# db
- `brew info mongodb`
- `brew services start mongodb` 启动
- 进入数据库
  1. `monogo`
  2. `use crud`
  3. `db.games.find({})`
    -> `db.games.find({}).pretty()`

# Deploy

```bash
pm2 start --interpreter babel-node backend/server.js

```