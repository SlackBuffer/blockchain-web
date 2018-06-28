# Keynotes
- Generators：带 `*`，带 `yield`
    - 不是所有返回遍历器的函数都是生成器
- 没 `return` 语句时，`yield` 后跟的值是调用 `next()` 返回的对象的 `value` 值
- 有 `return` 语句时，表示 Generator 结束，调用 `next()` 返回的对象的 `done` 被设为 `true`，`value` 设为 `return` 的值
- `yield` 表达式本身没有返回值，总是返回 `undefined`
- **通过 `next()` 给遍历器传递参数，会变成遍历器里的前一个 `yield` 表达式的值**
- Generator 函数执行后，返回一个遍历器对象，该对象本身也具有 `Symbol.iterator` 属性，执行后返回自身

# iterators
- 遍历器是带有遍历接口的对象
    - 遍历器对象的本质是指针对象，指向当前数据结构的起始位置
        - 第一次调用指针对象的 `next()` 方法，指针指向数据结构的第一个成员
        - 不断调用 `next()` 方法直到它指向数据结构的结束位置
    - 每个遍历器（而不是 iterable）都有 `next()` 方法，执行后返回一个结果对象
    - 结果对象有两个属性
        1. `value`
        2. `done`：无值可返回时为 `true`
    - 遍历器对象 `done: false` 和 `value: undefined` 属性可以省略
- 给类部署 iterator 的写法（部署后该类变为 iterable）

    ```js
    class RangeIterator {
        constructor(start, stop) {
            this.value = start;
            this.stop = stop;
        }
        [Symbol.iterator]() { return this; }
        next() {
            var value = this.value;
            if (value < this.stop) {
            this.value++;
            return {done: false, value: value};
            }
            return {done: true, value: undefined};
        }
    }
    function range(start, stop) {
        return new RangeIterator(start, stop);
    }

    for (var value of range(0, 3)) {
        console.log(value); // 0, 1, 2
    }
    ```

# generators
- Generator 函数是一个状态机，封装了多个内部状态
- 调用 Generator 函数后函数，返回一个指向内部状态的指针对象（即遍历器对象）
- 生成器是返回值是一个遍历器的函数
    - Generators `function` 后带一个 `*`，中间空格可有可无
    - Generators 函数体内部使用 `yield` 表达式
    - Generators 只是是一种遍历器生成函数
    - 返回的遍历器对象可以依次遍历 Generator 函数内部的每一个状态
- 生成器函数在执行完一个 `yield` 语句后就暂停执行，直到下一个 `next()` 被调用
- Generator 函数是分段执行的，`yield` 表达式是暂停执行的标记，而 `next` 方法可以恢复执行
- 调用 iterator 的 `next()` 方法时返回对象的 `value` 是对应的 `yield` 后紧跟的值，按照写 `yield` 的顺序返回
    - **`yield` 必须直接写在生成器里**，嵌套在生成器的其它方法里写不行
- 下一次调用 `next()` 方法时，再继续往下执行，直到遇到下一个 `yield` 表达式
    - 如果没有遇到新的 `yield` 表达式，就一直运行到函数结束，直到 `return` 语句为止
    - 生成器里的 `return` 表示执行结束，`done` 被设置为 `true`，`value` 值被设为 `return` 的值
    - 若函数没有 `return` 语句，则返回对象的 `value` 为 `undefined`

    ```js
    function *createIterator(items) {
        for (let i = 0; i < items.length; i++) {
            yield items[i];
        }
    }
    // 函数表达式写法
    /* let createIterator = function *(items) {
        for (let i = 0; i < items.length; i++) {
            yield items[i];
        }
    }; */
    let iterator = createIterator([1, 2, 3]);
    console.log(iterator.next());           // "{ value: 1, done: false }"
    console.log(iterator.next());           // "{ value: 2, done: false }"
    console.log(iterator.next());           // "{ value: 3, done: false }"
    console.log(iterator.next());           // "{ value: undefined, done: true }"
    // for all further calls
    console.log(iterator.next());           // "{ value: undefined, done: true }"
    ```

    - 不能用箭头函数的写法创建生成器
- `yield` 后跟的表达式是惰性求值，只有调用 `next()` 方法后才会执行
- ES6 规定默认的 iterator 接口部署在数据结构的 `Symbol.iterator` 属性上
- `iterable` 是带有 `Symbol.iterator` 属性（即部署了 iterator 接口）的对象
    - `Symbol.iterator` 指定一个函数（即生成器）来为该对象返回一个遍历器
        - 调用 `Symbol.iterator` 在后台由 JS 引擎完成
    - ES6 的对象集合（array，set，map）和字符串都是 iterable，有默认的遍历器
- `for-of` 每次执行循环时回去调用 `iterable` 的 `next()` 方法，将 `value` 保存在一个变量里；循环在 `done` 变为 `true` 时结束
- 访问默认的遍历器

    ```js
    // for-of 做的事
    let arr = [1, 2, 3];
    let iterator = arr[Symbol.iterator]();
    console.log(iterator.next());           // "{ value: 1, done: false }"
    console.log(iterator.next());           // "{ value: 2, done: false }"
    console.log(iterator.next());           // "{ value: 3, done: false }"
    console.log(iterator.next());           // "{ value: undefined, done: true }"

    // 测试一个对象是否是 iterable
    function isIterable(object) {
        return typeof object[Symbol.iterator] === "function";
    }
    ```

- 用户自定义的对象默认不是 iterable，可以新增一个值是生成器的 `Symbol.iterator` 属性使它成为 iterable

    ```js
    let collection = {
        items: [],
        *[Symbol.iterator]() {
            for (let item of this.items) {
                yield item;
            }
        }

    };
    collection.items.push(1);
    collection.items.push(2);
    collection.items.push(3);
    for (let x of collection) {
        console.log(x);
    }
    ```

    - Generator 函数赋值给 `Symbol.iterator` 属性，从而使得 `collection` 对象具有了 Iterator 接口，可以被 `...` 运算符遍历
    - Generator 函数执行后，返回一个遍历器对象，该对象本身也具有 `Symbol.iterator` 属性，执行后返回自身

        ```js
        function* gen() {}
        var g = gen();
        g[Symbol.iterator]() === g;     // true
        ```

- ES6 的三个集合对象是 array，map，set，有以下內建的遍历器
    - `entries()`：返回的遍历器的值是键值对（map 的默认遍历器）
    - `values()`：返回的遍历器的值是值（set 和 array 的默认遍历器）
    - `keys()`：返回的遍历器的值是键    
- `for-of` 的解构用法

    ```js
    let data = new Map();
    data.set("title", "abc");
    data.set("name", "sb");
    for (let [key, value] of data) {
        console.log(key + "=" + value);
    }
    for (let entry of data.entries()) {
        console.log(entry)
    }
    ```

- ES6 的字符串遍历器操作的是字符而不是 code unit
- `NodeList` 是文档里一系列元素的集合，类似 array 却又不同
    - ES6 以后 `NodeList` 的默认遍历器和 array 的默认遍历器表现相同
- 展开操作符适用于所有的 iterable，会调用默认的遍历器
- `yield` 表达式本身没有返回值，总是返回 `undefined`
- **通过 `next()` 给遍历器传递参数，会变成遍历器里的前一个 `yield` 表达式的值**

    ```js
    function *createIterator() {
        let first = yield 1;
        let second = yield first + 2;       // 4 + 2
        yield second + 3;                   // 5 + 3
    }
    let iterator = createIterator();
    console.log(iterator.next());           // "{ value: 1, done: false }"
    console.log(iterator.next(4));          // "{ value: 6, done: false }"
    console.log(iterator.next(5));          // "{ value: 8, done: false }"
    console.log(iterator.next());           // "{ value: undefined, done: true }"
    ```

    - `yield` 表达式的执行会阻止 `yield` 左侧的代码的执行
    - 第一个 `next()` 语句的参数总是会被丢弃，因为即使传进去，也因 `yield` 的阻塞而无法访问到，而后又会被第二个 `next()` 的参数覆盖（即使为空）
    - 从语义上讲，第一个 `next()` 方法用来启动遍历器对象，所以不用带有参数
- 可以给 iterator 传递错误

    ```js
    function *createIterator() {
        let first = yield 1;
        let second;

        try {
            second = yield first + 2;       // yield 4 + 2, then throw
        } catch (ex) {
            second = 6;                     // on error, assign a different value
        }
        yield second + 3;
    }
    let iterator = createIterator();
    console.log(iterator.next());                   // "{ value: 1, done: false }"
    console.log(iterator.next(4));                  // "{ value: 6, done: false }"
    console.log(iterator.throw(new Error("Boom"))); // "{ value: 9, done: false }"
    console.log(iterator.next());                   // "{ value: undefined, done: true }"
    ```

- 委托生成器会将多个生成器的 `yield` 串起来，`done` 只在执行到串起来后的 `yield` 语句的最后一个后才设为 `true`
- 运行任务

    ```js
    // 往 task runner 里传入一个生成器
    function run(taskDef) {
        // 生成遍历器
        let task = taskDef();
        let result = task.next();
        function step() {
            if (!result.done)  {
                result = task.next(result.value);
                step();
            }
        }
        step();
    }
    run(function *() {
        let value = yield 1;
        console.log(value); // 1
        value = yield value + 3;
        console.log(value); // 4
    });
    ```

- 运行异步任务时 runner 里的调用得到的返回值需要知道这是一个异步调用、要等着

    ```js
    function run(taskDef) {
        let task = taskDef();
        let result = task.next();
        console.log("result: ", result);
        function step() {
            if (!result.done) {
                if (typeof result.value === "function") {
                    result.value(function(err, data) {
                        if (err) {
                            result = task.throw(err);
                            return;
                        }
                        console.log(data, "a round finished");
                        result = task.next(data);
                        step();
                    });
                } else {
                    console.log(result.value, "a round finished");                    
                    result = task.next(result.value);
                    step();
                }
            } else {
                console.log("final result: ", result);
            }
        }
        step();
    }
    function fetchData() {
        return function(callback) {
            setTimeout(function() {
                callback(null, "Hi!");
            }, 1000);
        };
    }
    run(function *() {
        yield fetchData();
        yield 1;
        console.log("Doing something...");
        console.log("Done");
    });
    ```