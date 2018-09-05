# [Ubuntu 16.04 快速搭建 Fabric 1.0](http://www.cnblogs.com/studyzy/p/7437157.html)
- 安装 Go
  
    ```bash
    wget https://storage.googleapis.com/golang/go1.10.1.linux-amd64.tar.gz
    sudo tar -C /usr/local -xzf go1.10.1.linux-amd64.tar.gz     # 解压到 /usr/local

    vi ~/.profile
    export PATH=$PATH:/usr/local/go/bin                         # Add /usr/local/go/bin to the PATH environment variable
    export GOPATH=$HOME/go 
    export PATH=$PATH:$HOME/go/bin  
    source ~/.profile                                           # 让改动立刻生效
    mkdir ~/go
    ```

- 安装 Docker
    - 配置加速镜像
        - http://guide.daocloud.io/dcs/daocloud-9153151.html
    - > https://help.aliyun.com/document_detail/60742.html?spm=a2c4g.11186623.6.544.3fMVyy
    - > https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04
- 安装 Docker-Compose
    - > https://github.com/docker/compose/releases
- 下载 Fabric 源码

    ```bash
    mkdir -p ~/go/src/github.com/hyperledger
    cd ~/go/src/github.com/hyperledger
    git clone https://github.com/hyperledger/fabric.git
    cd fabric
    git checkout v1.0.0
    ```

- 下载 Fabric Docker 镜像

    ```bash
    cd examples/e2e_cli/
    source download-dockerimages.sh -c x86_64-1.0.0 -f x86_64-1.0.0     # 使用官方批量下载脚本下载 Fabric 镜像
    docker images                                                       # 查看下载的镜像
    ```

- 启动 Fabric 网络进行 Chaincode 测试

    ```bash
    # base/peer-base.yaml
    # - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=e2e_cli_default
    ./network_setup.sh up

    # channel: mychannel
    # chaincode: mycc
    docker exec -it cli bash

    # 查询 a 账户余额
    peer chaincode query -C mychannel -n mycc -c '{"Args":["query","a"]}'
    # a 账户转账 20 到 b 账户
    peer chaincode invoke -o orderer.example.com:7050  --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem  -C mychannel -n mycc -c '{"Args":["invoke","a","b","20"]}'

    ./network_setup.sh down
    ```

    - [ ] 账户 a，b 的名称在哪里定义
# [官方脚本详解](https://www.cnblogs.com/studyzy/p/7451276.html)
## 生成节点和用户的公私钥和证书
- `example/e2e_cli/base/peer-base.yaml` 
    - `CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=e2e_cli_default`
- Fabric 有两类公私钥证书
    1. TLS 证书
        - 保障节点通讯安全
    2. 用户证书
        - 用户登录和权限控制
- 证书由 CA 颁发，测试环境未启用 CA 节点，可以用 Fabric 提供的工具 cryptogen
- 编译生成 cryptogen

    ```bash
    cd ~/go/src/github.com/hyperledger/fabric
    make cryptogen
    # Binary available as build/bin/cryptogen
    ```

- 配置 crypto-config.yaml

    ```bash
    - Name: Org2 
    Domain: org2.example.com 
    Template: 
        Count: 2 
    Users: 
        Count: 1
    ```

    - Name 和 Domain 是组织的名字和域名，生成证书时会包含该信息
    - `Template: Count: 2` 表示生成 2 套公私钥和证书，一套 peer0.org2，另一套 peer1.org2
    - `Count=1` 表示每个 Template 下的普通 User 的数量
        - 此处只有一个普通用户 `User1@org2.example.com`
- 生成节点和用户的公私钥和证书

    ```bash
    # pwd: ./fabric/examples/e2e_cli
    ../../build/bin/cryptogen generate --config=./crypto-config.yaml
    tree crypto-config
    ```

## 生成创世块和 Channel 配置区块
- 编译生成 configtxgen

    ```bash
    cd ~/go/src/github.com/hyperledger/fabric
    make configtxgen
    # Binary available as build/bin/configtxgen
    ```

- 配置 examples/e2e_cli/configtx.yaml
    - 默认是 2 个 org 参与的 Channel；TwoOrgsOrdererGenesis
- 生成创世区块

    ```bash
    cd examples/e2e_cli/

    ../../build/bin/configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./channel-artifacts/genesis.block
    # examples/e2e_cli/channel-artifacts/genesis.block
    ```

- 生成 Channel 配置块

    ```bash
    ../../build/bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./channel-artifacts/channel.tx -channelID mychannel
    # 指定 channelID 为 mychannel

    # 锚节点更新
    ../../build/bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchors.tx -channelID mychannel -asOrg Org1MSP

    ../../build/bin/configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchors.tx -channelID mychannel -asOrg Org2MSP

    tree channel-artifacts
    # channel-artifacts
    # ├── Org1MSPanchors.tx
    # ├── Org2MSPanchors.tx
    # ├── channel.tx
    # └── genesis.block
    ```

## 配置 Fabric 环境的 docker-compose 文件
- 配置 Orderer
    - `base/docker-compose-base.yaml`
    - Host 到 Docker 的映射: `-../channel-artifacts/genesis.block:/var/hyperledger/orderer/orderer.genesis.block`
- 配置 Peer
    - `base/docker-compose-base.yaml`，`base/peer-base.yaml`
- 配置 CLI
    - `docker-compose-cli.yaml`
    - CLI 在 Fabric 网络中扮演客户端角色，开发测试时可用 CLI 代替 SDK，执行各种 SDK 能执行的操作
    - CLI 会和 Peer 相连，把指令发送给对应的 peer 去执行

    ```bash
    - CORE_PEER_ADDRESS=peer0.org1.example.com:7051
    # 启动后默认连接 peer0.org1.example.com
    - CORE_PEER_TLS_ENABLED=true
    # TLS 启用 

    # 默认是以 Admin@org1.example.com 身份连接到 Peer

    command: /bin/bash -c './scripts/script.sh ${CHANNEL_NAME}; sleep $TIMEOUT'

    # CLI 启动后执行 ./srcipts/script.sh 脚本，执行 Fabric 环境的初始化和 Chaincode 的安装及运行

    ############ 注释掉手动操作 #############

    - ../chaincode/go/:/opt/gopath/src/github.com/hyperledger/fabric/examples/chaincode/go
    # 要安装的 ChainCode 都在 fabric/examples/chaincode/go 目录下，开发的 ChainCode 只需把代码放到该目录
    ```

## 初始化 Fabric 环境
- 启动 Fabric 环境的容器
    - Fabric Docker 环境的配置放在 docker-compose-cli.yaml

    ```bash
    docker-compose -f docker-compose-cli.yaml up -d
    docker ps
    # 不加 -d 当前终端会一直附在 docker-compose 上；加上 -d 则 docker 容器会在后台运行
    ```

- 创建 Channel

    ```bash
    docker exec -it cli bash

    ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

    peer channel create -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/channel.tx --tls true --cafile $ORDERER_CA

    # 创建 Channel 命令：peer channel create
    # ChannelID要和创建 Channel 配置块时指定的名字一致
    # 执行命令后会在当前目录创建 mychannel.block文件，其它节点要加入此 Channel 必须使用该文件
    ```

- 各个 Peer 加入 Channel

    ```bash
    # CLI 默认连接 peer0.org1，该 peer 加入 channel 只需执行
    peer channel join -b mychannel.block

    # 其它 peer 加入该 Channel 要先该 CLI 环境变量使其执行要加入的 peer

    # peer1.org1 加入 mychannel
    CORE_PEER_LOCALMSPID="Org1MSP" 
    CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt 
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp 
    CORE_PEER_ADDRESS=peer1.org1.example.com:7051

    peer channel join -b mychannel.block

    # peer0.org2 加入 mychannel
    CORE_PEER_LOCALMSPID="Org2MSP" 
    CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt 
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp 
    CORE_PEER_ADDRESS=peer0.org2.example.com:7051

    peer channel join -b mychannel.block

    # peer1.org2 加入 mychannel
    CORE_PEER_LOCALMSPID="Org2MSP" 
    CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/ca.crt 
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp 
    CORE_PEER_ADDRESS=peer1.org2.example.com:7051

    peer channel join -b mychannel.block
    ```

- 更新锚节点

    ```bash
    # peer0.org1 是 org1 的锚节点
    CORE_PEER_LOCALMSPID="Org1MSP" 
    CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt 
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp 
    CORE_PEER_ADDRESS=peer0.org1.example.com:7051

    peer channel update -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/Org1MSPanchors.tx --tls true --cafile $ORDERER_CA

    # peer2.org2 是 org2 的锚节点
    CORE_PEER_LOCALMSPID="Org2MSP" 
    CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt 
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp 
    CORE_PEER_ADDRESS=peer0.org2.example.com:7051

    peer channel update -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/Org2MSPanchors.tx --tls true --cafile $ORDERER_CA

    ```

## 链上代码的安装与运行
- install chaincode 安装链码

    ```bash
    # 若 4 个 peer 都想对 Example02 进行操作，那么就需要安装 4 次
    # 切换到 peer0.org1 节点
    CORE_PEER_LOCALMSPID="Org1MSP" 
    CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt 
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp 
    CORE_PEER_ADDRESS=peer0.org1.example.com:7051

    # 使用 peer chaincode install 命令可安装指定的 chaincode 并对其命名
    peer chaincode install -n mycc -v 1.0 -p github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02
    ```

    - 安装的过程其实就是对 CLI 中指定的代码进行编译打包，并把打包好的文件发送到 peer，等待接下来的实例化
- instantiate chaincode 实例化链码
    - 实例化链上代码主要是在 peer 所在的机器上对安装好的链码进行包装，生成对应 Channel 的 Docker 镜像和 Docker 容器
    - 实例化时可以指定背书策略

    ```bash
    peer chaincode instantiate -o orderer.example.com:7050 --tls true --cafile $ORDERER_CA -C mychannel -n mycc -v 1.0 -c '{"Args":["init","a","100","b","200"]}' -P "OR      ('Org1MSP.member','Org2MSP.member')"
    # a 账户 100，b 账户 200

    # dev-peer0.org1.example.com-mycc-1.0
    docker logs -f peer0.org1.example.com
    2018-08-15 07:03:19.168 UTC [chaincode-platform] generateDockerfile -> DEBU 3ff
    # FROM hyperledger/fabric-baseos:x86_64-0.3.1
    # ADD binpackage.tar /usr/local/bin
    # LABEL org.hyperledger.fabric.chaincode.id.name="mycc" \
    #     org.hyperledger.fabric.chaincode.id.version="1.0" \
    #     org.hyperledger.fabric.chaincode.type="GOLANG" \
    #     org.hyperledger.fabric.version="1.0.0" \
    #     org.hyperledger.fabric.base.version="0.3.1"
    # ENV CORE_CHAINCODE_BUILDLEVEL=1.0.0
    # ENV CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/peer.crt
    # COPY peer.crt /etc/hyperledger/fabric/peer.crt
    # 2018-08-15 07:03:19.171 UTC [util] DockerBuild -> DEBU 400 Attempting build with image hyperledger/fabric-ccenv:x86_64-1.0.0
    # 2018-08-15 07:03:31.786 UTC [dockercontroller] deployImage -> DEBU 401 Created image: dev-peer0.org1.example.com-mycc-1.0
    # 2018-08-15 07:03:31.786 UTC [dockercontroller] Start -> DEBU 402 start-recreated image successfully
    # 2018-08-15 07:03:31.786 UTC [dockercontroller] createContainer -> DEBU 403 Create container: dev-peer0.org1.example.com-mycc-1.0
    ```

- 在一个 peer 上查询、发起交易

    ```bash
    # 以下操作均在 org1 上完成

    # 查询
    peer chaincode query -C mychannel -n mycc -c '{"Args":["query","a"]}'

    # a 转 10 给 b
    # peer chaincode invoke -o orderer.example.com:7050  --tls true --cafile $ORDERER_CA -C mychannel -n mycc -c '{"Args":["invoke","a","b","10"]}' # not working
    peer chaincode invoke -o orderer.example.com:7050  --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem  -C mychannel -n mycc -c '{"Args":["invoke","a","b","20"]}'
    ```

- 同一区块链、同一 channel 的其它节点查询交易

    ```bash
    # 为 peer0.org2 安装链码
    CORE_PEER_LOCALMSPID="Org2MSP" 
    CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt 
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp 
    CORE_PEER_ADDRESS=peer0.org2.example.com:7051

    peer chaincode install -n mycc -v 1.0 -p github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02

    # mycc 已在 org1 上实例化，对应区块已经生成，org2 上不能再次实例化，直接查询
    peer chaincode query -C mychannel -n mycc -c '{"Args":["query","a"]}'
    # peer0.org 也需要生成 Docker 镜像，创建对应容器，才能通过容器返回结果
    # dev-peer0.org2.example.com-mycc-1.0
    ```

# 运行
- `./network_setup.sh up`
    - 编译生成 Fabric 公私钥、证书的程序，程序在目录：fabric/release/darwin-amd64/bin
    - 基于 examples/e2e_cli/configtx.yaml 生成创世区块和通道相关信息，并保存在 examples/e2e_cli/channel-artifacts 文件夹
    - 基于 examples/e2e_cli/crypto-config.yaml 生成公私钥和证书信息，并保存在 examples/e2e_cli/crypto-config 文件夹中
    - 基于 examples/e2e_cli/docker-compose-cli.yaml 启动 1 Orderer +4 Peer + 1 CLI 的 Fabric 容器
    - 在 CLI 启动的时候，会运行 examples/e2e_cli/scripts/script.sh 文件，这个脚本文件包含了创建 Channel，加入 Channel，安装 Example02，运行 Example02 等功能
# Fix
- `code = Unknown desc = Error starting container: API error (404): {"message":"network e2ecli_default not found"}`
    - https://www.jianshu.com/p/22c108e0b463
- `invalid flag in #cgo CFLAGS`
    - `./fabric_v1.0.0/common/tools/cryptogen/go build -tags nopkcs11 main.go` 手动 build 并移到目标位置
    - 或 `export CGO_LDFLAGS_ALLOW=".*"`
        - > https://forum.golangbridge.org/t/invalid-flag-in-cgo-ldflags/10020
        - > https://github.com/golang/go/wiki/InvalidFlag
- `failed to get default registry endpoint from daemon (Got permission denied while trying to connect to the Docker daemon socket`
    - https://stackoverflow.com/questions/46202475/permission-denied-while-trying-to-connect-to-the-docker-daemon-socket
    - https://askubuntu.com/questions/747778/docker-warning-config-json-permission-denied
    - https://techoverflow.net/2017/03/01/solving-docker-permission-denied-while-trying-to-connect-to-the-docker-daemon-socket/

- > https://github.com/tonycai/The-Journal-of-Blockchain/wiki/How-to-install-Hyperledger-Fabric-on-ubuntu-16.04

docker rm $(docker ps -aq) -f
./cryptogen generate --config=./crypto-config.yaml

vim generateArtifacts.sh
vim network_setup.sh

go build -tags nopkcs11
go build -tags nopkcs11 main.go