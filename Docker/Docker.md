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
         - 操作容器内的目录时实际操作的是 host 映射进容器的目录

        ```bash
        docker container run -d --name sb-nginx -p 1357:80 -v $(pwd):/usr/share/nginx/html nginx
        curl http://localhost:1357
        # host
        touch a.txt
        echo "looking for me?" > a.txt
        curl http://localhost:1357/a.txt
        ```

- <u>Assignment: named volume</u>

    ```bash
    docker container run -d --name sb-psql -v psql-data:/var/lib/postgresql/data postgres:9.6.1
    # -f: Follow log output
    docker container logs -f sb-psql
    docker volume ls
    docker volume inspect psql-data

    docker container run -d --name sb-psql-2 -v psql-data:/var/lib/postgresql/data postgres:9.6.2  
    ```

- <u>Assignment: bind mounts</u>

    ```bash
    # jekyll ssg
    # https://jekyllrb.com/
    docker run -p 1244:4000 -v $(pwd):/site bretfisher/jekyll-serve
    ```

# Docker Compose
- Configure relationships between containers
- Comprised of 2 separate but related things
    1. YAML
       - Containers, networks, volumes
    2. CLI tool `docker-compose`
- `docker-compose.yml`
  - Versioned
  - Can be used with `docker-compose` command for local docker automation
  - Can be used with `docker` directly in production with Swarm
  - `docker-compose.yml` is the default name, use `docker-compose -f custom-name.yml`

    ```yml
    version: '3.1'  # if no version is specificed then v1 is assumed. Recommend v2 minimum

    services:  # containers. same as docker run
    servicename: # a friendly name. this is also DNS name inside network
        image: # Optional if you use build:
        command: # Optional, replace the default CMD specified by the image
        environment: # Optional, same as -e in docker run
        volumes: # Optional, same as -v in docker run
    servicename2:

    volumes: # Optional, same as docker volume create

    networks: # Optional, same as docker network create

    version: '2'

    # same as
    # docker run -p 1244:4000 -v $(pwd):/site bretfisher/jekyll-serve

    services:
    jekyll:
        image: bretfisher/jekyll-serve
        volumes:
        - .:/site
        ports:
        - '1244:4000'
    ``` 

    - `-` represents list (array)
- > https://docs.docker.com/compose/compose-file/
## docker-compose CLI
- Comes with Docker for Windows/Mac; separate download for Linux
- Not a production-grade tool but ideal for local development and test

    ```bash
    docker-compose up # setup volumes/networks and start all containers
    docker-compose down # stop all containers and remove containers/volumes/networks
    ```

- Containers in a compose file use the service name as the DNS name to communicate with each other
- <u>Assignment: writing a compose file</u>

    ```yml
    # Drupal CMS

    version: '3'

    services:
        cms-drupal:
            image: drupal
            ports:
                - 8080:80
            volumes:
                # - /Users/slackbuffer/db:/var/lib/postgresql/data # bind mounts approach
                - drupal-modules:/var/www/html/modules \
                - drupal-profiles:/var/www/html/profiles \
                - drupal-sites:/var/www/html/sites \
                - drupal-themes:/var/www/html/themes \
        db:
            image: postgres
            environment:
                POSTGRES_USER: sb # default is postgres, database name will default to POSTGRES_USER
                POSTGRES_PASSWORD: sb
    volumes:
        drupal-modules:
        drupal-profiles:
        drupal-sites:
        drupal-themes:

    # inspect container's exposed port: docker image inspect drupal - ExposedPorts
    # set up database - advanced - host: should be the db service name (db in this case)
    # docker-compose up
    # docker-compose down -v
    ```

    - Inspect container's exposed port via commands
## Add image building to compose file
- Compose can build custom images at runtime
    - Will build with `docker-compose up` if not found in cache
    - Will rebuild with `docker-compose build` or `docker-compose --build`

- <u>Assignment: build and run compose</u>

    ```
    # download the latest copy and only the specified branch; saves time
    # command here is run as root
    RUN git clone --branch 8.x-3.x --single-branch --depth 1 https://git.drupal.org/project/bootstrap.git \
        && chown -R www-data:www-data bootstrap
    ```

# Swarm
- Manager node, worker node
  - Raft consensus
  - Service, task
- `docker info` - Swarm: inactive
- `docker swarm init`
  - PIK and security automation
    - Root signing certificate created for the Swarm 
    - Certificate is issued for first Manager node
    - Join token created
  - Raft consensus database created to store root CA, configs, and secrets
    - Encrypted by default
    - No need for another key/value system to hold orchestration/secrets
    - Replicates logs amongst Managers via mutual TLS
- `docker node ls`

```bash
docker service create alpine ping 8.8.8.8
docker service ls
docker service ps brave_mclean
docker container ls

docker service update brave_mclean --replicas 3
docker service ls
docker service ps brave_mclean

docker container rm -f brave_mclean.1.xsfag5wiuusu6cghwq1gj5hg6
docker service ls # do this real quick or it will recover

docker service rm brave_mclean
docker container ls
```

- `docker-machine ssh node1`, `docker-machine env node1` + `eval $(docker-machine env node1)`
- https://labs.play-with-docker.com/

    ```bash
    # 3-node swarm cluster
    docker swarm init --advertise-addr 192.168.0.18
    docker node ls
    # add a work
    docker swarm join --token SWMTKN-1-2gni3eaxuwtsar3dhnc55dp7kveme6zcf6irfaox8i0bcoe1zl-4ap4ipg8pfky4uo46m4g5sahy 192.168.0.18:2377
    docker node ls
    docker node update --role manager node2
    # add a manager
    docker swarm join-token manager # on leader node
    # docker swarm join --token SWMTKN-1-2gni3eaxuwtsar3dhnc55dp7kveme6zcf6irfaox8i0bcoe1zl-cmkagrhv4ufc8cuzy8syku5k3 192.168.0.18:2377
    # on node3
    docker swarm join --token SWMTKN-1-2gni3eaxuwtsar3dhnc55dp7kveme6zcf6irfaox8i0bcoe1zl-cmkagrhv4ufc8cuzy8syku5k3 192.168.0.18:2377

    docker service create --replicas 3 alpine ping 8.8.8.8
    docker service ls
    docker node ps
    docker node ps node2
    docker service ps ecstatic_kalam
    ```

- Overlay network
  - Choose `--driver overlay` when creating network
  - Creates a swarm-wide bridge network, for container-to-container traffic inside a single swarm
  - Optional IPSec (AES) encryption on network creation
  - Each service can be connected to multiple networks

    ```bash
    docker network create --driver overlay mydrupal
    docker network ls

    docker service create --name sb-psql --network mydrupal -e POSTGRES_PASSWORD=sb postgres
    docker service create --name sb-drupal --network mydrupal -p 80:80 drupal
    watch docker service ls
    docker container logs sb-psql.1.s7ejcxiuuvlhpbam8voenacck

    # 会随机分布在 leader 广播 ip 出去后加入进 swarm 的节点上
    docker service ps sb-drupal # node3
    docker service ps sb-psql   # node1
    # node1 and node3 use the service name to talk to each other
    ```

- Routing mesh
    - A network routes incoming packets to target service
    - Uses IPVS from Linux kernel
    - Load balances swarm services across their tasks
    - 2 way it works
        1. Container-to-container in a overlay network (uses Virtual IP)
        2. External traffic incoming to published ports (all nodes listen)
     - Stateless load balancing; this LB is at OSI layer 3 (TCP), not layer 4 (DNS)
         1. Nginx or HAProxy LB proxy, or:
         2. Docker enterprise comes with built-int lay 4 web proxy

        ```bash
        docker service create --name sb-elasearch  --replicas 3 -p 9200:9200 elasticsearch:2
        docker service ps sb-elasearch
        curl 192.168.0.18:9200
        ```

- <u>Assignment: creating multi-service app</u>
- Stack - production grade compose
    - Stack accept compose files as declarative definition for services, networks, volumes
    - `docker stack deploy`
    - New `deploy:` key in compose file, cannot do `build:`; compose ignores `deploy:`, swarm ignores `build:`

    ```bash
    docker stack deploy -c vote.yml voteapp
    docker service ls
    docker stack ps voteapp
    docker stack services voteapp
    # update .yml and run deploy again will apply changes to the original swarm (identified by name voteapp)
    ```

- Secrets storage
    - swarm-only thing
    - Supports generic strings or binary content up to 500kb in size
    - Only stored on disk on Manager nodes
    - Docker 1.13.0 swarm raft db is encrypted on disk
    - Keys passed from manager to worker: TLS + mutual auth
    - Secrets are first stored in swarm, then assigned to services. Only containers in assigned services can see them
    - Secrets look like files but are in-memory fs (`/run/secrets/<secret_name>` or `/run/secrets/<secret_alias>` directory)
    - Local docker-compose can use file-based secrets (mounted into containers), but not secure

    ```bash
    #### secrets with services
    echo abcd > a.txt
    docker secret create psql_user a.txt # one way
    echo "dbPassword" | docker secret create psql_password - # another
    docker secret ls

    docker service create --name sb-psql --secret psql_user --secret psql_password -e POSTGRES_PASSWORD_FILE=/run/secrets/psql_password -e POSTGRES_USER_FILE=/run/secrets/psql_user postgres

    docker exec -it sb-psql.1.zjvhrsvoxft7qzsalvz9utbbo bash 
    ls /run/secrets
    cat /run/secrets/psql_password
    docker service update --secret-rm # this would re-deploy the container
    ```

    ```yml
    #### secrets with stack
    version: "3.1"

    services:
    psql:
        image: postgres
        secrets:
            - psql_user
            - psql_password
        environment:
            POSTGRES_PASSWORD_FILE: /run/secrets/psql_password
            POSTGRES_USER_FILE: /run/secrets/psql_user

    secrets:
        psql_user:
            file: ./psql_user.txt
        psql_password:
            file: ./psql_password.txt
    ```

    ```bash
    # secret with compose
    # same yml as above
    docker-compose up -d
    docker-compose exec psql cat /run/secrets/psql_user
    # bind mounts at runtime that secret file into the container
    # only work with file-base secrets, not with the external
    ```