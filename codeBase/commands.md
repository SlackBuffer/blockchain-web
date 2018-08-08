# docker
- 版本
    - `docker --version`
    - `docker-compose --version`
- `docker logs contanierName`
- `docker ps`, `docker ps -a`  <!-- contanier -->
# go
- 版本
    - `go version`
- `go env`
# npm & yarn
- `yarn add react@next react-dom@next` 升级 react
    - > [docs](https://docs.npmjs.com/)
# vscode
- cmd+b: 开关侧边栏（非 md 文件）
- cmd+p: 查找文件
# terminal
- zsh: ctrl+u，ctrl+w，ctrl+k
# common
- 源码安装

    ```
    ./configure
    make clean
    make
    make install
    ```

# deploy
- mac install telnet: `brew install telnet`
- 查看进程：`ps -ef | grep node`
- 查看 mongodb 是否启动 `telnet localhost 27017`
- 查看服务是否已起在本地 5000 端口：`curl http://localhost:5000`
- Ubunbu 16.04

    ```bash
    # 创建用户
    adduser slackbuffer
    # 加入到 sudo 权限组
    usermod -aG sudo slackbuffer

    # 生成本地机器的公私钥 (/home/slackbuffer/.ssh 目录下)
    ssh-keygen
    # 复制公钥到远程机器
    ssh-copy-id slackbuffer@IP_ADDRESS
    ```

- pm2 用于管理 nodejs 生产环境进程
- Nginx

    ```bash
    vim /etc/nginx/sites-available/default
    vim /etc/nginx/nginx.conf

    # 进入 nginx 配置文件目录
    cd /etc/nginx/conf.d/
    sudo vim nodejs.conf

    # 让配置文件生效
    sudo nginx -s reload
    ``` 