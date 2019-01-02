# docker
- 版本
    - `docker --version`
    - `docker-compose --version`
- `docker logs containerName`
- `docker ps`, `docker ps -a`  <!-- container -->
- `docker image rm`
- `docker run -it ubuntu:16.04 /bin/bash`
- `docker exec -it 0caaedfba92e bash`
# go
- 版本
    - `go version`
- `go env`
# npm & yarn
- `yarn add react@next react-dom@next` 升级 react
    - > [docs](https://docs.npmjs.com/)
- `yarn config set registry 'https://registry.npm.taobao.org'`
# vscode
- cmd+b: 开关侧边栏（非 `.md` 文件）
- cmd+p: 查找文件
# terminal
- `zsh`, `bash`, `echo $SHELL`
- zsh
    - ctrl+e: auto complete
    - ctrl+a, ctrl+e; ctrl+f, ctrl+b
    - ctrl+u: clear to beginning of line
    - ctrl+k: clear to end of line
    - ctrl+w: delete one word backwards
    - alt + left arrow / right arrow
      - > https://stackoverflow.com/a/31328973/6902525
- iTerm2
  - cmd+[, cmd+]: switch between tabs
  - cmd+w: close current tab
- `vi ~/.oh-my-zsh/plugins/git/git.plugin.zsh`
    - >  https://github.com/robbyrussell/oh-my-zsh#custom-plugins-and-themes
# git
- `git --no-pager log`
- stash
    - `git stash push --include-untracked -m "stash for babel-plugin-react-css-modules"`
    - `git stash push -- routes/HelpPage.js styles/_helppage.scss -m "some message"`
    - `git stash apply stash@{0}`
    - `git stash drop stash@{0}`
- branch

    ```bash
    git branch feature-login
    git checkout feature-login
    git push --set-upstream origin feature-login

    git branch -d feature-login
    ```

# common
- 源码安装

    ```
    ./configure
    make clean
    make
    make install
    ```

# Ubuntu
- Ubuntu 16.04

    ```bash
    # 创建用户
    adduser slackbuffer
    # 加入到 sudo 权限组
    usermod -aG sudo slackbuffer

    # 生成本地机器的公私钥 (/home/slackbuffer/.ssh 目录下)
    ssh-keygen

    # 复制公钥到远程机器
    # vi ~/.ssh/id_rsa.pub          # copy
    # vi ~/.ssh/authorized_keys     # paste
    ssh-copy-id slackbuffer@IP_ADDRESS

    # 查看内核、发型版本
    lsb_release -a
    # 查看内存
    free -m
    # 查看硬盘
    df -hl

    lsof -i:portNumber
    kill pid
    ```

- zsh, on-my-zsh, agnoster, zsh-autosuggestions, autojump

    ```bash
    # zsh, on-my-zsh https://gist.github.com/tsabat/1498393
    apt-get install zsh
    apt-get install git-core
    wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh

    chsh -s `which zsh`
    #### chsh: PAM: Authentication failure
    #### sudo vim /etc/passwd/
    #### ubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/zsh

    sudo shutdown -r 0

    # zsh-autosuggestions
    # https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md

    # agnoster on-my-zsh theme
    # https://github.com/agnoster/agnoster-zsh-theme
    # https://github.com/powerline/fonts
    # https://github.com/robbyrussell/oh-my-zsh/issues/1906#issuecomment-275733922

    # autojump
    sudo apt-get update
    sudo apt-get install autojump
    # /usr/share/doc/autojump/README.Debian 是配置说明
    # .zshrc 最后一行加 `. /usr/share/autojump/autojump.sh`
    # source ~/.zshrc
    # https://blog.csdn.net/shengzhu1/article/details/54590158

    # 无法 chsh -s `which zsh` 可直接在命令行输入 zsh
    #### 或在 ~/.bashrc 里第一行添加 exec zsh，每次启动 bash 自动启动 zsh
    #### 加 exec zsh 会使 scp 失败
    #### https://superuser.com/questions/395356/scp-doesnt-work-but-ssh-does
    ```

## deploy
- mac install telnet: `brew install telnet`
- 查看进程：`ps -ef | grep node`
- mongodb  
  
    ```bash
    telnet localhost 27017
    sudo systemctl start mongod
    ```

- telnet localhost 27017```
- 查看服务是否已起在本地 5000 端口：`curl http://localhost:5000`
- `scp -r build ubuntu@192.168.9.21:/home/ubuntu/go/src/vnt-console/backend/static` 传文件
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

    # https://medium.com/@utkarsh_verma/configure-nginx-as-a-web-server-and-reverse-proxy-for-nodejs-application-on-aws-ubuntu-16-04-server-872922e21d38
    ``` 

- https

    ```bash
    # Generating a Certificate Signing Request (CSR) in Ubuntu 16.04
    # https://www.liquidweb.com/kb/generating-certificate-signing-request-csr-ubuntu-16-04/
    openssl req -new -newkey rsa:2048 -nodes -keyout hofungkoeng.com.key -out hofungkoeng.com.csr
    cat hofungkoeng.com.csr

    # 随风
    # https://www.rails365.net/articles/shi-yong-acme-sh-an-zhuang-let-s-encrypt-ti-gong-mian-fei-ssl-zheng-shu
    wget -O -  https://get.acme.sh | sh
    source ~/.bashrc
    acme.sh --issue -d nodejsblog.hofungkoeng.com -w /home/slackbuffer/nodejs-blog/public

    acme.sh --installcert -d nodejsblog.hofungkoeng.com \
               --keypath       /home/slackbuffer/ssl/nodejsblog.hofungkoeng.com.key  \
               --fullchainpath /home/slackbuffer/ssl/nodejsblog.hofungkoeng.com.key.pem \
               --reloadcmd     "sudo nginx -s reload"

    openssl dhparam -out /home/slackbuffer/ssl/nodejsblog.hofungkoeng.com.dhparam.pem 2048

    ssl_certificate         /home/slackbuffer/ssl/nodejsblog.hofungkoeng.com.key.pem;
    ssl_certificate_key     /home/slackbuffer/ssl/nodejsblog.hofungkoeng.com.key;
    ssl_dhparam             /home/slackbuffer/ssl/nodejsblog.hofungkoeng.com.dhparam.pem;

    server {
        listen 80;
        server_name nodejsblog.hofungkoeng.com;
        return 301 https://nodejsblog.hofungkoeng.com$request_uri;
    }
    vim /etc/nginx/nginx.conf
    ```

# ssh
- VPS 保持连接

    ```bash
    # 本机 ~/.ssh/config 文件
    Host IP_Address
        Hostname IP_Address
        User user_name
        ServerAliveInterval 50 # 发心跳间隔
        ServerAliveCountMax 60 # 失败重发次数
    
    # https://blog.phpgao.com/keep_connect_ssh.html
    # 查看是否生效 - 每隔 30s 后返回一组结果
    ssh -o ServerAliveInterval=30 -vvv user@host
    ```