- rest 参数
    - `function(obj, ...namedArray)`
    - `nameArray` 是一个数组，表示传入函数的其它参数
    - 只能有一个 rest 参数, 且只能放最后
    - rest 参数不能用在 object literal setter 里
    - `Function.prototype.length` 是命名参数的个数，不受 rest parameter 的影响
- spread 操作符
    - 在函数调用时 (`...arr`) 把一个 `arr` 数组的元素逐个传入

    ```javascript
    let values = [-25, -50, -75, -100];

    // ES5 

    console.log(Math.max.apply(Math, values));      // -25

    // ES6

    console.log(Math.max(...values));               // -25

    console.log(Math.max(...values, 0));            // 0
    ```

# 析构（destructuring）
## 对象析构
- 基本写法

    ```js
    let node = {
        type: 'id',
        name: 'sb'
    };
    let { type, name } = node;
    type;   // 'id'

    name;   // 'sb'
    ```

- 要析构的本地变量要跟对象的属性名相同才能一一对应
    - 要不重名的写法见下方
- 用 `var`， `let`，`const` 声明变量来使用析构时必须初始化
    - `const` 其实在任何时候都要初始化
- 已经初始化的变量也可以用析构的方式重新赋值

    ```js
    let node = {
        type: 'id',
        name: 'sb'
    };
    let type = 'a';
    let name = 'b';
    ({ type, name } = node);
    type;   // 'id'

    name;   //  'sb'
    ```

    - 重新赋值时析构语句必须用 `()` 括起来
    - `{}` 表示是一个语句块，语句块不能出现在赋值操作符的左侧
    - `()` 指示 `{}` 应被当做表达式处理而不是语句块
- 析构赋值表达式的右侧（`=` 右侧）是 `null` 或 `undefined` 会报错
    - 从 `null`，`undefined` 读属性会报错
- 析构对象里不存在的属性会得到 `undefined`
    - 可以用默认参数赋值
- 本地变量用不同与属性的名称

    ```js
    let node = {
        type: 'id'
    };
    let { type: localType, name: localName = 'bar' , ghost } = node;
    localType;  // 'id'

    localName;  // 'bar'

    ghost;      // 'undefined'
    ```

- 析构嵌套的对象

    ```js
    let node = {
        type: 'id',
        name: 'foo',
        loc: {
            start: {
                line: 1,
                column: 2
            },
            end: {
                line: 1,
                column: 4
            }
        }
    };
    let { loc: { start: localStart } } = node;
    ```

    - `:` 后的 `{}` 表示目标嵌套在下一层里
# 数组析构
- 用法与对象析构类似
- 根据下标来对应，本地变量可以任意命名
- swap

    ```js
    let a = 1;
    let b = 2;
    [ a, b ] = [ b, a ];
    a;  // 2

    b;  // 1
    ```

- 嵌套

    ```js
    let colors = [ 'a', [ 'y', 'b' ], 'p' ];
    let [ firstC, [ secondC ] ] = colors;
    firstC;     // 'a'

    secondC;    // 'y'
    ```

- rest

    ```js
    let c = [ 'a', 'b', 'c' ];
    let [ first, ...restItems ] = c;
    let [...clonedC ] = c;
    restItems[0];   // 'b'

    clonedC;        // ["a", "b", "c"]

    // ES5

    c.concat();     // ["a", "b", "c"]

    c.slice();      // ["a", "b", "c"]
    ```

- 对象、数组混合析构
# 析构参数

    ```js
    // pattern 1

    function setCookie(name, value, options) {
        options = options || {};
        let secure = options.secure,
            path = options.path,
            domain = options.domain,
            expires = options.expires;
    }
    setCookie('type', 'js', {
        secure: true,
        expires: 60000
    });

    // 析构

    function setCookie(name, value, { secure, path, domain, expires = 4444 } = {}) {}
    setCookie('type', 'js', {
        secure: true,
        expires: 60000
    });
    ```