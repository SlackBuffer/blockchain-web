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
# Deploy

```bash
npm install -g babel-cli
npm install -g knex
# knex init
# npm install pg --save
# knex migrate:make users
knex migrate:latest
pm2 start --interpreter babel-node server/index.js


sudo nginx -s reload    # 让配置文件生效
sudo nginx -s quit      # 退出
sudo nginx              # 运行
vi /etc/nginx/nginx.conf
##
# Virtual Host Configs
##
## include /etc/nginx/conf.d/*.conf;
## include /etc/nginx/sites-enabled/*;
cd /etc/nginx/conf.d
sudo vi admin_dashboard.conf

#### admin_dashboard.conf
server {
    listen 80;
    server_name dashboard.hofungkoeng.com;
    root /home/slackbuffer/admin_dashboard/client/build;

    try_files $uri/index.html $uri @nodejs;
    location @nodejs {
    ## location / {
        proxy_pass http://127.0.0.1:6060;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
     }
}

acme.sh --issue -d dashboard.hofungkoeng.com -w /home/slackbuffer/admin_dashboard/client/build
acme.sh --installcert -d dashboard.hofungkoeng.com \
               --keypath       /home/slackbuffer/ssl/dashboard.hofungkoeng.com.key  \
               --fullchainpath /home/slackbuffer/ssl/dashboard.hofungkoeng.com.key.pem \
               --reloadcmd     "sudo nginx -s reload"
openssl dhparam -out /home/slackbuffer/ssl/dashboard.hofungkoeng.com.dhparam.pem 2048


server {
    listen 443 ssl;
    ssl_certificate         /home/slackbuffer/ssl/dashboard.hofungkoeng.com.key.pem;
    ssl_certificate_key     /home/slackbuffer/ssl/dashboard.hofungkoeng.com.key;
    ssl_dhparam             /home/slackbuffer/ssl/dashboard.hofungkoeng.com.dhparam.pem;
    server_name dashboard.hofungkoeng.com;
    root /home/slackbuffer/admin_dashboard/client/build;
    try_files $uri/index.html $uri @nodejs;
    location @nodejs {
    ## location / {
        proxy_pass http://127.0.0.1:6060;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
     }
}

server {
    listen 80;
    server_name dashboard.hofungkoeng.com;
    return 301 https://dashboard.hofungkoeng.com$request_uri;
}
```