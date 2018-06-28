# 箭头函数
- 箭头函数没有绑定 `this`, `super`, `arguments`, `new.target`，它的这些值是它最近的非箭头包含函数的值
- 箭头函数在两种模式下都不能有重名的参数，非箭头函数只在严格模式下不允许有重名参数
- 箭头函数的 `name` 遵循非箭头函数的规则
## 语法
- 参数 + `=>` + 函数体
    - 单参数可以不加括号

        ```javascript
        var reflect = value => value;

        var reflect = function(value) {
            return value;
        };
        ```

    - 多参数要放在括号里

        ```javascript
        var sum = (num1, num2) => num1 + num2;

        var sum = function(num1, num2) {
            return num1 + num2;
        };
        ```

    - 无参数写空括号

        ```javascript
        var getName = () => "sb";

        var getName = function() {
            return "sb";
        }
        ```

    - **函数体若要包含在 `{}` 里，则要写 `return` 语句**

        ```javascript
        var sum = (num1, num2) => {
            return num1 + num2;
        };
        ```

    - 返回值是对象字面量要放在 `()` 里，表示 `{}` 标识的是一个对象而不是函数体

        ```javascript
        var getTempItem = id => ({ id: id, name: "Temp" ) });
        ```

    - 空函数

        ```javascript
        var doNothing = () => {};
        var doNothing = function() {};
        ```

## IIFEs
- 非箭头函数表达式 IIFE

    ```javascript
    let person = function(name) {
        return {
            getName: function() {
                return name;
            }
        };
    }("sb");
    console.log(person.getName());

    (function() {
    })();       // 匿名函数的函数体必须包在括号里
    ```

    - `function()`
- 非箭头函数 IIFE

    ```javascript
    function getName(name) {
        console.log(name);
    }('sb');
    ```

- 箭头函数 IIFE

    ```javascript
    let person = (name => {
        return {
            getName: function() {
                return name;
            }
        };
    })("sb");
    console.log(person.getName());      // sb
    ```

## `this`
- 箭头函数里的 `this` 通过向上查找作用域链来确定
    1. 若它被包含在一个非箭头函数中，`this` 就跟该非箭头包含函数相同
    2. 若找不到这样的包含函数，`this` 值就跟在全局作用域下调用时相同
    - 结果是不能通过调用 `call()`，`apply()`，`bind()` 来改变 `this` 的值
        - 可以调用以上方法但没有效果
        - 不然就相当于改了包含函数的 `this` 啊
    - `this` 在函数的整个生命周期都不会变
    - 没有 `[[Construct]]` 方法，不能通过 `new` 调用
        - 不能通过 `new` 调用，也就没有必要有 `prototype` 属性，所以箭头函数没有 `prototype` 属性
## `arguments`
- 箭头函数本身没有 `arguments` 对象，只能依赖实名变量和 rest parameter 来操作参数
- 箭头函数可以访问到它的非箭头包含函数的 `arguments`
    - 闭包
## 尾调用优化
- 尾调用：一个函数的最后一步是调用另一个函数
- 函数调用会在内存形成一个“调用记录”，称为“调用帧”（call frame），保存调用位置和内部变量等信息
    - 函数 A 在内部调用函数 B，在 A 的调用记录上方会形成一个 B 的调用记录
    - 等到 B 运行结束，将结果返回到 A，B 的调用记录才消失
    - 若函数 B 在内部还调用函数 C，就还会有一个 C 的调用记录栈，以此类推
    - 所有的调用记录，就形成一个“调用栈”（call stack）
- 尾调用由于是函数的最后一步操作，所以不需要保留函数的调用记录，因为调用位置、内部变量等信息都不会再用到了
- 尾调用优化：只保留内层函数的调用记录
    - 如果所有函数都是尾调用，就可以做到每次执行时调用记录只有一项，大大节省了内存
- ES5 没对尾调用特殊处理：尾调用的调用帧在调用栈栈顶形成一个新的调用记录，尾调用之前的所有调用帧都保存在内存里
- ES6 严格模式对尾调用做出优化
    - 尾调用时，在以下条件满足的情况下回清空当前的调用帧
        1. 尾调用无需访问当前当前调用帧的变量（即不存在闭包）
        2. 尾调用执行完毕后，调用者没有其它操作

            ```js
            'use strict'

            function doSth() {
                return 1 + doSthElse();
            }
            ```

            - 未优化，有加 1 操作

        3. 尾调用的执行结果立刻被当做调用者函数的返回值返回
            - 将尾调用的执行结果保存在一个变量里再去返回该变量，也不会进行优化
- 递归函数的尾调用优化（尾递归）

    ```js
    // 未优化，最多需要保存 n 个调用记录

    function factorial(n) {
        if (n === 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    // 只保留一个调用记录

    function factorial(n, total = 1) {
        if (n === 1) {
            return total;
        }
        return factorial(n - 1, n * total)
    }
    // 传入两个参数，不直观

    factorial(5, 1);
    ```

- 尾递归的实现要确保最后一步值调用自身
    - 把所有用到的内部中间变量改写成函数的参数
        - 缺点是不太直观
            - 用 ES6 默认参数就可以直观了
    - 改进方法
        1. 除了尾递归函数，再提供一个正常形式的函数

            ```js
            function tailFactorial(n, total = 1) {
                if (n === 1) {
                    return total;
                }
                return tainFactorial(n - 1, n * total);
            }
            function factorial(n) {
                return tailFactorial(n, 1);
            }
            ```

        2. 柯里化

            ```js
            function currying(fn, n) {
                return function (m) {
                    return fn.call(this, m, n);
                };
            }
            function tailFactorial(n, total) {
                if (n === 1) {
                    return total;
                }
                return tailFactorial(n - 1, n * total);
            }
            const factorial = currying(tailFactorial, 1);
            ```

            - 将多参函数转换成单参形式