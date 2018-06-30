# 搭建 Fabric 1.0 环境
- > http://www.cnblogs.com/studyzy/p/7437157.html
- `mkdir -p ~/go/src/github.com/hyperledger` 
- `cd ~/go/src/github.com/hyperledger` 
- `git clone https://github.com/hyperledger/fabric.git`
- `git checkout v1.0.0`
- `cd ~/go/src/github.com/hyperledger/fabric/examples/e2e_cli/`
- `source download-dockerimages.sh -c x86_64-1.0.0 -f x86_64-1.0.0` 下载 Fabric Docker 1.0.0 镜像
- `./network_setup.sh up`
    - 编译 生成 Fabric 公私钥、证书的程序（cryptogen），程序目录在 fabric/release/darwin-amd64
    - 基于 configtx.yaml 生成创世区块和通道相关信息，并保存在 fabric/examples/e2e_cli/channel-artifacts 文件夹
    - 基于 crypto-config.yaml 生成公私钥和证书信息，并保存在 fabric/examples/e2e_cli/crypto-config 文件夹中
    - 基于 docker-compose-cli.yaml 启动 1 Orderer + 4 Peer + 1 CLI 的 Fabric 容器 
    - 在 CLI 启动的时候，会运行 fabric/examples/e2e_cli/scripts/script.sh 文件，这个脚本文件包含了创建 Channel，加入 Channel，安装 Example02，运行 Example02 等功能
- 查询 a 账户余额

    ```bash
    docker exec -it cli bash
    # channel 名 mychannel；chaincode 名 mycc；查询账户 a
    peer chaincode query -C mychannel -n mycc -c '{"Args":["query","a"]}'
    ```

- a 账户转账 20 给 b 账户

    ```bash
    peer chaincode invoke -o orderer.example.com:7050  --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem  -C mychannel -n mycc -c '{"Args":["invoke","a","b","20"]}'
    ```

- `./network_setup.sh down` 关闭网络
- https://www.cnblogs.com/studyzy/p/7451276.html
- `peer chaincode query -C mychannel -n mycc -c '{"Args":["query","a"]}'` 不成功
---
# 搭建基于 Beego 的 RESTful API
- > http://www.cnblogs.com/studyzy/p/6964612.html
- > https://swagger.io/
- `~/.zshrc` 加 `export PATH="$PATH:$GOPATH/bin"`
- `bee run -gendoc=true -downdoc=true`
- http://127.0.0.1:8080/swagger/
# 部署并测试 Fabric 0.6
- > https://www.cnblogs.com/studyzy/p/setup-fabric-on-ubuntu.html
# 介绍
- 加密货币背后的区块链技术属于 public permissionless blockchain technology
- 商用场景对性能要求则更高，而且参与者的身份必须明（金融交易里 Know-Your-Customer (KYC)，Anti-Money Laundering (AML) 规范必须遵守）
    - Participants must be identified/identifiable
    - Networks need to be permissioned
    - High transaction throughput performance
    - Low latency of transaction confirmation
    - Privacy and confidentiality of transactions and data pertaining to business transactions
## Hyperledger Fabric
- Hyperledger Fabric: an open source enterprise-grade permissioned distributed ledger technology (DLT) platform
- fabric 架构：modular, configurable
- 智能合约支持用通用编程语言编写：java, go, node.js
- 可插拔共识 protocols
    - 单一机构可选用 [crash fault-tolerant (CFT)](https://en.wikipedia.org/wiki/Fault_tolerance) 共识 protocol
    - 多机构可选用 [byzantine fault tolerant (BFT) consensus](https://en.wikipedia.org/wiki/Byzantine_fault_tolerance) 共识 protocol
- Fabric can leverage consensus protocols that do not require a native cryptocurrency to incent costly mining or to fuel smart contract execution
    - 不加入加密货币降低了被攻击的危险
    - 不必挖矿降低了部署成本
- **Fabric 里智能合约称为 chaincode**
### 模块化
- 可插拔的共识、身份管理 protocols (LDAP, OpenID Connect)、key management protocols、cryptographic libraries
- Fabric 由以下模块化组件构成
    - 可插拔排序服务（ordering service）：为交易的顺序建立共识，然后将区块广播给节点（peers）
    - 可插拔成员服务提供者（membership service provider, MSP）：将网络中的实体关联为加密实体
    - 智能合约（chaincode）：运行在容器环境里，起到隔离的效果；可以用通用编程语言编写；不能直接访问到账本状态
    - 账本可通过配置来支持多种数据库管理系统
    - 可插拔背书、认证策略：可以为每个 application 单独配置不同策略
### 需许可区块链 vs 无需许可区块链
- 无需许可区块链任何人都可参与，参与者匿名，相互之间不存在信用，唯一可信的是区块链状态（一定程度上不可改）
    - 通常会通过挖扩或交易费给参与基于 proof of work 的 byzantine fault tolerant 共识者以奖惩
    - 做过共识才可信
- 需许可区块链参与者身份确认，可以采用无需挖矿的共识 protocols；作恶者可以很容器定位到，降低了作恶动机
### 智能合约
- 是一个受信的分布式应用；它的安全/信用来自节点间的共识和区块链
- 是区块链应用的业务逻辑
- 要点
    - 网络中许多智能合约在同时运行
    - 可以动态部署
    - application 的代码应被当作是不可信的
- 多数支持智能合约的区块链平台从用 order-execute 架构
    - 共识 protocol 认证并排序交易，然后广播给 peer nodes
    - 每个节点循序执行交易
- order-execute 架构下的智能合约必须是确定性的（deterministic），否则共识可能永远不会达成
    - 为了处理不确定的情况，通常规定智能合约要用非标准的、domain-specific 的语言编写
- [ ] non-determinsm issue 指什么
- 每个节点都在循序执行所有交易，性能和规模可扩展展性很受限
    - 智能合约执行在每个节点上，使得防范恶意合约变得困难
### 智能合约的新架构
- fabric 采用 execute-order-validate 架构，将交易流程分为 3 步
    1. 执行交易，检查它的正确性，为它背书
    2. 通过共识 protocol 为交易排序
    3. 用应用特异的背书政策认证交易，再提交到账本
- 区别：fabric 在交易的最终顺序确定之前先执行交易
- 应用特异的背书策略指定了需要哪些节点，或要多少节点为某一个智能合约的执行正确性做担保
    - 因此每笔交易只需被满足该交易的背书策略要求的节点的一个子集来执行（背书），提升了性能和规模可扩展性
    - 同时消除了不确定性，因而支持标准编程语言
### 隐私和保密性
- 无需许可的区块链网络通过 PoW 建立共识模型，交易执行在所有节点
    - 意味着合约无法保密，处理的交易数据也无法保密
    - 所有交易、执行交易的密码对网络上的每个节点都可见
    - 用隐私换区了 PoW 带来的 byzantine fault tolerant 共识
- 商业应用中隐私和保密性必不可少
- 加密数据是一种提供保密性的方式 
    - 若在无许可区块链中使用，加密数据存储于每个节点上，若有足够的时间和计算资源，可以做到解密
- zero knowledge proofs (ZKP) 是另一种方式
    - 计算 ZKP 需要大量时间和计算资源，这里是性能换保密性
- 需许可的区块链中，可以将需要保密的信息限制在指定的授权节点上
- **fabric 引入 channel 的架构来实现保密性**
    -fabric 网络的参与者可以在一部分的参与者间建立通道，通道中的成员才有权限接触到特定的交易、交易数据、智能合约
- fabric 还通过两种特性来提高隐私性和保密性
    1. 隐私数据 - 一种称为 SlideDB 的特性
    2. ZKP
### 可插拔共识
- 交易的排序委托给一个做共识的模块化组件，即排序服务，逻辑上与执行交易和维护账本的节点解耦
- 目前提供了用 Kafka 和 Zookeeper 实现的 CFT 排序服务；后续会提供用 etcd/Raft 实现的 Raft 共识排序服务 和一个完全去中心化的 BFT 排序服务
### 性能和可扩展性
- 区块链平台的性能收交易规模、区块大小、网络规模、硬件等因素影响
# 关键概念