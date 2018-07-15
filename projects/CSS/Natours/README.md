- clip-path code generator
    - http://bennettfeely.com/clippy/
- relative size
    - font: 相对于父元素
    - length (height, padding, margin 等)：相对于父元素的 **`width`**
    - **font-based**
        1. em (font)：相对于父元素的 font-size
        2. em (lengths)：相对于**自身**的 font-size
        3. rem：相对于 root font-size
- cascade and specificity
    - importance > specificity > source order
        - importance
            1. user `!important` declarations
            2. author `!important` declarations
            3. author declarations
            4. user declarations
            5. default browser declarations
        - specificity
            1. inline styles
            2. ids
            3. classes, **pseudo-classes**, attribute
            4. elements, **pseudo-elements**
        - source order
            - 最后写的那个会被应用
    - `!important` 不得已再用
    - 1 个 id 比 1000 个 class 都具体；1 个 class 比 1000 个 element 都具体
    - **依赖具体性而不要依赖顺序**
- how css values ae processed
    1. declared value (author declarations)
    2. cascaded value (after the cascade)
    3. specified value (defaulting, if there is no cascaded value)
    4. computed value (converting relative values to absolute)
    5. user value (final calculations, based on layout)
    6. actual value (browser and device restrictions)
- inheritance
    - 每个 css 属性都有 initial value
        - 可继承属性在开发者、用户和浏览器都未指定值，且没有发生继承时才会用到初始值
        - 不可继承属性在未指定值时被设置为初始值
    - 继承仅在未给属性指定值时才生效
    - 继承的是 **computed value**（不是 declared value）
    - 可以用 `inherit` 关键字强制继承
    - `initial` 关键字可用来将属性重置回初始值