# Set up
- Git repo
  - https://github.com/bretfisher/udemy-docker-mastery
- Bash completion

    ```bash
    # execute in terminal
    etc=/Applications/Docker.app/Contents/Resources/etc
    ln -s $etc/docker.zsh-completion /usr/local/share/zsh/site-functions/_docker
    ln -s $etc/docker-machine.zsh-completion /usr/local/share/zsh/site-functions/_docker-machine
    ln -s $etc/docker-compose.zsh-completion /usr/local/share/zsh/site-functions/_docker-compose
    ```

    > - https://docs.docker.com/docker-for-mac/#install-shell-completion
- iTerm2 setup
  - http://www.bretfisher.com/shell
  - https://github.com/morhetz/gruvbox-contrib/tree/master/iterm2
- 镜像加速
  - https://www.docker-cn.com/registry-mirror 
  - https://www.daocloud.io/mirror
# Containers
- Commands
  - New management commands format: `docker <command> <sub-command> (options)`
  - Old way (still works): `docker <command> (options)`
- Info
  - `docker version`
  - `docker info`
  - `docker`
- Image is the binaries, libraries, source code that make up the application
- Container is an running instance of that image, running as a process
  - Can have many containers based on the same image
- `docker container run --publish 80:80 --detach --name webhost nginx` 
  1. Looks for nginx image locally in image cache, if doesn't find anything, then looks in remote repository (defaults to Docker Hub), and downloads the latest version (nginx:latest by default)
  2. Starts a new container base on the image (start a new layer of changes on top of that image), gives it a virtual IP on a private network inside docker engine
  3. Open port `80` on the host (visit on `localhost`) and forward that traffic to the container IP, port `80`
  4. Starts container by using the CMD in the image Dockerfile
  - `detach` tells docker to run it in the background
    - Container name is also required to be unique. It'll be created for us if we didn't specify it
  - **`docker container --help`**
    - `docker container ls`, `docker ps`, (old command) `docker container ls -a`
    - `docker container logs webhost`
    - `docker container top webhost` displays the running processes of a container
    - `docker container stop containerID`
    - `docker container rm containerID1 containerID2`, `docker container rm -f containerID1 containerID2`
  - `docker run --help`
    - `-d`, `--detach`: runs container in background and print container ID
  - > https://docs.docker.com/
  -  `docker container run --publish 8080:80 --detach --name webhost nginx:1.11 nginx -T`
     - `8080` changes host listening port
       - Publishing ports is always in HOST:CONTAINER format
     - `:1.11` changes version of image
     - `nginx -T` **changes CMD run on start**
- `docker run --name mongo -d mongo`
  - `docker top mongo`; `ps aux` shows all running processes. On linux we can see clearly the container is just a process on the host, not hiding inside a virtual machine that we cannot get access to
  - `ps aux | grep mongo`
- <u>Assignment: manage multiple containers</u>

    ```bash
    docker run --publish 80:80 --name myNginx --detach nginx
    curl localhost

    docker run --publish 8080:80 --name myHttpd --detach httpd
    curl localhost:8080

    # --env
    docker run -p 3306:3306 --name myMysql -e MYSQL_RANDOM_ROOT_PASSWORD=yes -d mysql
    docker
    docker container logs myMysql
    # GENERATED ROOT PASSWORD: joo7ohChooghaip7UGho5EawaiDi4cai
    ```

- Monitoring container
  - `docker top CONTAINER`: displays the running processes that is the container
  - `docker inspect CONTAINER`: returns low-level information on Docker objects (old way)
  - `docker container stats CONTAINER`: displays a live stream of container(s) resource usage statistics
- Get into containers
  1. `docker container run -it --name proxy nginx bash`
       - Starts a **new container** interactively
       - `-t` allocates a pseudo-TTY, simulates a real terminal, like what SSH does; `-i` keeps STDIN open even if not attached, keeps session open to receive terminal input; runs with `-it` gives you a terminal inside the running container
       - The last command `bash` changes the default program from nginx itself to bash shell. When we exit from the shell, the container stopped. ***Containers only run as long as the command that it ran on startup runs***
         - Bash is one of the common shells in a container

        ```bash
        docker container run -it --name sb_ubuntu ubuntu
        apt-get update
        apt-get install -y curl
        curl baidu.com
        # re-run the existing container
        docker container start -ai sb_ubuntu
        ```

  2. `docker container exec -it sb_mysql bash`: run a command (or program, `bash` here) inside a running **existing** container
     - The sb_mysql container keeps running when we exited this bash shell. `docker container exec` runs **an additional process on an existing running container** and won't affect the root process for the (MySQL) daemon
  3. `docker container run -it alpine sh` (alpine image doesn't bash pre-installed)
     - Use `apk` (the alpine package management) to install bash
- Docker network
  - Defaults
    - Each container connects to a private virtual network (by default it's the **bridge** network)

        ```bash
        docker network ls 
        # bridge
        docker network inspect bridge
        # "Containers": {}

        # host
        # none - removes eth0 and onl leaves you with localhost interface in container
        ```

    - Each virtual network routes through NAT firewall on host IP
      - NAT firewall is the docker daemon configuring the host IP address on its default interface so that containers can get out to the internet or to the rest of the network and then get back
  - Customize
    - "Batteries included, but removable; easy to customize
    - Creating multiple virtual networks
    - Attach containers to more than one virtual network or none
    - Skip virtual networks and use host IP (`--net=host`)
    - Use different Docker network drivers to gain new abilities


    ```bash
    docker container run -p 80:80 --name webhost -d nginx
    docker container port webhost
    # 80/tcp -> 0.0.0.0:80
    docker container inspect --format '{{ .NetworkSettings.IPAddress }}' webhost
    # 172.17.0.3
    ifconfig en0
    # inet 192.168.50.79 netmask 0xffffff00 broadcast 192.168.50.255
    ```


    ```bash
    docker network create my_app_net
    # default driver is bridge, use --drive to customize
    docker container run -d --name new_nginx --network my_app_net nginx
    docker network inspect my_app_net

    # connect existing container to another network
    docker network connect my_app_net webhost
    docker container inspect webhost
    # two networks
    
    docker network disconnect my_app_net webhost
    ```

  - Default security
    - If you create apps whose frontend/backend sit on the same Docker network, their inter-communication never leaves host. All externally exposed ports closed by default. You must manually expose via `-p`. Get even better with Swarm and Overlay networks
    - 同一虚拟网络间的容器无需通过 `-p` 暴露端口即可相互通信（Docker 会自动暴露同一虚拟网络内的端口）；`-p` 用于虚拟网络与 host 之间的网络通信；不同虚拟网络可以通过 host 相互通信；默认虚拟网络是 bridge/docker0
  - DNS
      - Containers are constantly launching, disappearing, moving, expanding, shrinking, micro-services, static IP and using IP for communicating between containers of the same network is an anti-pattern
      - For the new (custom) network (not the default one), Docker uses the **container name** as the equivalent of the host name (**automatic DNS resolution**) for containers to talk to each other

        ```bash
        docker container run -d --name nginx1 --network my_app_net nginx
        docker container run -d --name nginx2 --network my_app_net nginx
        docker network inspect my_app_net

        # https://stackoverflow.com/a/39901446/6902525
        docker container exec -it nginx2 bash
        apt-get update
        apt-get install iputils-ping

        docker container exec -it nginx2 ping nginx1
        ```

    - For the default network named bridge, use `docker container create` and `--link` option

- <u>Assignment: CLI app testing</u>

    ```bash
    # --rm: automatically remove the container when it exits
    docker container run --rm -it centos:7 bash
    yum update curl
    curl --version

    docker container run --rm -it ubuntu:14.04 bash
    apt-get update && apt-get install -y curl
    curl --version
    ```

- <u>Assignment: DNS round robin test</u>

    ```bash
    # different hosts with DNS alias respond to the same DNS name
    # multiple containers on a created network can respond to the same DNS address
    # --net-alias adds network-scoped alias for the container to be identified when communicating
    # elasticsearch runs on port 9200

    docker network create new-network
    # create two elasticsearch containers
    docker container run -d --network new-network --network-alias=search elasticsearch:2
    docker container run -d --network new-network --network-alias=search elasticsearch:2

    docker container run --rm --net new-network alpine nslookup search
    # run multiple times
    # result json will have two ”name" value
    docker container run --rm --net new-network centos curl -s search:9200
    ```

# Images
- Image
  - **App binaries and dependencies; metadata about the image data and how to run the image**
    - Images are made up of file system changes and metadata
    - > Official definition: An image is an ordered collection of root filesystem changes and the corresponding execution parameters for use within a container runtime
  - Not a complete OS; no kernel or kernel modules (e.g. drivers)
- A version of an image can have more than one tag
    - `latest` tag doesn't necessarily guaranteed it's always the latest **commit**
    - Image ID 相同 tag 不同，其实只有一个 image
    - https://hub.docker.com/

    ```bash
    docker pull nginx
    ```

- Image layers
  - Images are designed using the *union file system* concept of **making layers about the changes**
  - 每层通过唯一的 SHA 来确保 host 上只保存一份
  - Running a container of an image is just creating a new **read/write** layer on top of that image
  - 同一个 image 的多个 container，若有一个 container 要修改 image 里的文件 (copy on write)，会将该文件从 image 拷贝到要修改的 container 的 layer 中，

    ```bash
    docker image ls
    docker image history nginx:latest
    # IMAGE <missing> 表示该层不是单独的 image

    # metadata of the image
    docker image inspect nginx 
    # "ExposedPorts" 可以知道要和 host 通信要暴露什么端口 -p
    # ”Cmd" - command run when the image is started by default
    ```

- Tagging
  - Official repositories live at the root namespace of the registry, so they don't need account name and `/` in front of repo name
  - The tag is not quite a version and it's not quite a branch, but it's a little bit of both (a lot like git tags)
    - Just **a pointer to a specific image commit**
    - Tags are just labels that point to an actual image ID. We can have many tags pointing to the same image ID
    - Create the repository first before you upload if you want to make the repository private

    ```bash
    # re-tag existing docker image 
    docker image tag nginx slackbuffer/nginx
    # it'll always default to "latest" if the tag is not specified. Thus "latest" may not mean anything special, just a tag

    docker login
    docker image push slackbuffer/nginx
    docker image tag slackbuffer/nginx slackbuffer/nginx:testing
    docker image push slackbuffer/nginx:testing
    docker logout
    ```

- Dockerfile
  - The default name is `Dockerfile`. Use `-f` (`docker build -f some-dockerfile`) to specify a different file than the default from command line
  - Each line of commands of Dockerfile is **an actual layer**, so **order matters**
  - Commands
    - `FROM`: Required. Usually a minimal distribution
      - `Alpine` is small
      - Package management like `apt` and `yum` are one of the reasons to build containers FROM Debian, Ubuntu, Fedora or CentOS
    - `ENV`: One reason they were chosen as preferred way to **inject key/value** is they work everywhere, on every OS and config
    - `RUN`：Executing shell commands
      - `&&` ensures all of the commands are **fit into one single layer**. Saves time and space
      - > The proper way to do logging inside a container is to not log to a log file. There's no syslog service inside a container. Docker handles all of the logging. All we have to do inside the container is to make sure that everything we want to be captured in the logs is spit to stdout and stderr and Docker will handle the rest. There's logging drivers that we can use in the Docker engine to control all the logs for all the containers on the host. It adds more complexity to the app if it does the logging itself (you'll have to deal with files in every container, and got yourself a problem of how to get files out, searchable, accessible)
    - `EXPOSE`
      - Expose ports from the container to a virtual network
    - `CMD`: Required
      - The final command that will be run every time a container is launched from the image
    - `WORKDIR`: Change directory (`cd`)
    - `COPY`: Copy files from host machine to container

        ```bash
        WORKDIR /usr/share/nginx/html
        COPY index.html index.html
        # copy index.html from current directory of host machine to the WORKDIR inside container
        ````

- Building images
    - Each step will be kept as build cache identified with hash. Makes rebuild faster
    - When we use the `FROM`, we inherit everything (except `   ENV`) from the Dockerfile of the upstream image

    ```bash
    # . means build Dockerfile in this directory
    docker image build -t custom-nginx .
    ```

- <u>Assignment: Build your own image</u>

    ```dockerfile
    FROM node:6.16.0-alpine
    RUN apk add --update tini \
        && mkdir -p /usr/src/app
    WORKDIR /usr/src/app
    # COPY * ./ # won't work
    COPY . .
    RUN npm install \
        && npm cache clean --force
    EXPOSE 3000 # nodejs app 的后端端口
    # [ ] CMD /sbin/tini -- node ./bin/www # wrong
    CMD ["tini", "--", "node", "./bin/www"]

    # https://github.com/BretFisher/node-docker-good-defaults
    ```

    ```bash
    docker image build -t node_service .
    docker container run --rm -p 1123:3000 node_service
    curl http://localhost:1123
    docker tag node_service slackbuffer/test-node
    docker login
    docker image push slackbuffer/test-node
    docker image rm slackbuffer/test-node node_service
    docker logout
    docker container run --rm -p 1123:3000 slackbuffer/test-node
    ```

# Container lifetime & persistent data
- Containers are usually immutable and ephemeral
- Immutable infrastructure: only re-deploy containers, never change
- Changes in containers were kept across restarts and reboots until the container is removed
- Two methods
    1. Data volumes
        - A configuration option for a container that creates a special location **outside that container's union file system** (on host) to store unique data. This preserves it across container removals and allows us to attach it to whatever container we want. The container just sees it like a local file path
        - `VOLUME`: Directory in the container. Files inside that directory will outlive the container until we **manually delete the volume**

            ```bash
            # Remove all unused local volumes
            docker volume prune
            docker pull mysql
            docker image inspect mysql # config - volumes

            docker container run -d --name sb-mysql -e MYSQL_ALLOW_EMPTY_PASSWORD=True mysql
            docker container inspect sb-mysql # Mounts - Source: host, where data actually lives; Destination: container
            docker volume ls # 69d306d78021ccd9aaaa9522070d92b824f5213f8c732fa7e068e093f7d28141
            docker inspect 69d306d78021ccd9aaaa9522070d92b824f5213f8c732fa7e068e093f7d28141

            # name volume
            docker container run -d --name sb-mysql -e MYSQL_ALLOW_EMPTY_PASSWORD=True -v sb-mysql-db:/var/lib/mysql mysql
            docker volume ls
            docker volume inspect sb-mysql-db
            ```

            - Use `docker volume create` to create Docker volume ahead of time (to specify different driver, etc.)

    2. Bind mounts
       - Maps a host file or directory to a container file or directory
       - Basically just two locations pointing to the same physical location on disk
       - Cannot use in Dockerfile, must be at `container run`
       - `-v absolute-path-on-host:absolute-path-in-container`