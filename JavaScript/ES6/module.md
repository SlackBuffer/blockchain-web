# 用 modules 封装代码
- ES6 以前，app 里所有的 js 文件共享一个全局作用域
- ES6 以前的社区方案
    - CommonJS，同步加载（硬盘读取的速度）；用于服务器
    - AMD，异步加载，模块的加载语句不影响后面语句的执行（不阻塞），依赖这个模块的语句定义在回调函数里，加载完成后执行回调函数；用于浏览器
- 模块和脚本的不同之处
    - 模块自动运行在严格模式，且无法退出严格模式
    - 定义在模块顶部的变量不会加到共享的全局总用于，只存在于模块的顶层作用域
    - 模块的顶层作用域的 `this` 是 `undefined`
    - 模块不允许 HTML 样式的注释
    - 模块可以引入来自其他模块的绑定
    - 导出模块供自身以外的其他代码使用
- 模块的优势在于可以只导出或引入需要的绑定
- CommonJS 和 AMD 都在运行时确定模块的依赖关系
- ES6 模块的设计思想是静态化，使得编译时就能确定模块的依赖关系并完成模块加载
## 基本的导出
- 用 `export` 暴露部分代码给其他模块

    ```js
    // example.js

    // 导出数据

    export var color = 'red';
    export let name = 'sb';
    export const n = 4;

    // 导出函数

    export function sum(a, b) {
        return a + b;
    }

    // 导出类

    export class Rectangle {
        constructor(length, width) {
            this.length = length;
            this.width = width;
        }
    }

    // 定义函数，随后导出

    function multiply(a, b) {
        return a * b;
    }
    export { multiply };

    function substract(a, b) {
        return a - b;
    }
    ```

    - 导出的函数和类需要有名字
        - 用此种方法无法导出匿名的函数或类，除非用 `default` 关键字
    - 不仅可以导出定义，也可以导出引用（`multiply`）
    - 未导出的方法（`substract`）为本模块私有，其他模块访问不到
- `export` 语句输出的接口与其对应的值是**动态绑定**的关系，可以通过该接口实时取到模块内部的值
    - CommonJS 模块输出的值是缓存，不会动态更新
## 基本的引入
- `import` 后接引入的标识符（identifiers），后接来源模块路径

    ```js
    import { identifier1, identifier2 } from './example.js';
    ```

    - `{}` 表示引入的绑定，形式像对象但不是对象
    - 模块路径要的文件扩展名 `.js` 可以省略
        - 模块路径要包括 `/`，`./`，或 `../` 以获得最好的兼容性
        - Node.js 里，`example` 表示包，`./examplejs` 表示本地文件
    - 如果只是模块名而不带路径，则必须配有配置文件告诉 JS 引擎该模块的位置
- 引入的绑定后的效果就像是用 `const` 声明了引入的变量
    - 不能再定义同名变量
    - 不能再引入来自其他模块的同名变量
    - 在 `import` 语句前使用该变量（tdz）（NCZ）
- `import` 命令具有提升效果，会提升到模块的头部首先执行（阮一峰）
    - 这种行为的本质是 `import` 命令在编译阶段执行，即在代码运行之前
- 由于 `import` 是静态执行，所以不能使用表达式和变量这些只有在运行时才能得到结果的语法结构
- `import` 命令输入的变量都是只读，它的本质是接口输入
    - 不允许在加载模块的脚步里改写接口
    - 接口（作为非整体引入的）的属性值可以修改，但难查错，不要这样做
- 引入一个模块的所有绑定

    ```js
    import * as example from './example.js';
    console.log(example.sum(1, 2));
    ```

    - 所有引用被载入一个对象，作为对象的属性实现访问
    - 这种形式称为名称空间引入（namespace import）
- 即使多次通过 `import` 引入同一个模块，该模块只会执行一次（Singleton 模式）
    - 引入模块的代码执行后，实例化的模块就保存在内存中，供其他的 `import` 语句复用

    ```js
    import { sum } from './example.js';
    import { multiply } from './example.js';
    ```

    - `example.js` 只执行一次，即同一个模块只实例化一次
- `import` 和 `export` 不能能在函数和其他语句内使用
    - 即不能动态引入模块，否则违背 ES6 模块静态优化的初衷
- Quirk

    ```js
    // module example.js

    export var name = 'sb';
    export function setName(newName) {
        name = newName;
    }

    // another js file

    import { name, setName } from './example.js';
    console.log(name);      // 'sb'

    setName('ho');
    console.log(name);      // 'ho'

    name = 'abc';           // error
    ```

## 重命名
- 用另一个名字导出

    ```js
    // example.js module

    function sum(a, b) {
        return a + b;
    }
    export { sum as add }

    // another module

    import { add } from './example.js';
    import { add as sum }  from './example.js';

    console.log(typeof add);    // 'undefined'

    console.log(sum(1, 2));     // 3
    ```

## 模块默认值（continue here）
- 使用 `import` 命令时需要知道要引入的绑定的名称，用 `default` 可以绕过这一点，为一个模块指定默认的导出
- 一个模块的默认值可以是一个变量，函数，类
- 一个模块只可以设置一个 `default`

    ```js
    // approach 1

    export default function (a, b) {
        return a + b;
    }

    // approach 2

    function sum(a, b) {
        return a + b;
    }
    export default sum;

    // approach 3

    function sum(a, b) {
        return a + b;
    }
    export { sum as default };
    ```

    - 方法 3 可以用一个 `export` 语句指定多个导出，包括 default 
- 引入默认绑定

    ```js
    // approach 1
    // example.js 只有一个导出
    // 引入并将其命名为 sum

    import sum from './example.js';

    // approach 2
    // example.js 有一个默认导出和 color 导出

    import sum, { color } from './example.js';

    // approach 3
    // 同上一种写法

    import { default as sum, color } from './example.js'
    ```

    - 默认绑定不加 `{}`
    - **第二种写法默认绑定必须放在非默认绑定前**
## 二次导出
- 将自身引入的绑定导出

    ```js
    // 1

    import { sum } from './eg.js';
    export { sum };

    // 2

    export { sum } from './eg.js';

    // 3

    export { sum as add } from './eg.js';

    // 4

    export * from './eg.js';
    ```

    - 二次导出所有时（4），`eg.js` 里的默认导出不包括在内，需要先显式导入，再显式导出
## 无绑定的导入
- 在一个模块里改变 `Array`，`Object` 等內建对象会反映到其他模块里

    ```js
    // example.js，一个没有导出或引入的模块
    // 既可当作模块，也可当作脚本

    Array.prototype.pushAll = function (items) {
        if (!Array.isArray(items) {
            throw new TypeError('Argument must be an array.');
        })
        return this.push(...items);
    };

    // 模块 2

    import './example.js';
    let c = ['a', 'b', 'c'];
    let items = [];
    items.pushAll(c);
    ```

    - 模块 2 引入的模块包含 `pushAll()` 方法，使得模块 2 的的数组都可以用 `pushAll()` 方法
- 无绑定导入的应用场景包括 polyfill，shims
## 载入模块
- ES6 只规定模块语法，抽象出加载机理到一个叫 `HostResolveImportedModule` 的内部操作，并未规定具体实现，不同的 JS 运行环境没有统一标准
### 浏览器里使用模块
- ES6 以前网页引入 js 的方式如下：
    - `<script src>` 引入外链脚本
    - `<script>` 引入内联脚本
    - 载入 js 以 workers 方式执行（web worker 或 service worker）
- 若要支持模块，以上 3 种引入机制都得更新
#### 用 `<script>` 
- `type` 加入 `module` 属性

    ```html
    <script type="module" src="module.js"></script>

    <script type="module">
        import { sum } from './example.js';
        let result = sum(1, 0);
        // result 在模块里，不在全局作用域里
    </script>
    ```

    - `"module"` 不像 `"text/javascript"` 一样时 content type
    - 作为模块的 js 文件和作为脚本的 js 的 content type 一样，无法通过 content type 来区分
        - 若浏览器不支持模块，则直接忽略整个 `<script>`，保证向后兼容性
- 模块里用 `import` 引入的文件必须加载好并执行完毕，该模块才能正确执行
- 为了支持这项功能，`<script type="module">` 表现为就像应用了 `defer` 属性
    - 对于模块而言，`defer` 属性总是被应用上（虽然没有显式写上）
- 加载机制
    - HTML 解析器遇到带有 `src` 属性的 `<script type="module">` 时会立即解析并下载依赖资源，但要等到整个文档解析完成后再执行
    - 模块之间可能相互引用，所以第一步是依次完全解析每一个模块来定位所有的 `import` 语句，每个 `import` 语句触发一个 fetch 操作（向网络或者缓存）
    - 各模块及其依赖资源都载入完毕后，模块（用 `<script type="module">` 显式声明的或是用 `import` 的）按照它们在文档中出现的顺序依次执行（不论是内联的还是外链的）
        - 第一个模块要等到所有模块及它的 `import` 资源都被下载并执行后再执行
#### 异步加载模块
- 无奇
#### 以 workers 形式加载模块
- 用时查即可
#### 浏览器模块 specifier
- 格式
    - 以 `/` 开头：根目录
    - 以 `./` 开头：当前目录
    - 以 `../` 开头：当前目录的父目录
    - URL 格式
        - 要跨域要确保配置好 CORS 头
- 用以上格式以外的格式都会抛错