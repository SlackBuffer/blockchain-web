# fe
- 注册表单的 onChange 和 onSubmit 逻辑
- 传 `history` 给没有 `history` 的组件
    - > 在 `<Route>` 里定义的组件的 props 由 `history` 属性
    1. 通过有 history 的父组件传递
    2. 用 withRouter 包起来（`react-router-dom`）
    3. 用 context 取出来
- 每个请求带 localstorage 里存的 jwt 
    - `axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;`
# be
- 校验输入
    - https://github.com/chriso/validator.js/
- 验证 error 自动非空
    - `lodash/isEmpty`
- 路由归属

    ```js
    // index.js
    app.use('api/users', users)
    // users.js
    let router = express.Router();
    router.post('/articles', (req, res) => {});
    // api/users/articles 会进到以上路由
    ```

- 后端返回 token 字段（值为 jwt）给前端
# db
docker run --name reduxlogin -p 5432:5432 -e POSTGRES_PASSWORD=123456 -e POSTGRES_USER=hofungkoeng -e POSTGRES_DB=reduxlogin -d postgres

docker exec -it reduxlogin bash

psql -U postgres reduxlogin

\d, \dt, \d users

select * from users;

- orm: bookshelf
- 用 knex 写迁移脚本创建数据库
- bcrypt 加密密码