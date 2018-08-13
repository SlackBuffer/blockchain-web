- hash
    - 将数据用算法（如 [SHA-256](https://www.movable-type.co.uk/scripts/sha256.html)）转成定长的一组数字
    - 原始数据有微小改变，生成的 hash 就会剧变
    - 根据 hash 不能反向解出原始数据
    - 用相同的算法计算同一数据的 hash 永远会得到相同的 hash
    - 可用于**校验数据是否被篡改**
    - 可称为**签名**
- 区块
    - 组成
        1. Block number
        1. Nonce
        1. Data
            - 数据部分可以放智能合约，满足合约规定条件才会生成区块
        1. Previous block hash
            - 前后区块之间相互链接，形成区块链
            - 创世块的 previous block number 是 64 个 0（十六进制的数字）
                - > SHA-256 generates an almost-unique 256-bit sigature
        1. Current block hash   
            - 由 1-4 组成的数据集合计算得出
    - 挖矿
        - 当前区块的 hash 要满足一定条件，如前三位为 0
        - 通过枚举 Nonce 的值反复计算 hash 直至满足该条件，此时表示挖矿成功
    - 不可篡改的原因
        - 某一区块的任何数据发生改动，会使它以后的每个区块的 previous hash 都发生变化而需重新计算自身 hash
        - 矿工开始挖某一区块到完成挖矿期间，会有更多的新区块产生
        - [ ] 其它矿工、节点、全网承认某一区块的依据
- `watch -n 0.1 'docker ps'`
- > https://hyperledger.github.io/composer/latest/
---
- Hyperledger Fabric = DLT Framework
    - distributed ledger technology
- Hyperledger Composer 
    - a tool for creating business applications on Hyperledger DLT framework
- Decentralized system for exchange of value
    - Assets represent value
- Challenges
    - consistency: timely agreement by all parties on the state of the ledger
    - privacy, confidential
    - scalability, interoperability, standardization
- Fabric
    1. Permissioned network
        - Authentication: known identities
        - Access control: role assigned restricts the actions
        - Transaction validations: carried by a subset of participants
        - > 匿名网络的参与方互相不信任，需要额外手段验证交易
    1. confidential transactions
        - use channel
        - participants are in control of visibility of transactions
    1. no cryptocurrency
        - no need to incentivize the network for validations
        - participants decide who & how of validation
    1. programmable
        - chaincode automates the business process
- Assets
    - represent value
    - JSON or Binary
- chaincode
    - defines the asset's structure, transaction, business logic
- Ledger
    1. Transaction log
        - immutable
        - 用 levelDB 存储
            - embedded within peer
            - peers 将交易写入 levelDB
            - 查询也是在 peer 里进行的
            - key, value
            - 仅支持 simple queries
    2. State
        - current state
        - mutable
        - new version created on state updates, previous data won't be overwritten
        - State(key) = (version, value)
            - chaincode owns data for specific keys, access to specific keys restricted to owner chaincode
            - key 的标识是 key name 加上 chaincode name
        - 默认 levelDB，可插拔，可用 couchDB 支持复杂的 queries，在 peer 的配置文件里配置
    - ledger is manager on the peer
- Membership service provider
- Member 
    - legally independent entities
- identites 由 x.509 证书管理
    - 证书颁给每个参与者，参与者发起交易








- 交易流程
    - 执行 chaincode - 创建交易 - CRUD state (optional)