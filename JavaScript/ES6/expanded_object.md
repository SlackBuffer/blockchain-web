- 对象类别
    1. 普通对象：拥有所有 JS 对象的默认内部行为
    2. 外来对象：内部行为不同于默认行为
    3. 标准对象：由 ES6 定义，如 `Array`，`Date`；标准对象可以是普通对象或是外来对象
    4. 內建（build-in）对象：一段脚本开始执行后，存在于 JS 执行环境中；所有普通对象都是內建对象
- 对象属性初始化的简写

    ```js
    // es5
    function createPerson(name, age) {
        return {
            name: name,
            age: age
        };
    }
    // es6
    function createPerson(name, age) {
        return {
            name,
            age
        };
    }
    ```

- 对象字面量方法的简练写法（concise methods）

    ```js
    // es5
    var person = {
        sayHi: function () {
            console.log('hi');
        }
    };
    // es6
    var person = {
        sayHi() {
            console.log('hi');
        }
    };
    ```

    - es6 的写法的方法可以用 `super`
- computed property name

    ```js
    var suffix = ' name';
    var person = {
        ['first' + suffix]: 's',
        ['last' + suffix]: 'b'
    };
    console.log(person['first name']);  // 's'
    ```

# `Object.assign()`
- mixins：一个对象得到其它对象的方法和属性

    ```js
    function mixin(receiver, supplier) {
        Object.keys(supplier).forEach(function (key) {
            receiver[key] = supplier[key];
        });
    }
    ```

    - 浅拷贝
    - receiver 不通过继承的方式获得 supplier 的属性
- `Object.assign()` 实现和 mixins 一样的功能
- `Object.assign(receiverObj, supplierObj1,supplierObj2)`
    - 后面的 supplier 会覆盖前面的 supplier 的属性值
- Keep in mind that `Object.assign()` doesn’t create accessor properties on the receiver when a supplier has accessor properties. Since `Object.assign()` uses the assignment operator, an accessor property on a supplier will become a data property on the receiver. For 

    ```js
    var receiver = {};
    var supplier = {
        get name() {
            return 'file.js'
        }
    };
    Object.assign(receiver, supplier);
    var descriptor = Object.getOwnPropertyDescriptor(receiver, 'name');
    console.log(descriptor.value);      // file.js
    console.log(descriptor.get);        // undefined
    ```

    - `receiver.name` exists as a data property with a value of "file.js" because `supplier.name` returned "file.js" when `Object.assign()` was called
- `Object.is()`

    ```js
    +0 === -0;              // true
    Object.is(+0, -0);      // false
    NaN === NaN;            // false
    Object.is(NaN, NaN);    // false
    ```

- ES6 允许对象的属性重名，重名属性值取最后被赋予的那个
- ES5 未定义对象属性的枚举顺序，由各个 js 引擎厂家自行实现
- ES6 严格规定了对象属性的枚举顺序
    1. 数字键名，从小到大枚举
    2. 字符串键名，按加入到对象的顺序枚举
    3. symbol 键名，按加入到对象的顺序枚举
    - `Object.getOwnPropertyNames()` 和 `Reflect.ownKeys` 遵循规定
    - `for-in` 仍按照未指定的顺序枚举，因为各 js 引擎的实现方式不同
    - `Object.keys()` 和 `JSON.stringify()` 使用的也是未指定的枚举顺序
- `Object.setProptotypeOf()` 方法可以修改任意对象的 prototype
    - 第一个参数是要改 prototype 的一个对象
    - 第二个参数是变成第一个对象的 prototype 的一个对象
    - > `Object.getProptotypeOf()` 得到一个对象的 prototype
- 可以通过 `super` 去访问 prototype 上的功能
    - `super` 引用的指向不是动态的，总是指向正确的对象
    - super 只能在 concise methods 里使用
    - ES5 用 `Object.getPrototypeOf(this)` 去实现，但多重继承时会有问题
- 定义在对象里的方法有一个内部属性 `[[HomeObect]]`，值是拥有该方法的对象
    - 一个函数创建时若不是一个对象的方法，则没有 `[[HomeObject]]` 属性
    - `super` 第一步会去调用 `Object.getPrototypeOf([[HomeObject]])` 获得 prototype 的引用；在 prototype 上查找指定的方法；`this` 绑定后调用该方法