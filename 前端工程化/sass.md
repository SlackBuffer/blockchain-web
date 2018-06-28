- [安装](http://sass-lang.com/install)
- [指南](http://sass-lang.com/guide)
- `sass input.scss output.css`
- 语法

    ```scss
    $font-stack:    Helvetica, sans-serif;
    $primary-color: #333;

    body {
        font: 100% $font-stack;
        color: $primary-color;
    }
    ```

- 嵌套

    ```scss
    nav {
        ul {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        li { display: inline-block; }

        a {
            display: block;
            padding: 6px 12px;
            text-decoration: none;
        }
    }
    ```

- 碎片文件
    - 有助于模块化
    - 文件名以 `_` 起头，如 `_partial.scss`
    - 用 `@import` 引入
- 引入
    - `@import` 把被引入的文件 scss 文件和引入者本身合并并输出一个 css 文件
        - `@import` 引入是 `_` 和扩展名都不需要写
    - 纯 css 每一个 `@import` 都会发送一个 HTTP 请求

    ```scss
    // _reset.scss

    html,
    body,
    ul,
    ol {
        margin:  0;
        padding: 0;
    }

    // base.scss

    @import 'reset';

    body {
        font: 100% Helvetica, sans-serif;
        background-color: #efefef;
    }
    ```

- 混入（mixins）
    - `@mixin` 起头
    - 引用时用 `@include`

    ```scss
    @mixin border-radius($radius) {
        -webkit-border-radius: $radius;
        -moz-border-radius: $radius;
        -ms-border-radius: $radius;
        border-radius: $radius;
    }

    .box { @include border-radius(10px); }
    ```

- 扩展/继承
    - ***placeholder classes***: 没被扩展就不会出现在目标 css 文件里
    - 待复刷
- 操作符
    - `+`, `-`, `*`, `/`, `%`