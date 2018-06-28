- “类”

    ```js
    // creating a custom type

    function PersonType(name) {
        this.name = name;
    }
    PersonType.prototype.sayName = function() {
        console.log(this.name);
    };
    let person = new PersonType("Nicholas");
    person.sayName();   // outputs "Nicholas"

    console.log(person instanceof PersonType);  // true

    console.log(person instanceof Object);      // true

    // class declaration

    class PersonClass {
        // equivalent of the PersonType constructor

        constructor(name) {
            this.name = name;
        }
        // equivalent of the PersonType.proptotype.sayName

        sayName() {
            console.log(this.name);
        }
    }
    let person = new PersonClass("Nicholas");
    person.sayName();   // outputs "Nicholas"

    console.log(person instanceof PersonClass);     // true

    console.log(person instanceof Object);          // true

    console.log(typeof PersonClass);                    // "function"

    console.log(typeof PersonClass.prototype.sayName);  // "function"

    // class expression

    let PersonClass = class {
        constructor(name) {
            this.name = name;
        }
        sayName() {
            console.log(this.name);
        }
    }
    // named class expression

    let PersonClass = class PersonClass2 {
        constructor(name) {
            this.name = name;
        }
        sayName() {
            console.log(this.name);
        }
    }
    console.log(typeof PersonClass);        // "function"
    console.log(typeof PersonClass2);       // "undefined"
    ```

    - 实例属性（own properties）可以在 `constructor` 或成员函数里创建
    - `class` 写法只是 custom type 的语法糖
    - `class` 的类型是 "function"
    - class 写法和 custom type 写法可以混用
    - 命名的类表达式只在类的内部（定义类的代码里）能被访问到，类的外部访问不到
- 要点
    - `class` 声明和 class 表达式都不会被提升，表现得就像用 `let` 声明的效果一样
    - `class` 里的代码自动运行在严格模式
    - 类里的所有方法不可枚举
        - custom type 的方法需要显式调用 `Object.defineProperty()` 才会不可枚举
    - 类里的方法不可用 `new` 调用，会抛错
    - 不用 `new` 调用 class 会抛错
    - 在类的方法里重写类名会抛错
    - 建议把类的所有实例属性放在 `constructor` 里
- 一等公民：可以被当作值使用，如传入函数，作为函数返回值，赋值给变量
    - 方法和类都是一等公民
- 利用类的表达式创建单例

    ```js
    let person = new Class {
        constructor(name) {
            this.name = name;
        }
        sayName() {
            console.log(this.name);
        }
    }('sb');
    person.sayName();   // 'sb'
    ```

- 在类的 prototype 上定义类的访问器属性

    ```js
    class CustomHTMLElement {
        constructor(element) {
            this.element = element;
        }
        get html() {
            return this.element.innerHTML;
        }
        set html(value) {
            this.element.innerHTML = value;
        }
    }
    var descriptor = Object.getOwnPropertyDescriptor(CusomHTMLElement.prototype, 'html');
    console.log("get" in descriptor);   // true
    console.log("set" in descriptor);   // true
    console.log(descriptor.enumerable); // false
    ```

- 类的成员变量的属性名可以用变量 `[propertyName]`
- 静态成员
    - 静态方法不需要依赖实例来获取自己的数据
    - 实例成员访问不到静态成员，必须直接通过类访问

    ```js
    // es5 通过在构造函数上加方法得到静态成员
    function PersonType(name) {
        this.name = name;
    }
    // static method
    PersonType.create = function (name) {
        return new PersonType(name);
    };
    var person = PersonType.create('sb');

    // es6
    class PersonClass {
        constructor(name) {
            this.name = name;
        }
        static create(name) {
            return new PersonClass(name);
        }
    }
    let person = PersonClass.create('sb');
    ```

- 派生类的继承
    - 从其它继承的类称为派生类

    ```js
    // es5
    function Rectangle(length, width) {
        this.length = length;
        this.width = width;
    }
    Rectangle.prototype.getArea = function () {
        return this.length * this.width;
    }
    function Square(length) {
        Rectangle.call(this, length, length);
    }
    Square.prototype = Object.create(Rectangle.prototype, {
        constructor: {
            value: Square,
            enumerable: true,
            writable: true,
            configurable: true
        }
    });
    var sq = new Square(3);
    console.log(square.getArea());              // 9
    console.log(square instanceof Square);      // true
    console.log(square instanceof Rectangle);   // true    
    // es6
    class Rectangle {
        constructor(length, width) {
            this.length = length;
            this.width = width;
        }
        getArea() {
            return this.length * this.width;
        }
    }
    class Square extends Rectangle {
        constructor(length) {
            super(length, length)
        }
    }
    var square = new Square(3);
    console.log(square.getArea());              // 9
    console.log(square instanceof Square);      // true
    console.log(square instanceof Rectangle);   // true
    ```

    - `extends` 指定从何处继承
    - `prototype` 自动修正
    - 通过 `super()` 访问到父类的**构造函数**、传入参数
        - `super(args)` 等价于 `Father.call(this, args)`
- 派生类若指定了 `constructor` 则必须在 `constructor` 里写 `super()`
    - 若派生类没有指定 `constructor`，`super()` 也会被自动调用，新建实例时按顺序传入所有参数

    ```js
    class Square extends Rectangle { /*no constructor*/}
    // equivalent to 
    class Square extends Rectangle {
        constructor(...args) {
            super(...args);
        }
    }
    ```

- `super()`
    - 只有派生类（使用了 `extends` 的类）才可以使用 `super()`，非派生类和方法使用 `super()` 会抛错
    - `super()` 负责初始化 `this`，必须在调用 `super()` 之后才能访问 `this`
    - 避免 `super()` 的调用的唯一方法是在类的 `constructor` 里返回一个对象
- 派生类上的方法会屏蔽父类上的同名方法
    - 用 `super.foo()` 指定调用父类上的方法
- 派生类也可以访问到父类的静态成员
- ES6 允许对任何（一个类派生自）可以解析为一个函数，并有 `[[Construct]]` 和 `prototype` 的表达式使用 `extends`
- 继承內建类型

    ```js
    // built-in array behavior
    var colors = [];
    colors[0] = 'red';
    console.log(colors.length);     // 1
    colors.length = 0;
    console.log(colors[0]);         // undefined

    // es5 classical inheritance
    function MyArray() {
        Array.apply(this, arguments);
    }
    MyArray.prototype = Object.create(Array.prototype, {
        constructor: {
            value: MyArray,
            writable: true,
            configurable: true,
            enumerable: true
        }
    });
    var colors = new MyArray();
    colors[0] = 'red';
    console.log(colors.length);     // 0

    // class-based
    class MyArray extends Array {}
    var colors = new MyArray();
    colors[0] = 'red';
    console.log(colors.length);     // 1
    colors.length = 0;
    console.log(colors[0]);         // undefined
    ```

    - ES5 的 classical inheritance 的 `this` 被派生类创建，指向派生类的实例，再修饰以父类的属性
    - ES6 基于类的继承，`this` 先是指向父类，再被派生类的 `constructor` 修饰，使得 `this` 一开始就得到了父类的所有內建属性 
- [ ] generator methods
- [ ] `Symbol.species` 
- [ ] `new.target`