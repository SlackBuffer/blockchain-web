- JS 是单线程
    - 多线程会带来负载的同步问题
    - Web Workers 允许 JS 脚本创建多个线程，但子线程完全受主线程控制，且不允许操作 DOM
- 浏览器是多线程的
- 单线程意味着任务需要排队，后一个任务要等到前一个任务结束才能执行
    - 很多时候排队不是因为 CPU 计算量大，而是 IO 设备慢（如 AJAX 操作从网络读取数据）
- 两种任务
    - 同步任务
        - 一个函数返回时，调用者立刻得到结果
        - 只在主线程上排队执行的任务，继发执行
        - 所有同步任务在主线程上形成一个执行栈（execution context stack）
    - 异步任务
        - 主线程发起异步请求，相应的工作线程接收请求并执行任务
        - 不进入主线程而是进入任务队列（task queue）
        - 异步任务（浏览器多线程）有了运行结果，就在任务队列中放置一个事件
        - 一旦执行栈中所有同步任务执行完毕，系统立刻读取任务队列，查看里面的事件；于是对应的异步任务结束等待状态，进入执行栈
- 任务队列是一个事件队列（消息队列），**IO 设备完成一项任务就在任务队列中添加一个事件**
    - 除了 IO 设备事件，任务队列中的事件还包括用户产生的事件（如点击、页面滚动）
    - 指定过回调函数的事件，在事件发生时就会就如任务队列，等待主线程读取
- 回调函数就是那些会被主线程挂起的代码
    - 主线程执行完执行栈上的任务后开始执行异步任务时，实际上就是去执行对应的回调函数
- 任务队列先进先出
- 主线程读取任务队列的过程基本自动，执行栈一清空，任务队列上的排在第一位的事件就自动进入主线程
    - 由于存在定时器功能，实际上主线程首先会检查一下执行时间，设置了定时器的回调只有到了规定的事件才会进入主线程被执行
- 主线程从任务队列中读取事件的过程循环不断，这种运行机制又称为 Event loop
- `setTimeout()` 第二个参数为 0 表示执行栈清空后立即执行
    - 第二个参数表示等待 n 毫秒后把任务加入任务队列
        - `setTimeout()` 只是将事件插入任务队列，若当前代码耗时很长，则没法保证回调函数指定会在指定的时间执行
    - HTML5 标准规定了 `setTimeout()` 的第二个参数的最小值（最短间隔）不得低于 4 毫秒，低于 4 就自动增加
        - 在此之前老版本的浏览器都将最短间隔设为 10 毫秒
    - 对于那些 DOM 的变动（尤其是涉及页面重新渲染的部分），通常不会立即执行，而是每 16 毫秒执行一次，这时使用 `requestAnimationFrame()` 的效果要好于 `setTimeout()`
# 异步编程背景
## 事件模式
- 适用于简单交互
- 串联多个关联事件操作十分复杂
    - 必须为每个事件记录事件的对象（event target）
    - 必须确保事件处理器在事件发生前妥善注册
## 回调模式
- Node.js 推广了回调模式
- 使用回调模式串联关联事件比事件模式的方式灵活
    - 嵌套过深会使代码可读性变差，调试困难（回调地狱）
    - 难以处理的情境
        1. 两个异步操作并行运行，两个操作都完成后发出通知
        2. 同时发起两个异步操作，第一个操作返回结果后就算此次操作完成
# Promise
- 一个 promise 对象是一个异步操作的执行结果的占位符，根据将来此操作的执行结果再决定如何处理

    ```js
    // 读取文件的操作保证在将来某个时间会执行完成

    let promise = readFile('a.txt');
    ```

## 生命周期
- 2 个阶段
    1. pending
        - 表明异步操作未完成（unsettled）
    2. settled
        - 异步操作完成，有两个可能状态
            1. fulfilled：异步操作执行成功
            2. rejected：异步操作执行失败
- 内部属性 `[[PromiseState]]` 指示 promise 的状态
    1. `"pending"`
    2. `"fulfilled"`
    3. `"rejected"`
    - 此属性值外部无法读取，`then()` 方法可以利用到 `[[PromiseState]]` 的状态变化来采取不同操作
        - 所有 promise 上都有 `then()` 方法
- `then()` 接受 2 个参数
    1. 异步操作执行成功（fulfilled）后执行的函数
    1. 异步操作执行失败（rejected）后执行的函数
    - 两个参数都是可选的
    - promise 上有一个 `catch()` 方法，与只传异步操作执行失败时的回调函数的情况同效

        ```js
        promise.catch(function(err) {
            console.log(err.message);
        });
        promise.then(null, function(err) {
            console.log(err.message);
        })
        ```

    - 用以上方式实现了 `then()` 方法的对象称为一个 *thenable*
        - 所有 promise 都是 thenable
        - 不是所有 thenable 都是 promise
- promise 模式下，异步操作的结果如何很清晰
    - 事件模式下，有错误时事件往往不会触发
    - 回调模式必须要记得去检查 `error` 参数
- 未给 promise 指定异步操作执行失败时的事件处理器，所有错误都会静默发生
    - 一定加上 rejection handler，哪怕只是 log 一下错误信息
- 一个 promise 完结后，再为它加上事件处理器，这些处理函数也会被执行

    ```js
    let promise = readFile('example.txt');
    promise.then(function(contents) {
        console.log(contents);
        // 后加的

        promise.then(function(contents) {
            console.log(contents);
        });
    });
    ```

    - 后加的事件处理器也会加到事件队列等待被执行
> - promise 的事件是加到仅供 promise 使用的单独的事件队列中
## 创建 unsettled promise
- `Promise()` 构造器
    - 接受单一参数：一个叫作 ***executor*** 的函数，用来初始化 promise
    - executor 函数被传入了两个函数作为参数（类比 `arr.map(function(item, index, arr) {});`，两个函数由 JS 自动传入，函数参数在 promise 被处理后才确定）
        1. `resolve()`
            - executor 函数成功执行后执行
            - 表示 promise 待 resolved
        2. `reject()`
            - executor 函数执行失败后执行
    - executor 去执行异步操作，此异步操作的执行完毕得到的数据就是传入参数 `resolve()` 和 `reject()` 根据操作结果调用它的两个函数参数

    ```js
    // Node.js

    let fs = require('fs');

    function readFile(fileName) {
        return new Promise(function (resolve, reject) {
            fs.readFile(fileName, { encoding: 'utf8' }, function (err, contents) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(contents);
            });
        });
    }

    let promise = readFile('a.txt');

    promise.then(function (contents) {
        console.log(contents);
    }, function (err) {
        console.error(err.message);
    })
    ```

    - `readFile()` 被调用后 executor 函数马上执行
    - executor 函数的异步操作的执行完毕后，依据执行结果的不同，`resolve()` 或 `reject()` 回调函数被调用，rosolve 目标 promise
    - 上一步 resolve 目标 promise 会触发一个异步操作去执行 `then()` 和 `catch()` 

        ```js
        let promise = new Promise(function (resolve, reject) {
            console.log('promise');
            resolve();
        });
        
        promise.then(function () {
            console.log('resolved');
        });

        console.log('hi');  // promise => hi => resolved
        ```

        - `then()` 和 `catch()` 要等到主线程执行栈清空了再执行啊，不然用同步逻辑就阻塞主进程了
## 创建 settled promise
- 有两个方法可以创建一个表示一个给定的确定值的 promise
- `Promise.resolve()`
    - 接受单一参数，返回一个状态为 fulfilled 的 promise
    - 可以为该 promise 添加一个或多个 fulfillment handler 取回、操作该参数

    ```js
    let promise = Promise.resolve(44);
    promise.then(function (value) {
        console.log(value);     // 44

    });
    ```

- `Promise.reject()`
    - 接受单一参数，返回一个状态为 rejected 的 promise
- 如果传给 `Promise.resolve()` 或 `Promise.reject()` 的参数是一个 promise，该 promise 会被原封不动地返回
- `Promise().resolve()` 和 `Promise.reject()` 也可以接受非 promise 的 thenable 作为参数
    - 这种情况下，`Promise().resolve()` 或 `Promise.reject()` 会创建一个在 `thenable.tthen()` 之后被调用的新的 promise
- 一个有接受 `resolve` 和 `reject` 两个参数的 `then()` 方法的对象，就是一个非 promise 的 thenable

    ```js
    let thenable = {
        then: function (resolve, reject) {
            resolve(44);
        }
    };

    let p1 = Promise.resolve(thenable);
    p1.then(function (value) {
        console.log(value);     // 44

    });

    console.log('43');          // 43 （先）
    ```

    - `Promise.resolve()` 调用 `thenable.then()`，promise 的状态确定为 fulfilled

    ```js
    let thenable = {
        then: function(resolve, reject) {
            reject(42);
        }
    };

    let p1 = Promise.resolve(thenable);
    p1.catch(function(value) {
        console.log(value);     // 42

    });
    ```

    - 此时 promise 状态确定为 rejected
- [ ] 没有 `Promise.reject()` 传入非 promise 的 thenable?
- [ ] 不确定一个对象是不是 promise，可以把该对象传入 `Promise.resolve()` 或 `Promise.reject()`（根据对结果的预期）
    - 若对象是 promise 只会被原封不动返回
- 若 executor 抛错，promise 的 rejection handler 会被调用

    ```js
    let promise = new Promise(function (resolve, reject) {
        throw new Error('error');
    });
    promise.catch(function (error) {
        console.log(error.message);     // "error"

    });

    // equivalent to 

    let promise = new Promise(function (resolve, reject) {
        try {
            throw new Error('error');
        } catch (ex) {
            reject(ex);
        }
    });
    promise.catch(function (error) {
        console.log(error.message);     // "error"

    });
    ```

    - 每个 executor 函数都有隐式的 `try-catch`，抛错会被捕捉
    - 抛错只有在有 rejection handler 存在时才会被报告
- promise 状态是 rejected 而没有相应的 rejection handler 的时候，结果是 silent failure
    - 无论 promise 是否已经 resolved，调用 `then()` 或 `catch()` 都会得到正确执行，使得很难准确知道 promise 将在何时得到处理
## Node.js rejection 处理
- Node.js 的 `process` 对象上有 2 个与 promise rejection 处理的事件
    1. `unhandledRejection`：一轮 event loop 中，一个 promise 被 reject 又没有对应的处理器时被触发

        ```js
        let rejected;
        process.on('unhandleRejection', function (reason, promise) {
            console.log(reason.message);            // "error"

            console.log(rejected === promise);      // true

        });
        rejected = Promise.reject(new Error('error'));
        ```

    2. `rejectionHandled` 
- A simple unhandled rejection tracker.
## 浏览器 rejection 处理
- 与 Node.js 上的事件，存在在 `window` 对象上
- 事件对象的属性
    - `type`：事件类型
    - `promise`
    - `reason`：promise 的 rejection 值
## 串联 promise
- `then()` 和 `catch()` 返回的是 promise
- 串联的 promise 只有前面一个 resolve 后，后接的 promise 才会被处理
- 捕捉前一个 promise 的处理器中可能抛出的错误

    ```js
    let p1 = new Promise(function (resolve, reject) {
        resolve(42);
    });
    p1.then(function (value) {
        throw new Error('boom');
    }).catch(function (error) {
        console.log(err.message);   // error

    });
    ```    

- 总是在 promise chain 的末尾放一个 rejection handler
## promise chain 的返回值
- 为 fulfilled handler 指定返回值后可以将该值沿着 promise chain 传递下去

    ```js
    let p1 = new Promise(function (resolve, reject) {
        resolve(44);
    });
    p1.then(function (value) {
        console.log(value);         /* 44 */
        return value + 1;
    }).then(function (value) {
        console.log(value);         /* 45 */
    });
    ```

- 一个 promise 失败，整条 promise chain 还可以恢复

    ```js
    let p1 = new Promise(function (resolve, reject) {
        reject(44);
    });
    p1.catch(function (value) {
        console.log(value);
        return value + 1;       /* 44 */
    }).then(function (value) {
        console.log(value);     /* 45 */
    });
    ```    

    - rejection handler 的返回值仍可以被下一个 fulfillment handler 里获取    
## promise chain 返回 promise
- 若 promise 的返回值不是基础类型而是 promise 对象，要视情况处理

    ```js
    let p1 = new Promise(function (resolve, reject) {
        resolve(42);
    });
    
    let p2 = new Promise(function (resolve, reject) {
        reject(43);
    });
    p1.then(function (value) {
        console.log(value);
        return p2;
    }).then(function (value) {
        console.log(value);     /* 未被调用，第二个 then() 的 promise 的状态是 rejected（p2） */
    });
    ```

- 前一个 promise 被处理后再触发下一个 promise

    ```js
    let p1 = new Promise(function (resolve, reject) {
        resolve(42);
    });
    p1.then(function (value) {
        console.log(value);
        let p2 = new Promise(function (resolve, reject) {
            resolve(43);
        });
        return p2;
    }).then(function (value) {
        console.log(value);
    });
    ```

    - p2 的状态变为 fulfilled 后第二个 fulfillment handler 才会执行
## 回应多个 promise
- `Promise.all()`
    - 接受单一的参数，promise 的 iterable（如数组）
    - 当参数里所有的 promise 都 resolved 后，返回一个 resolved promise
    - 一旦有一个 promise 是 rejected，就退出不在执行（短路）
- `Promise.race()`
    - 有一个 promise 状态变为 settled，返回的 promise 就 settle
    - 返回的 promise 的状态由第一个 settled promise 决定
## 从 promise 继承
## Asynchronous task running
- task runner

    ```js
    let f = require('fs');
    function run(taskDef) {
        // create the iterator

        let task = taskDef();
        /* start the task */
        let result = task.next();
        (function step() {
            if (!result.done) {
                let promise = Promise.resolve(result.value);
                promise.then(function (value) {
                    result = task.next(value);
                    step();
                }).catch(function (error) {
                    result = task.throw(error);
                    step();
                });
            }
        }());
    }

    function readFile(filename) {
        return new Promise(function (resolve, reject) {
            fs.readFile(filename, function (err, contents) {
                if (err) {
                    reject(err);
                } else {
                    resolve(contents);
                }
            });
        });
    }
    run(function*() {
        let contents = yield readFile('config.json');
        doSomethingWith(contents);
        console.log('done');
    })
    ```    