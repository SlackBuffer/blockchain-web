- ES5 实现

    ```javascript
    function makeRequest(url, timeout, callback) {
        timeout = timeout || 2000;
        callback = callback || function() {};
    }
    ```

    - 缺陷: 传入的 `timeout` 为 0 时，逻辑出错

        ```javascript
        function makeRequest(url, timeout, callback) {
            timeout = (typeof timeout !== "undefined") ? timeout : 2000;
            callback = (typeof callback !== "undefined") ? callback : function() {};
        }
        ```

        - 改进版

- 参数默认值

    ```javascript
    function makeRequest(url, timeout = 2000, callback = function() {}) {
    }
    ```

    1. 设置有默认值但未传入参数时使用默认参数
    2. 设置有默认值但传入的参数是 `undefined` 时也会使用默认参数
- ES5 非严格模式下, `arguments` 对象的改变会反映到命名变量上，命名变量的改变也会反映到 `arguments` 对象（动态映射）

    ```javascript
    function minArgs(first, second) {
        first = "c";
        console.log(arguments[0]);  // c

        arguments[1] = "d";
        console.log(second);        // d

    }

    minArgs("a", "b"); 
    ```

- ES5 严格模式下, `arguments` 对象与命名变量相互之间不存在动态映射
 
    ```javascript
    function minArgs(first, second) {
        'use strict';
        first = "c";
        console.log(arguments[0]);  // a

        arguments[1] = "d";
        console.log(second);        // b

    }
    minArgs("a", "b");
    ```

- 使用了默认参数值的函数在任何模式下都跟 ES5 严格模式下的行为相同
 
    ```javascript
    function minArgs(first, second = "b") {
        console.log(arguments.length);  // 1

        console.log(arguments[1]);      // undefined

        first = "c";
        second = "d";
        console.log(arguments[0]);      // a

        console.log(arguments[1]);      // undefined

        arguments[0] = 'e';
        arguments[1] = 'f';
        console.log(first);             // c

        console.log(second);            // d

    }

    minArgs("a");
    ```

    - 相互之间不存在动态映射
- 在前面的参数可以作为后面参数的默认值

    ```javascript
    function add(first, second = getValue(first)) {
        return first + second;
    }
    function getValue(value) {
        return value + 5;
    }
    console.log(add(1, 1));     // 2

    console.log(add(1));        // 7
    ```

- TDZ

   ```javascript
    function add(first = second, second) {
        return first + second;
    }
    console.log(add(1, 1));             // 2
    console.log(add(undefined, 1));     // throws error

    // javascript representation of call to add(1, 1)
    let first = 1;
    let second = 1;

    // javascript representation of call to add(undefined, 1)
    let first = second;
    let second = 1;    
    ```

- 函数的参数有自己的作用域和 TDZ，与函数体的互相独立