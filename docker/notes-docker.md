# 实践
- `docker rmi [repository_name1]:[tag1]` 移除 IMAGE ID 相同 TAG 不同的镜像
- `docker logs`
- `docker container rm -f containerID`
# From rails365
- 容器是运行在镜像上的进程
    - 镜像是模板，存在于磁盘上，容器是模板生成的实例
- `docker images` 查看系统上的镜像 
    - `docker images nginx`
- `docker pull hello-world`
- `docker run hello-world`
- `docker ps` 查看容器进程
    - `docker ps -a` 查看推出过的进程
- `docker run -it ubuntu bash`
    - `bash` 表示进入 ubuntu 镜像的容器的 shell
    - `-t` 让 Docker 分配一个伪终端（pseudo-tty）并绑定到容器的标准输入上，`-i` 让容器的标准输入保持打开
- `docker run -d -p 80:80 --name webserver nginx`
    - 容器名 `webserver`
    - `-p` 第一个参数是暴露在外的端口
    - `-d` 以守护态运行
    - `curl http://127.0.0.1` 查看是否运行了 nginx 服务
- `docker stop imageName` 停止容器
- `docker restart webserver`
- `$ docker rm -f $(docker ps -a | grep Exit | awk '{ print $1 }')` 清除已退出的容器
- `--link` 供单击的容器之间打通一个网络通道，这样不必通过 ip 访问，通过别名访问
- `-rm` 参数会在容器退出后将其删除
- `$ docker exec -it webserver bash`
    - `echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html`
    - `exit`
- 保存修改后的镜像

    ```
    docker commit \
        --author "sb zoeyeooz@gmail.com" \
        --message "修改了默认网页" \
        webserver \
        nginx:v2
    ```

    - 慎用 `docker commit`
- Dockerfile 是纯文本文件，把构建镜像的指令一条条放在文件中，然后就可以 build 出一个镜像

    ```
    # Dockerfile
    FROM nginx
    RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html

    # run from bash
    docker build .
    # 加名称
    docker build -t nginx:v3 .
    ```

    - `FROM` 表示基础镜像，`RUN` 表示运行的命令
    - 每条指令都会创建一层镜像，不要单独写太多的 `RUN` 语句，要串起来
- `ARG` 表示设置一个参数，build 时从外部通过命令行参数传入
    - `$ docker build --build-arg PORT=3000 --build-arg NPM_TOKEN=e43d3f2c-e7b7-4522-bf74-b7d2863eddf7 .`
- `ENV` 是设置环境变量，以后此变量可以传到 docker 容器内部去
- `EXPOSE` 表示暴露的端口号
- `WORKDIR` 指定工作目录
- `CMD` 是容器的启动命令
- 数据卷可以把主机的数据以挂载的方式链接到容器中，不同的容器可以共享，数据也不会因为容器的退出而丢失
    - `docker run -d -v ~/mynginx:/a -p 80:80 --name webserver nginx` 把主机目录 `~/mynginx` 挂载到容器目录 `/a` 中
- 可以创建数据卷容器
    - `$ sudo docker run -d -v /dbdata --name dbdata training/postgres echo Data-only container for postgres`
    - 其它容器要使用此数据卷容器只需使用 `--volumes-from` 参数
    - `sudo docker run -d --volumes-from dbdata --name db1 training/postgres`
- `docker compose` 能够运行容器，即用来实现部署；compose 还能把多个容器串联起来
---
# 简介
- 对于 Linux 而言，内核启动后，会挂载 root 文件系统为其提供用户空间支持。而 Docker 镜像（Image），就相当于是一个 root 文件系统。比如官方镜像 ubuntu:16.04 就包含了完整的一套 Ubuntu 16.04 最小系统的 root 文件系统
- Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变
- 镜像按分层分层存储结构设计
- 镜像构建时，会一层层构建，前一层是后一层的基础。每一层构建完就不会再发生改变，后一层上的任何改变只发生在自己这一层
    - 比如，删除前一层文件的操作，实际不是真的删除前一层的文件，而是仅在当前层标记为该文件已删除。在最终容器运行的时候，虽然不会看到这个文件，但是实际上该文件会一直跟随镜像
- 镜像是静态的定义，容器是镜像运行时的实体
- 容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的命名空间，因此容器可以拥有自己的 root 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间，容器内的进程是运行在一个隔离的环境里
- 容器也是分层存储，每一个容器运行时，以镜像为基础层，在其上创建一个当前容器的存储层，可以称这个为容器运行时读写而准备的存储层为容器存储层
    - 容器存储层的生存周期和容器一样，容器消亡时，容器存储层也随之消亡，因此，任何保存于容器存储层的信息都会随容器删除而丢失
    - 按照 Docker 最佳实践的要求，容器不应该向其存储层内写入任何数据，容器存储层要保持无状态化。所有的文件写入操作，都应该使用数据卷（Volume），或者绑定宿主目录，在这些位置的读写会跳过容器存储层，直接对宿主（或网络存储）发生读写，其性能和稳定性更高
- 数据卷的生存周期独立于容器，容器消亡，数据卷不会消亡。因此，使用数据卷后，容器删除或者重新运行之后，数据却不会丢失
- Docker registry 提供集中的存储、分发镜像的任务
- 一个 Docker Registry 中可以包含多个仓库（Repository）；每个仓库可以包含多个标签（Tag）；每个标签对应一个镜像
    - 通常，一个仓库会包含同一个软件不同版本的镜像，而标签就常用于对应该软件的各个版本
    - 可以通过 `<仓库名>:<标签>` 的格式来指定具体是这个软件哪个版本的镜像。如果不给出标签，将以 `latest` 作为默认标签
        - `ubuntu` 是仓库的名字，其内包含有不同的版本标签，如，`14.04`, `16.04`。我们可以通过 `ubuntu:14.04`，或者 `ubuntu:16.04` 来具体指定所需哪个版本的镜像。如果忽略了标签，比如 `ubuntu`，那将视为 `ubuntu:latest`
    - 仓库名经常以 两段式路径 形式出现，比如 `jwilder/nginx-proxy`，前者往往意味着 Docker Registry 多用户环境下的用户名，后者则往往是对应的软件名
- 测试安装

    ```
    docker info
    docker version
    docker --version
    docker-compose --version
    docker-machine --version

    $ docker run -d -p 80:80 --name webserver nginx
    ```

- 镜像加速配置
    - Perferences... -> Daemon -> Registry mirrors
    - 在列表中填写加速器地址 `https://registry.docker-cn.com`
    - 用 `docker info` 查看
# 使用镜像
## 获取镜像
- 从 Docker 镜像仓库获取镜像的命令是 `docker pull`
    - `docker pull [选项] [Docker Registry 地址[:端口号]/]仓库名[:标签]`
    - Docker 镜像仓库地址：地址的格式一般是 `<域名/IP>[:端口号]`，默认地址是 Docker Hub
    - 仓库名： `<用户名>/<软件名>`。对于 Docker Hub，如果不给出用户名，则默认为 `library`，即官方镜像
    - `docker pull ubuntu:16.04` 没给出 Docker 镜像仓库地址，因此将会从 Docker Hub 获取镜像；镜像名称是 `ubuntu:16.04`，因此将会获取官方镜像 `library/ubuntu` 仓库中标签为 16.04 的镜像
- 镜像是多层存储，下载也是一层层下载
    - 下载过程中给出了每一层的 ID 的前 12 位；下载结束后，给出该镜像完整的 sha256 的摘要，以确保下载一致性
- 运行

    ```
    docker run -it --rm ubuntu:16.04 bash

    cat /etc/os-release
    cat /etc/os-release
    ```

    - `it`：交互式操作，`-t`：终端
    - `--rm`：容器退出后随之将其删除。默认情况下，为了排障需求，退出的容器并不会立即删除，除非手动 `docker rm`，这里只是随便执行个命令，看看结果，不需要排障和保留结果，因此使用 `--rm` 可以避免浪费空间
    - `ubuntu：16.04` 表示以其为基础来启动容器
    - 加上 `bash` 可以得到交互式 shell
## 列出镜像
- `docker image ls`
- 镜像 ID 是镜像的唯一标识；一个镜像可以有多个标签
- Docker Hub 上显示的大小是压缩后的大小，本地大小是解压后展开的各层所占的空间的总和
    - Docker 使用 Union FS，相同的层只需要保存一份即可
    - Docker 镜像是多层存储结构，并且可以继承、复用，因此不同镜像可能会因为使用相同的基础镜像，从而拥有共同的层 
    - `docker system df` 查看镜像、容器、数据卷所占的空间
- 无标签镜像称为虚悬镜像
    - `docker image ls -f dangling=true` 显示虚悬镜像
    - `docker image prune` 删除虚悬镜像
        - 一般来说虚悬镜像无价值，可以删除
    - > 原来为 `mongo:3.2`，随着官方镜像维护，发布了新版本后，重新 `docker pull mongo:3.2` 时，`mongo:3.2` 这个镜像名被转移到了新下载的镜像身上，而旧的镜像上的这个名称则被取消，从而成为了 `<none>`；除了 `docker pull` 可能导致这种情况，`docker build` 也同样可以导致这种现象
- 为了加速镜像构建、重复利用资源，Docker 会利用中间层镜像
    - `docker image ls -a` 可以显示中间层镜像，不加 `-a` 不会显示
    - 列出的无标签镜像很多都是中间层镜像，是其它镜像所依赖的镜像，这些无标签镜像不应删除
    - 删除依赖中间层镜像的镜像后，这些中间层镜像也会被连带删除
- 列出部分镜像

    ```
    docker image ls ubuntu
    docker image ls ubuntu:16.04

    docker image ls -f since=mongo:3.2  # 列出 mongo:3.2 之后建立的镜像，-f 也可写成 --filter；since 可换成 before
    docker image ls -f label=com.example.version=0.1    # 用构建镜像时定义定义的 LABEL 来过滤
    ```

- `docker image ls -q` 列出镜像 ID
- 利用 Go 模板语法自定义表格结构
    - `docker image ls --format "{{.ID}}: {{.Repository}}"` 直接列出镜像结果
    - `docker image ls --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}"` 自定义表格
## 删除本地镜像
- `$ docker image rm [选项] <镜像1> [<镜像2> ...]`
    - `<镜像>` 可以是镜像短 ID，镜像长 ID，镜像名，镜像摘要
    - `docker image ls` 默认是短 ID，一般取前 3 个字符以上，足够区分其它镜像即可
    - 使用镜像名（`<仓库名>:<标签>`）也可以删除
    - 使用镜像摘要删除更精确

        ```
        docker image ls --digest
        docker image rm node@DIGEST FROM LAST COMMAND
        ```
    
- 删除行为分为两类：`Untagged`，`Deleted`
    - 当某镜像所有的标签都被取消了，该镜像很可能就失去了存在的意义，此时才会触发删除行为
    - 镜像是多层存储结构，因此在删除的时候也是从上层向基础层方向依次进行判断删除，若某个其它镜像正依赖于当前镜像的某一层，这种情况，依旧不会触发删除该层的行为
    - 若有用这个镜像启动的容器存在（即使容器没有运行），那么同样不会删除这个镜像
        - 若容器是不需要的，应该先将它们删除，然后再来删除镜像
- 用 `docker image ls` 命令配合删除
    - `docker image rm $(docker image ls -q redis)` 删除所有仓库名为 `redis` 的镜像
    - `docker image rm $(docker ls -q -f before=mongo:3.2)` `--filter` 配合 `-q` 产生出指定范围的 ID 列表，然后送给另一个 `docker` 命令作为参数
- commit 之后用 `docker history nginx:v2` 和 `docker history nginx:latest` 比较历史记录，可以看到最新提交的那一层
    - 手动操作给旧的镜像添加了新的一层，形成新的镜像，可以加深对镜像多层存储的理解
- 慎用 `docker commit`
## 使用 Dockerfile 定制镜像
- 镜像的定制实际上就是定制每一层所添加的配置、文件
- 可以把每一层修改、安装、构建、操作的命令都写入一个脚本，用这个脚本来构建、定制镜像，这个脚本即 Dockerfile
- `FROM` 指定基础镜像
    - 一个 Dockerfile 中 `FROM` 是必备的指令，并且必须是第一条指令
    - Docker 还存在一个特殊的镜像，名为 `scratch`，这个镜像是虚拟的概念，并不实际存在，它表示一个空白的镜像
        - 以 `scratch` 为基础镜像的话，意味着不以任何镜像为基础，接下来所写的指令将作为镜像第一层开始存在
- 不以任何系统为基础，直接将可执行文件复制进镜像的做法并不罕见，比如 `swarm`、`coreos/etcd`
    - 对于 Linux 下静态编译的程序来说，并不需要有操作系统提供运行时支持，所需的一切库都已经在可执行文件里了，因此直接 `FROM scratch` 会让镜像体积更加小巧
    - 使用 Go 语言开发的应用很多会使用这种方式来制作镜像，这也是为什么有人认为 Go 是特别适合容器微服务架构的语言的原因之一
- `RUN` 执行命令
    1. shell 格式：`RUN <命令>`
        - `RUN echo '<h1>Hello, Docker!</h1>' > /usr/share/nginx/html/index.html`
    2. exec 格式：`RUN ["可执行文件", "参数1", "参数2"]`
        - 每一个 `RUN` 的都会新建立一层，在其上执行这些命令，执行结束后，commit 这一层的修改，构成新的镜像
        - Dockerfile 支持 Shell 类的行尾添加 `\` 的命令换行方式，以及行首 `#` 进行注释的格式
- 镜像是多层存储，每一层的东西并不会在下一层被删除，会一直跟随着镜像。因此镜像构建时，一定要确保每一层只添加真正需要添加的东西，任何无关的东西都应该清理掉
- 构建
    - `docker build [选项] <上下文路径/URL/>`
        - `docker build -t nginx:v3 .`
- `docker build` 工作原理
    - Docker 在运行时分为 Docker 引擎（即服务端守护进程）和客户端工具
    - Docker 的引擎提供了一组 REST API，被称为 Docker Remote API
    - `docker` 命令这样的客户端工具，通过这组 API 与 Docker 引擎交互，从而完成各种功能
    - 因此，虽然表面上是在本机执行各种 `docker` 功能，但实际上，一切都是使用的远程调用形式在服务端（Docker 引擎）完成，也因为这种 C/S 设计，让我们操作远程服务器的 Docker 引擎变得轻而易举
    - 进行镜像构建的时候，并非所有定制都会通过 `RUN` 指令完成，经常会需要将一些本地文件复制进镜像，比如通过 `COPY` 指令、`ADD` 指令
    - `docker build` 命令构建镜像，并非在本地构建，而是在服务端，也就是 Docker 引擎中构建，为了让服务端获得本地文件，就引入了上下文的概念
    - 构建时，用户会指定构建镜像上下文的路径，`docker build` 命令得知这个路径后，会将路径下的所有内容打包，然后上传给 Docker 引擎，这样 Docker 引擎收到这个上下文包后，展开就会获得构建镜像所需的一切文件
        - `COPY ./package.json /app/` 并不是复制执行 `docker build` 命令所在的目录下的 package.json，也不是复制 Dockerfile 所在目录下的 package.json，而是复制上下文（context）目录下的 package.json
        - 因此 `COPY` 这类指令中的源文件的路径都是相对路径，所以 `COPY ../package.json /app` 或者 `COPY /opt/xxxx /app` 无法工作，因为这些路径已经超出了上下文的范围，Docker 引擎无法获得这些位置的文件
        - 如果真的需要那些文件，应该将它们复制到上下文目录中去
- 一般来说，应该会将 Dockerfile 置于一个空目录下，或者项目根目录下；如果该目录下没有所需文件，那么应该把所需文件复制一份过来；如果目录下有些东西确实不希望构建时传给 Docker 引擎，那么可以用 `.gitignore` 一样的语法写一个 `.dockerignore`，该文件是用于剔除不需要作为上下文传递给 Docker 引擎的
- 默认情况下，如果不额外指定 Dockerfile 的话，会将上下文目录下的名为 Dockerfile 的文件作为 Dockerfile
    - 这默认行为，实际上 Dockerfile 的文件名并不要求必须为 Dockerfile，而且并不要求必须位于上下文目录中，比如可以用 `-f ../Dockerfile.php` 参数指定某个文件作为 Dockerfile
    - 一般会使用默认的文件名 Dockerfile，以及会将其置于镜像构建上下文目录中
- 直接用 git repo 构建
    - `docker build https://github.com/twang2218/gitlab-ce-zh.git#:8.14`
        - 指定构建所需的 repo
        - 默认指定 master 分支
        - 构建目录为 `/8.14`
- 用给定的 tar 压缩包构建
    - `$ docker build http://server/context.tar.gz`
- 从标准输入中读取 Dockerfile 进行构建
    - `docker build - < Dockerfile` 或 `cat Dockerfile | docker build -`
    - 如果标准输入传入的是文本文件，则将其视为 Dockerfile，并开始构建
    - 这种形式由于直接从标准输入中读取 Dockerfile 的内容，没有上下文，因此不可以像其他方法那样可以将本地文件 `COPY` 进镜像等类似操作
- 从标准输入中读取上下文压缩包进行构建
    - `docker build - < context.tar.gz`
    - 如果发现标准输入的文件格式是 gzip、bzip2 以及 xz 的话，将会使其为上下文压缩包，直接将其展开，将里面视为上下文，并开始构建
### `COPY` 复制文件
- `COPY <源路径>... <目标路径>`
- `COPY ["<源路径1>",... "<目标路径>"]`
- `<源路径>` 可以是多个，甚至可以是通配符，其通配符规则要满足 Go 的 filepath.Match 规则
- `<目标路径>` 可以是容器内的绝对路径，也可以是相对于工作目录的相对路径（工作目录可以用 `WORKDIR` 指令来指定）。目标路径不需要事先创建，如果目录不存在会在复制文件前先行创建缺失目录
- 使用 `COPY` 指令，源文件的各种元数据都会保留。比如读、写、执行权限、文件变更时间等。这个特性对于镜像定制很有用，特别是构建相关文件都在使用 Git 进行管理的时候

    ```
    COPY package.json /usr/src/app/
    COPY hom* /mydir/
    COPY home?txt /mydir/
    ```

### `ADD` 更高级的复制
- `ADD` 和 `COPY` 的格式和性质基本一致，在 `ADD` 基础上增加了功能
- `<源路径>` 可以是一个 URL，这种情况下，Docker 引擎会试图去下载这个链接的文件放到 `<目标路径>` 去
    - 下载后的文件权限自动设置为 600，修改权限还需要增加额外的一层 `RUN` 进行权限调整
    - 如果下载的是个压缩包，需要解压缩，也一样还需要额外的一层 `RUN` 指令进行解压缩
    - 所以不如直接使用 `RUN` 指令，然后使用 `wget` 或者 `curl` 工具下载，处理权限、解压缩、然后清理无用文件更合理
    - 因此，这个功能其实并不实用，而且不推荐使用
- 如果 `<源路径>` 为一个 tar 压缩文件的话，压缩格式为 gzip, bzip2 以及 xz 的情况下，`ADD` 指令将会自动解压缩这个压缩文件到 `<目标路径>` 去

    ```
    FROM scratch
    ADD ubuntu-xenial-core-cloudimg-amd64-root.tar.gz /
    ...
    ```

- 另外需要注意的是，`ADD` 指令会令镜像构建缓存失效，从而可能会令镜像构建变得比较缓慢
- 尽可能的使用 `COPY`，因为 `COPY` 的语义很明确，就是复制文件而已，而 `ADD` 则包含了更复杂的功能，其行为也不一定很清晰
- 最适合使用 `ADD` 的场合，就是所提及的需要自动解压缩的场合
### `CMD` 容器启动命令
- `CMD` 命令
    1. shell 格式：`CMD <命令>`
    2. exec 格式：`CMD ["可执行文件", "参数1", "参数2"...]`
- 容器是进程，在启动容器的时候，需要指定所运行的程序及参数
- `CMD` 指令就是用于指定默认的容器主进程的启动命令
- 在运行时可以指定新的命令来替代镜像设置中的这个默认命令
    - ubuntu 镜像默认的 `CMD` 是 `/bin/bash`，直接 `docker run -it ubuntu`，会直接进入 bash
    - 可以在运行时指定运行别的命令，如 `docker run -it ubuntu cat /etc/os-release`，这就是用 `cat /etc/os-release` 命令替换了默认的 `/bin/bash` 命令，输出了系统版本信息
- 指令格式一般推荐使用 `exec` 格式，这类格式在解析时会被解析为 JSON 数组，因此一定要使用双引号，而不要使用单引号
- 使用 shell 格式的话，实际的命令会被包装为 `sh -c` 的参数的形式进行执行
    
    ```
    CMD echo $HOME
    # 实际执行会被转成如下形式
    CMD ["sh", "-c", "echo $HOME"]
    ```

    - 环境变量会被 shell 进行解析处理，所以可以使用环境变量
- Docker 不是虚拟机，容器中的应用都应该以前台执行，而不是像虚拟机、物理机里面那样，用 `upstart/systemd` 去启动后台服务，容器内没有后台服务的概念
    - 使用 `service nginx start` 命令，是希望 `upstart` 来以后台守护进程形式启动 nginx 服务，而`CMD service nginx start` 会被理解为 `CMD [ "sh", "-c", "service nginx start"]`，因此主进程实际上是 sh，那么当 `service nginx start` 命令结束后，sh 也就结束了，sh 作为主进程退出了，就会令容器退出
    - 正确的做法是直接执行 nginx 可执行文件，并且要求以前台形式运行。比如 `CMD ["nginx", "-g", "daemon off;"]`
    - 所以容器里也不能使用 `systemctl` 命令
### `ENTRYPOINT` 入口点
- `ENTRYPOINT` 的格式和 `RUN` 指令格式一样，分为 exec 格式和 shell 格式
- `ENTRYPOINT` 的目的和 `CMD` 一样，都是指定容器启动程序及参数
- `ENTRYPOINT` 在运行时也可以替代，比 `CMD` 要略显繁琐，需要通过 `docker run` 的参数 `--entrypoint` 来指定
- 当指定了 `ENTRYPOINT` 后，`CMD` 的含义就发生了改变，不再是直接的运行其命令，而是将 `CMD` 的内容（跟在镜像名后面的是 `CMD` 的内容）作为参数传给 `ENTRYPOINT` 指令，实际执行时，将变为 `<ENTRYPOINT> "<CMD>"`
- `<ENTRYPOINT>` 的优势
    1. 让镜像可以像命令一样使用（可以传参数）
    2. 执行应用运行前的准备工作
        - 将预处理工作写成脚本，放入 `ENTRYPOINT` 去执行
### `ENV` 设置环境变量
- 格式
    1. `ENV <key> <value>`
    1. `ENV <key1>=<value1> <key2>=<value2>...`
- 后面的其它指令如 `RUN`，运行时的应用，都可以直接使用这里定义的环境变量
- 下列指令可以支持环境变量展开： `ADD`、`COPY`、`ENV`、`EXPOSE`、`LABEL`、`USER`、`WORKDIR`、`VOLUME`、`STOPSIGNAL`、`ONBUILD`
- 利用环境变量可以让一份 Dockerfile 制作更多的镜像，只需使用不同的环境变量
### `ARG` 构建参数
- 格式 `ARG <参数名>[=<默认值>]`
- 构建参数和 `ENV` 也是设置环境变量,不同的是 `ARG` 所设置的构建环境的环境变量，在将来容器运行时不会存在这些环境变量
    - 不要因此就使用 ARG 保存密码之类的信息，因为 `docker history` 可以看到所有值
- `ARG` 指令定义参数名称，并定义其默认值，该默认值可以在构建命令 `docker build` 中用 `--build-arg <参数名>=<值> 来覆盖`
### `VOLUME` 定义匿名卷
- 格式为
    1. `VOLUME ["<路径1>", "<路径2>"...]`
    2. `VOLUME <路径>`
- 容器运行时应该尽量保持容器存储层不发生写操作，对于数据库类需要保存动态数据的应用，其数据库文件应该保存于卷（volume）中
- 为了防止运行时用户忘记将动态文件所保存目录挂载为卷，在 Dockerfile 中，可以事先指定某些目录挂载为匿名卷，这样在运行时如果用户不指定挂载，其应用也可以正常运行，不会向容器存储层写入大量数据
- `VOLUME /data` 会将 `/data` 目录在运行时自动挂载为匿名卷，任何向 `/data` 中写入的信息都不会记录进容器存储层，从而保证了容器存储层的无状态化
    - 运行时可以覆盖这个挂载设置，如 `docker run -d -v mydata:/data xxxx`
    - 此命令使用 `mydata` 这个命名卷挂载到了 `/data` 这个位置，替代了 Dockerfile 中定义的匿名卷的挂载配置
### `EXPOSE` 声明端口
- 格式为 `EXPOSE <端口1> [<端口2>...]`
- `EXPOSE` 指令声明运行时容器提供服务端口
    - 只是一个声明，在运行时并不会因为这个声明应用就会开启这个端口的服务
- 在 Dockerfile 中写入这样的声明有两个好处，一个是帮助镜像使用者理解这个镜像服务的守护端口，以方便配置映射；另一个用处则是在运行时使用随机端口映射时，也就是 `docker run -P` 时，会自动随机映射 `EXPOSE` 的端口
- `EXPOSE` 和在运行时使用 `-p <宿主端口>:<容器端口>` 区分开来。`-p` 是映射宿主端口和容器端口，就是将容器的对应端口服务公开给外界访问；而 `EXPOSE` 仅仅是声明容器打算使用什么端口，并不会自动在宿主进行端口映射
### `WORKDIR` 指定工作目录
- `格式为 WORKDIR <工作目录路径>`
- 使用 `WORKDIR` 指令可以来指定工作目录（或称为当前目录），以后各层的当前目录就变为该目录
    - 若该目录不存在，`WORKDIR` 会自动创建
- 误用案例

    ```
    RUN cd /app
    RUN echo "hello" > world.txt
    ```

    - 构建此 Dockfile 并运行镜像后会找不到 `/app/world.txt`，或者其内容不是 `hello`
    - 在 Shell 中，连续两行是同一个进程执行环境，因此前一个命令修改的内存状态，会直接影响后一个命令
    - 在 Dockerfile 中，这两行 RUN 命令的执行环境根本不同，是两个完全不同的容器；每一个 `RUN` 都启动一个容器、执行命令、然后提交存储层文件变更
    - 第一层 `RUN cd /app` 的执行仅仅是当前进程的工作目录变更，一个内存上的变化而已，其结果不会造成任何文件变更，而到第二层的时候，启动的是一个全新的容器，跟第一层的容器更完全没关系，自然不可能继承前一层构建过程中的内存变化
    - 因此如果需要改变以后各层的工作目录的位置，那么应该使用 `WORKDIR` 指令
### `USRE` 指定当前用户
- 格式 `USER <用户名>`
- `USER` 指令和 WORKDIR 相似，都是改变环境状态并影响以后的层
- `WORKDIR` 是改变工作目录，`USER` 则是改变之后层的执行 `RUN`，`CMD` 以及 `ENTRYPOINT` 这类命令的身份
- 和 `WORKDIR` 一样，`USER` 只是切换到指定用户，这个用户必须是事先建立好的，否则无法切换

    ```
    RUN groupadd -r redis && useradd -r -g redis redis
    USER redis
    RUN [ "redis-server" ]
    ```

- 如果以 root 执行的脚本，在执行期间希望改变身份，比如希望以某个已经建立好的用户来运行某个服务进程，不要使用 `su` 或者 `sudo`，这些都需要比较麻烦的配置，而且在 TTY 缺失的环境下经常出错，建议使用 `gosu`

    ```
    # 建立 redis 用户，并使用 gosu 换另一个用户执行命令
    RUN groupadd -r redis && useradd -r -g redis redis
    # 下载 gosu
    RUN wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/1.7/gosu-amd64" \
        && chmod +x /usr/local/bin/gosu \
        && gosu nobody true
    # 设置 CMD，并以另外的用户执行
    CMD [ "exec", "gosu", "redis", "redis-server" ]
    ```

### `HEALTHCHECK` 健康检查
- 格式
    1. `HEALTHCHECK [选项] CMD <命令>`：设置检查容器健康状况的命令
    2. `HEALTHCHECK NONE`：如果基础镜像有健康检查指令，使用这行可以屏蔽掉其健康检查指令
- `HEALTHCHECK` 指令是指示 Docker 应该如何进行判断容器的状态是否正常
- 当在一个镜像指定了 `HEALTHCHECK` 指令后，用其启动容器，初始状态会为 `starting`，在 `HEALTHCHECK` 指令检查成功后变为 `healthy`，如果连续一定次数失败，则会变为 `unhealthy`
- `HEALTHCHECK` 支持下列选项：
    - `--interval=<间隔>`：两次健康检查的间隔，默认为 30 秒
    - `--timeout=<时长>`：健康检查命令运行超时时间，如果超过这个时间，本次健康检查就被视为失败，默认 30 秒
    - `--retries=<次数>`：当连续失败指定次数后，则将容器状态视为 `unhealthy`，默认 3 次
- 和 `CMD`，`ENTRYPOINT` 一样，`HEALTHCHECK` **只可以出现一次**，如果写了多个，只有最后一个生效
- 在 `HEALTHCHECK [选项] CMD` 后面的命令，格式和 `ENTRYPOINT` 一样，分为 `shell` 格式，和 `exec` 格式。命令的返回值决定了该次健康检查的成功与否：`0`：成功；`1`：失败；`2`：保留，不要使用这个值
- 为了帮助排障，健康检查命令的输出（包括 `stdout` 以及 `stderr`）都会被存储于健康状态里，可以用 `docker inspect` 来查看
### `ONBUILD` 
- 格式 `ONBUILD <其它指令>`
- `ONBUILD` 是一个特殊的指令，它后面跟的是其它指令，比如 `RUN`, `COPY` 等，而这些指令，在当前镜像构建时并不会被执行，只有当以当前镜像为基础镜像，去构建下一级镜像的时候才会被执行
    - Dockerfile 中的其它指令都是为了定制当前镜像而准备的，唯有 `ONBUILD` 是为了帮助别人定制自己而准备的
## Dockerfile 多阶段构建
## 镜像实现原理
- 每个镜像都由很多层次构成，Docker 使用 Union FS 将这些不同的层结合到一个镜像中去。
- 通常 Union FS 有两个用途，一方面可以实现不借助 LVM、RAID 将多个 disk 挂到同一个目录下，另一个更常用的就是将一个只读的分支和一个可写的分支联合在一起，Live CD 正是基于此方法可以允许在镜像不变的基础上允许用户在其上进行一些写操作
# 操作容器
- 容器是独立运行的一个或一组应用，以及它们的运行态环境
## 启动
- 启动容器两种方式，一种是基于镜像新建一个容器并启动，另外一个是将在终止状态（stopped）的容器重新启动
    - 由于 Docker 的容器极其轻量级，很多时候用户都是随时删除和新创建容器
- `docker run ubuntu:14.04 /bin/echo 'Hello world'`
    - 输出 `Hello world` 后退出容器
- `docker run -t -i ubuntu:14.04 /bin/bash` 
    - 启动一个 bash 终端，允许用户进行交互
    - `-t` 选项让 Docker 分配一个伪终端（pseudo-tty）并绑定到容器的标准输入上
    - `-i` 则让容器的标准输入保持打开
- 利用 `docker run` 来创建容器时，Docker 在后台运行的标准操作包括：
    - 检查本地是否存在指定的镜像，不存在就从公有仓库下载
    - 利用镜像创建并启动一个容器
    - 分配一个文件系统，并在只读的镜像层外面挂载一层可读写层
    - 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中去
    - 从地址池配置一个 ip 地址给容器
    - 执行用户指定的应用程序
    - 执行完毕后容器被终止
- [ ] 可以利用 `docker container start containerID` 命令，直接将一个已经终止的容器启动运行
- 容器的核心为所执行的应用程序，所需要的资源都是应用程序运行所必需的，除此之外，并没有其它的资源
    - 可以在伪终端中利用 `ps` 或 `top` 来查看进程信息
## 守护态运行
- 需要让 Docker 在后台运行而不是直接把执行命令的结果输出在当前宿主机下可以通过添加 `-d` 参数来实现
- 执行 `docker run ubuntu:17.10 /bin/sh -c "while true; do echo hello world; sleep 1; done"` 命令后容器会把输出结果（STDOUT）打印到宿主机上
- 加上 `-d` 参数运行容器容器就不会把输出结果（STDOUT）打印到宿主机上
    - 输出结果可用 `docker logs containerID` 查看
- 容器是否会长久运行，是和 `docker run` 指定的命令有关，和 `-d` 参数无关
- 使用 `-d` 参数启动后会返回一个唯一的 id，也可以通过 `docker container ls` 命令来查看容器信息
- 可以通过 `docker container logs [container ID or NAMES]` 获取容器的输出信息
## 终止
- 可以使用 `docker container stop` 来终止一个运行中的容器
- 当 Docker 容器中指定的应用终结时，容器也自动终止
    - 如 `exit` 或 `Ctrl + d`
- 终止状态的容器可以用 `docker container ls -a` 命令看到
- 处于终止状态的容器可以通过 `docker container start` 命令来重新启动
- `docker container restart` 命令会将一个运行态的容器终止，然后再重新启动它
## 进入容器
- 使用 `-d` 参数时，容器启动后会进入后台
- 某些时候需要进入容器进行操作
- `attach` 命令

    ```
    $ docker run -dit ubuntu
    217ca11fb6c16c1c750e01cf5bf58cff82f207c3d065ee037866ee498b5bc867
    $ docker container ls
    CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
    217ca11fb6c1        ubuntu              "/bin/bash"         11 seconds ago      Up 7 seconds                            mystifying_brahmagupta
    $ docker attach 217ca
    root@217ca11fb6c1:/#
    ```

    - 从此 stdin 中 `exit` 会导致容器终止
- `exec` 命令

    ```
    $ docker run -dit ubuntu
    ad8dd71bbec7e69c17134a943bcfcf449c2537916c9a7528e8879798ac17831f
    $ docker exec -i ad8dd bash
    exit
    $ docker container ls
    CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
    ad8dd71bbec7        ubuntu              "/bin/bash"         50 seconds ago      Up 46 seconds                           romantic_jang
    $ docker exec -it ad8dd bash
    root@ad8dd71bbec7:/# ls
    ```

    - 从此 stdin 中 `exit` 不会导致容器终止
    - 只用 `-i` 参数时，由于没有分配伪终端，界面没有 Linux 命令提示符，但命令执行结果仍然可以返回
## 导出和导入容器
- 可以使用 `docker export` 命令导出本地容器

    ```
    $ docker container ls -a
    CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                    PORTS               NAMES
    7691a814370e        ubuntu:14.04        "/bin/bash"         36 hours ago        Exited (0) 21 hours ago                       test
    $ docker export 7691a814370e > ubuntu.tar
    ```

    - 导出路径是当前 bash 所在的目录
- 使用 `docker import` 从容器快照文件中再导入为镜像

        ```
        $ cat ubuntu.tar | docker import - test/ubuntu:v1.0
        sha256:a31a4eeaf7c3f33f07e458eef4750c4123a1ead889b2e08fb02191a4b98cdd3d
        $ docker image ls
        REPOSITORY             TAG                 IMAGE ID            CREATED              SIZE
        test/ubuntu            v1.0                a31a4eeaf7c3        About a minute ago   69.8MB
        ```

- 也可以通过制定 URL 或目录来导入

    ```
    $ docker import http://example.com/exampleimage.tgz example/imagerepo
    ```

- 用户可以使用 `docker load` 来导入镜像存储文件到本地镜像库，也可以使用 `docker import` 来导入一个容器快照到本地镜像库
    - 两者的区别在于容器快照文件将丢弃所有的历史记录和元数据信息（即仅保存容器当时的快照状态），而镜像存储文件将保存完整记录，体积也要大
    - 从容器快照文件导入时可以重新指定标签等元数据信息
## 删除容器
- 可以使用 `docker container rm` 来删除一个处于终止状态的容器
    - 要删除一个运行中的容器，可以添加 `-f` 参数，Docker 会发送 `SIGKILL` 信号给容器
- `docker container prune` 可以清理所有处于终止状态的容器
# 访问仓库
- 注册服务器（Registry）是管理仓库的具体服务器，每个服务器上可以有多个仓库，而每个仓库下面有多个镜像
- 仓库可以被认为是一个具体的项目或目录
    - 如对于仓库地址 `dl.dockerpool.com/ubuntu` 来说，`dl.dockerpool.com` 是注册服务器地址，ubuntu 是仓库名
## 私有仓库
- 官方工具 `docker-registry` 可以用于构建私有的镜像仓库

    ```
    $ docker run -d -p 5000:5000 --restart=always --name registry registry

    docker run -d \
    -p 5000:5000 \
    -v /opt/data/registry:/var/lib/registry \
    registry
    ```

    - 使用官方的 registry 镜像来启动私有仓库；默认情况下，仓库会被创建在容器的 `/var/lib/registry` 目录下，你可以通过 `-v` 参数来将镜像文件存放在本地的指定路径
- 创建好私有仓库之后，使用 `docker tag` 来标记一个镜像，然后推送它到仓库

    ```
    docker tag ubuntu:latest 127.0.0.1:5000/ubuntu:latest
    ```

    - `docker tag IMAGE[:TAG] [REGISTRY_HOST[:REGISTRY_PORT]/]REPOSITORY[:TAG]`

- `docker push 127.0.0.1:5000/ubuntu:latest` 上传标记的镜像
- `$ curl 127.0.0.1:5000/v2/_catalog` 查看镜像
    - 看到 `{"repositories":["ubuntu"]}` 表明镜像已经被成功上传
- 删除已有镜像再尝试从私有仓库中下载这个镜像

    ```
    docker image rm 127.0.0.1:5000/ubuntu:latest
    docker pull 127.0.0.1:5000/ubuntu:latest
    ```

- 若不想使用 `127.0.0.1:5000` 作为仓库地址，比如想让本网段的其他主机也能把镜像推送到私有仓库，就得把例如 `192.168.199.100:5000` 这样的内网地址作为私有仓库地址，这时会发现无法成功推送镜像。这是因为 Docker 默认不允许非 HTTPS 方式推送镜像。可以通过 Docker 的配置选项来取消这个限制，或者配置能够通过 HTTPS 访问的私有仓库
## [ ] 私有仓库高级配置
# 数据管理
## 数据卷（volumes）
- 数据卷是一个可供一个或多个容器使用的特殊目录，它绕过
    - 数据卷可以在容器之间共享和重用
    - 对数据卷的修改会立马生效
    - 对数据卷的更新，不会影响镜像
    - 数据卷默认会一直存在，即使容器被删除
- 数据卷的使用，类似于 Linux 下对目录或文件进行 `mount`，镜像中的被指定为挂载点的目录中的文件会隐藏掉，能显示的是挂载的数据卷
- 使用 `--mount` 参数
- `docker volume create my-vol` 创建数据卷
- `docker volume ls` 查看所有数据卷
- 主机里使用 `docker volume inspect volumeName` 查看指定数据卷
- 在用 `docker run` 命令时使用 `--mount` 标记来将数据卷挂载到容器里
    - 一次 `docker run` 中可以挂载多个数据卷
- 创建一个名为 web 的容器，并加载一个数据卷 到容器的 `/webapp` 目录

    ```
    docker run -d -P \
        --name web \
        # -v my-vol:/wepapp \
        --mount source=my-vol,target=/webapp \
        training/webapp \
        python app.py
    ```

    - `docker inspect web` 查看 `web` 容器信息
    - 数据卷信息在 `"Mounts"` 键下
- `docker volume rm volumeName` 删除数据卷
- 若需要在删除容器的同时移除数据卷，可以在删除容器的时候使用 `docker rm -v `这个命令
- 无主的数据卷可能会占据很多空间，使用 `docker volume prune` 清理
## 挂载主机目录（Bind mounts）
- 使用 `--mount` 参数
- `--mount` 标记可以指定挂载一个本地主机的目录到容器中去

    ```
    docker run -d -P \
        --name web \
        # -v /src/webapp:/opt/webapp \
        --mount type=bind,source=/src/webapp,target=/opt/webapp \
        training/webapp \
        python app.py
    ```

    - 加载主机的 `/src/webapp` 目录到容器的 `/opt/webapp` 目录
    - 本地目录的路径必须是绝对路径
    - 以前使用 `-v` 参数时如果本地目录不存在 Docker 会自动为你创建一个文件夹
    - 现在使用 `--mount` 参数时如果本地目录不存在，Docker 会报错
- Docker 挂载主机目录的默认权限是读写，用户也可以通过增加 `readonly` 指定为 只读

    ```
    docker run -d -P \
        --name web \
        --mount type=bind,source=/src/webapp,target=/opt/webapp,readonly \
        training/webapp \
        python app.py
    ```

    - 在容器内 `/opt/webapp` 目录新建文件会报错
- [ ] 这个写法才能让容器运行在后台， 其它的都运行完退出了（不加挂载的参数就可以保持在运行状态）

    ```
    docker run -d -P \
        --name web \
        -v type=bind,source=/src/webapp,target=/opt/webapp \
        training/webapp \
        python app.py
    ```

- `docker inspect web` 查看 `web` 容器信息
- `--mount` 标记也可以从主机挂载单个文件到容器中

    ```
    docker run --rm -it \
    # -v $HOME/.bash_history:/root/.bash_history \
    --mount type=bind,source=$HOME/.bash_history,target=/root/.bash_history \
    ubuntu:17.10 \
    bash

    root@2affd44b4667:/# history
    1  ls
    2  diskutil list   
    ```

    - 可以记录在容器输入过的命令
# 使用网络
## 外部访问容器
- 容器中可以运行一些网络应用，要让外部也可以访问这些应用，可以通过 `-P` 或 `-p` 参数来指定端口映射
    - 使用 `-P` 标记时，Docker 会随机映射一个 49000~49900 的主机端口到内部容器开放的网络端口
- 使用 `docker container ls` 查看

    ```
    docker run -d -P training/webapp python app.py
    3ed47cd7202b8d6d0dadb535352a62f1926b0bca371dde7c2c236d0fbb06dbf9

    docker container ls -l
    CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                     NAMES
    3ed47cd7202b        training/webapp     "python app.py"     13 seconds ago      Up 8 seconds        0.0.0.0:32778->5000/tcp   xenodochial_spence

    docker logs xenodochial_spence     # 查看应用信息
    
    docker port xenodochial_spence
    5000/tcp -> 0.0.0.0:32778
    ```

    - 本地主机的 32778 被映射到了容器的 5000 端口
    - 此时访问本机的 32778 端口即可访问容器内 web 应用提供的界面
    - 使用 `docker port` 来查看当前映射的端口配置，也可以查看到绑定的地址
- `-p` 可以指定要映射的端口，且在一个指定端口上只可以绑定一个容器
    - 支持的格式有 `ip:hostPort:containerPort | ip::containerPort | hostPort:containerPort`
- `-p` 标记可以多次使用来绑定多个端口

    ```
    docker run -d \
        -p 5000:5000 \
        -p 3000:80 \
        training/webapp \
        python app.py
    ```

- 使用 `hostPort:containerPort` 格式将本地的 5000 端口映射到容器的 5000 端口
    - `docker run -d -p 5000:5000 training/webapp python app.py`
- 使用 `ip::containerPort` 绑定 localhost 的任意端口到容器的 5000 端口，本地主机会自动分配一个端口
    - `docker run -d -p 127.0.0.1::5000 training/webapp python app.py`
- 可以使用 `udp` 标记来指定 `udp` 端口
    - `docker run -d -p 127.0.0.1:5000:5000/udp training/webapp python app.py`
- 容器有自己的内部网络和 ip 地址（使用 `docker inspect` 可以获取所有的变量；Docker 还可以有一个可变的网络配置）
## 容器互联
- 使用自定义的 Docker 网络而不是 `--link` 参数
- 创建一个新的 Docker 网络

    ```
    docker network create -d bridge my-net
    ```

    - `-d` 参数指定 Docker 网络类型，有 `bridge`，`overlay`

- 运行多个容器（须在不同终端）并连接到 `my-net` 网络

    ```
    docker run -it --rm --name busybox1 --network my-net busybox sh
    docker run -it --rm --name busybox2 --network my-net busybox sh
    ```

    - 从 `busybox1` ping `busybox2`：`ping busybox2`
- 有多个容器之间需要互相连接推荐使用 Docker Compose
## 配置 DNS
- Docker 利用虚拟文件来挂载容器的 3 个 和主机名、DNS 相关的配置文件
- 容器中使用 `mount` 可以看到挂载信息，这种机制可以让宿主主机 DNS 信息发生更新后，所有 Docker 容器的 DNS 配置通过 `/etc/resolv.conf` 文件立刻得到更新
- 配置全部容器的 DNS ，也可以在 `/etc/docker/daemon.json` 文件中增加以下内容来设置

    ```
    {
        "dns" : [
            "114.114.114.114",
            "8.8.8.8"
        ]
    }
    ```

    - 每次启动的容器 DNS 自动配置为 `114.114.114.114` 和 `8.8.8.8`
    - 使用 `docker run -it --rm ubuntu:17.10  cat etc/resolv.conf` 验证生效
    - [ ] 未生效
- 若需手动指定容器的配置可在使用 `docker run` 命令启动容器时加入参数

    - `-h HOSTNAME` 或者 `--hostname=HOSTNAME` 设定容器的主机名，它会被写到容器内的 `/etc/hostname` 和 `/etc/hosts`，但它在容器外部看不到，既不会在 `docker container ls` 中显示，也不会在其他的容器的 `/etc/hosts` 看到
    - `--dns=IP_ADDRESS` 添加 DNS 服务器到容器的 `/etc/resolv.conf` 中，让容器用这个服务器来解析所有不在 `/etc/hosts` 中的主机名
    - `--dns-search=DOMAIN` 设定容器的搜索域，当设定搜索域为 `.example.com` 时，在搜索一个名为 host 的主机时，DNS 不仅搜索 host，还会搜索 `host.example.com`
    - > 容器启动时若没有指定最后两个参数，Docker 会默认用主机上的 `/etc/resolv.conf` 来配置容器
# Docker Compose
- Docker Compose 是 Docker 官方编排（Orchestration）项目之一，负责快速的部署分布式应用
- Defining and running multi-container Docker applications
- Compose 允许用户通过一个单独的 `docker-compose.yml` 模板文件（YAML 格式）来定义一组相关联的应用容器为一个项目（project）
- 概念
    - 服务 (service)：一个应用的容器，实际上可以包括若干运行相同镜像的容器实例
    - 项目 (project)：由一组关联的应用容器组成的一个完整业务单元，在 `docker-compose.yml` 文件中定义
- Compose 的默认管理对象是项目，通过子命令对项目中的一组容器进行便捷地生命周期管理
- Compose 项目由 Python 编写，实现上调用了 Docker 服务提供的 API 来对容器进行管理，因此，只要所操作的平台支持 Docker API，就可以在其上利用 Compose 来进行编排管理
## 使用
- [ ] 没跑起来
## 命令说明
- Compose 的大部分命令的对象既可以是项目本身，也可以指定为项目中的服务或者容器
    - 如果没有特别的说明，命令对象将是项目，这意味着项目中所有的服务都会受到命令影响
- `docker-compose [-f=<arg>...] [options] [COMMAND] [ARGS...]`
- > [命令](https://github.com/yeasy/docker_practice/blob/master/compose/commands.md)
# Docker machine
- Docker Machine 是 Docker 官方编排（Orchestration）项目之一，负责在多种平台上快速安装 Docker 环境
- Docker Machine 项目基于 Go 语言实现
## 使用
- Docker Machine 支持多种后端驱动，包括虚拟机、本地主机和云平台
- Virtualbox 驱动
    - 使用 virtualbox 类型的驱动，创建一台 Docker 主机，命名为 test 
    - `docker-machine create -d virtualbox test`
        - `--engine-opt dns=114.114.114.114` 配置 Docker 的默认 DNS
        - `--engine-registry-mirror https://registry.docker-cn.com` 配置 Docker 的仓库镜像
        - `--virtualbox-memory 2048` 配置主机内存
        - `--virtualbox-cpu-count 2` 配置主机 CPU
        - `docker-machine create --driver virtualbox --help` 查看更多命令
- xhyve 驱动
    - xhyve 是 macOS 上轻量化的虚拟引擎，使用其创建的 Docker Machine 较 VirtualBox 驱动创建的运行效率要高
- `docker-machine ls` 查看主机
- 创建主机成功后，通过 `env` 命令来让后续操作对象都是目标主机
    - `docker-machine env test`
- 通过 SSH 登录到主机
    - `docker-machine ssh test`
# Swarm mode
- Docker 的主机可以主动初始化一个 Swarm 集群或者加入一个已存在的 Swarm 集群，这样这个运行 Docker 的主机就成为一个 Swarm 集群的节点 (node)
- 节点分为管理 (manager) 节点和工作 (worker) 节点
- 管理节点用于 Swarm 集群的管理，`docker swarm` 命令基本只能在管理节点执行（节点退出集群命令 `docker swarm leave` 可以在工作节点执行）
- 一个 Swarm 集群可以有多个管理节点，但只有一个管理节点可以成为 leader，leader 通过 raft 协议实现
- 工作节点是任务执行节点，管理节点将服务 (service) 下发至工作节点执行
- 管理节点默认也作为工作节点，可以通过配置让服务只运行在管理节点
- 任务 （Task）是 Swarm 中的最小的调度单位，目前来说就是一个单一的容器
- 服务 （Services） 是指一组任务的集合，服务定义了任务的属性
- 服务有两种模式：
    - replicated services 按照一定规则在各个工作节点上运行指定个数的任务
    - global services 每个工作节点上运行一个任务
- 两种模式通过 `docker service create` 的 `--mode` 参数指定
## 创建集群



