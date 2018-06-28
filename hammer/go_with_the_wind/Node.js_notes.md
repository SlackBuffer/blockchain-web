# Node.js
- Node.js 事件驱动；非阻塞
- 全局对象
- 模块

    ```js
    // count.js 导出
    module.exports = count;
    // app.js 导入
    var count = require('./count');
    count();


    // 暴露多个功能
    module.exports.adder = adder;
    module.exports.pi = pi;
    // or
    module.exports = {
        adder: adder
        pi: pi
    }

    // 导入
    var stuff = require('./count');
    stuff.pi;
    stuff.adder();


    exports.startServer = startServer;

    var server = require('./route');
    server.startServer();    
    ```

- 继承 Node.js 自带的核心库来使用事件

    ```js
    var events = require('events');
    var util = require('util');

    var Person = function (name) { this.name = name; }
    util.inherits(Person, events.EventEmitter);
    ```

- 读写文件
    - `readFileSync`, `writeFileSync`
    - `readFile`，`writeFile`
    - `unlink`，`mkdir`，`rmdir`
- Node.js 在执行 JS 时是单线程的，并非 Node.js 是单线程
- Node.js 也维护事件队列
    - 读到异步事件时在事件队列注册一个事件
    - 主线程空闲时，从线程池发起另外的线程执行事件队列里的事件
    - 成功后通知主线程，执行回调函数
- 流
    - 处理数据；提高性能
    - 流是 `EventEmitter` 的实例
    - 把文件分成一个个 buffer 分段处理
    - `createReadStream`，`writeReadStream`
    - 管道

    ```
    ls | grep app
    ls | grep app | grep js
    ```

- 传递数据给服务器
    1. 地址栏参数（`GET`）
        - 用于查询
        - `http://localhost:3000/api/v1/records?sb=ho`
        - 可用 `url` 包
    2. 表单（`POST`）
        - 用于提交、修改数据
        - 可用 Postman 模拟
        - 可用 `querystring` 包
- nodemon
    - `nodemon app`
    - 可以把 package.json 的 node 改为 nodemon
    - 改 html 而不是 js 文件不会自动重启服务器，此时可在运行 nodemon 的终端执行 `rs` 手动重启
# Express
- `console.dir(obj)`
- 路由的参数里带冒号的是动态的，可以串联
    - `/profile/:id/user/:name'，`req.params.name` 取到 url 里 `name` 的对应值
    - 路由的内容是正则表达式
- 查询字符串
    - `req.query`
- POST 请求
    - 把 `<form>` 指向路由中来
    - 使用 `body-parser` 包
    - 用 Postman 对 API 进行模拟请求
        - `x-www-form-urlencoded`：正常表单提交，不带文件上传；会对特殊字符进行编码，转换成带 % 的
        - `form-data`：带文件上传
- 文件上传
    - `multer` 包
- 模板引擎
    - `app.set('view engine', 'pug')`
    - 往 html 中动态嵌入变量
    - 模板共用
    - ejs，pug
- 中间件（请求和响应的中间）
    - 把请求的内容进行处理
    - `use` 即使用中间件
        - `app.use('/assets', express.static('public'));` 响应静态文件
            - > 通过 `/assets/filename` 来访问
            - > `app.use(express.static('public'));` 通过 `/filename` 来访问
    - 路由中间件
        - `var router = express.Router();`
        - 在 `user` 语句里定义管理的路由