# 常用命令
- `go env`
- `go get` 获取远程包
- `go run` 直接运行程序
    - 生成临时文件在命令行运行
- `go build` 测试编译，检查是否有编译错误
    - 若 package 为 `main` 的文件会生成可执行文件；非 `main` 的不会生成可执行文件
- `go install` 编译包文件并编译整个程序
    - 生成的可执行文件要放到项目根目录下运行
- `godoc -http=:8080`
# 基础
- 只有 package 为 `main` 的包可以包含 `main` 函数
- 一个可执行程序有且只能有一个 `main` 包
- `package` 必须放在非注释的第一行
- `import . "fmt"` 在调用时可以省略包名，不建议使用
- [ ] `Printf`
- [ ] 全局变量和一般变量声明不一样吗？`var`，`type`
- [ ] `_`

    ```go
    var fs = [4]func(){}

	for i := 0; i < 4; i++ {
		defer fmt.Println("defer i = ", i)
		defer func() { fmt.Println("defer_closure i = ", i) }()
		fs[i] = func() { fmt.Println("closure i = ", i) }
	}

	// 怎么知道何时要用 _
	for _, f := range fs {
		f()
	}
    ```

- [ ] `if`

    ```go
    if pc, ok := usb.(PhoneConnecter); ok {
		fmt.Println("Disconnected:", pc.name)
		return
	}
    ```

- `var` 组可以声明全局变量，也可以在函数体中使用
- 全局变量可以使用 `var` 组进行简写
- 全局变量不可省略 `var`，可以使用并行方式
- 局部变量可以省略 `var` 关键字；可以使用并行方式
# 类型
- bool 只能是 `true` 或 `false`，不能用数字代表
    - 不能和整形进行转换
- 整型（`int`/`uint`）
- `byte` 是 `uint8` 的别名；`rune` 是 `int32` 的别名
- Go 有复数类型 `complex64`/`complex128`；足够保存指针的 32 位或 64 位整数型 `uintptr`
- 复合类型：`array`，`struct`，`string`
- 引用类型：`slice`，`map`，`chan`
- 函数类型：`func`
- 类型零值
    - 值类型为 0；bool 为 `false`；`string` 为空字符串；引用类型为 `nil`
- `math.MaxInt32`
- 在定义常量组时，若不提供初始值，则表达式将使用上行的表达式（常量初始化规则）
    - 要使用常量初始化规则，两行的常量个数要相同    
- `iota`
    - 常量计数器，从 0 开始，在一个常量组中每定义 1 个常量自动递增 1
    - 每遇到一个 `const` 关键字时 `iota` 重置为 0
    - >（[11:30] 常量的枚举）
- `iota` 与 `<<` 实现计算机存储单位的枚举

    ```go
    const (
        B float64 = 1 << (iota * 10)
        KB
        MB
        GB
    )
    ```

- Go 中的运算符均是从左到右结合
- 指针默认值为 `nil`
- 自增自减是语句而不是表达式；只能放变量右边
# 控制语句
- 在 `if` 的条件语句两边加上括号不会报错，但在 `gofmt` 时会自动清除
- `if`，`for`，`switch` 语句的初始化变量的作用域范围都是局部的
- `for` 
    - `for` 循环中声明的变量在每次循环结束都会消失，作用域只在当次循环
- `switch` 
    - 可以使用任何类型或表达式作为条件语句
    - 不需要写 `break`，一旦条件符合自动终止
    - 若希望执行下一个 case，需写 `fallthrough` 
    - 初始化表达式写在 `switch` 里的话右侧需跟分号
- `break`，`continue`，`goto` 均可带标签
    - 标签名区分大小写
# 数组
- `var <varName> [n]<type>`（n >= 0）

    ```go
    var a [2]int
    a := [2]int{}
    a := [2]int{1, 2}
    a := [20]int{19: 1}
    a := [...]int{1, 2, 3, 4}
    a := [...]int{19: 1}
    ```

- Go 的数组时定长的
- 数组长度也是数组类型的一部分，具有不同长度的数组为不同的类型
- 指针数组

    ```go
    x, y := 1, 2
    a := [...]*int{&x, &y}  // 保存的元素是指向 int 的指针
    ```

    - 指向数组的指针

        ```go
        a := [...]int{99: 1}
        var p *[100]int = &a
        fmt.Println(p)  // 相当于打印 a
        ```

- 数组是值类型，可以用 `==` 和 `!=` 进行比较，但不可以使用 `<` 和 `>`
- `new` 可以用来创建数组，返回一个指向数组的指针

    ```go
    p := new([10]int)
    fmt.Println(p)  // 打印出数组元素
    ```

- 支持多维数组

    ```go
    a := [...][3]int{
        {1: 1},
        {2: 2}
    }
    ```

    - 只有顶级数组的元素个数可以使用 `...`
# 切片
- 通过函数调用修改 slice 的要将修改后的 slice 通过返回值返回来，否则超容量后就是新的一个 slice 了，调用者处的 slice 却还是老的
- 切片本身不是数组，指向底层数组
- 切片是变长数组的替代方案，可以关联底层数组的部分或全部
- 是引用类型
    - 若多个 `slice` 指向同一个底层数组，其中一个的值改变会影响全部
- 可以直接创建或从底层数组生成
- 使用 `len()` 获取元素个数， `cap()` 获取容量
- 一般使用 `make()` 创建切片

    ```go
    var s1 []int    // 空 slice，[] 没有数字或 ...

    a := [10]int{1, 2, 3, 4, 5, 6, 7, 8, 9}
    s1 := a[5:10]   
    s1 := a[5:]   
    s1 := a[:5]   
    s1 := a
    s1 := a[:]

    // 第二个参数指示 slice 包含的元素个数
    // 第三个参数指示 slice 的初始容量；超过初始容量后，会重新分配内存（内存大小为之前的 2 倍）
    s1 := make([]int, 3, 10)
    fmt.Println(len(s1), cap(s1))

    a := []byte{'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'}
    sa := a[2:5]
    // slcie 指向连续内存块（数组就是连续的内存块），容量就是达到连续内存块的尾部
    fmt.Println(len(sa), cap(sa))   // 3 9
    sb :=[3:5]
    fmt.Println(string(sa)) // cde
    fmt.Println(string(sb)) // fg
    ```

    - reslice 时索引以被 slice 的下标为准，而不是以原数组为准
    - reslice 索引不可以超过被 slice 的在切边的容量，越界不好导致底层数组的重新分配而是抛错
- slice 容量未设置，则容量未当前元素的个数
- `append` 可以在 slice 尾部追加元素

    ```go
    s1 += make([], 3, 6)
    fmt.Printf("%p\n", s1)
    s1 = append(s1, 1, 2, 3)
    fmt.Printf("%v %p\n", s1, s1)
    s1 = append(s1, 1, 2, 3)
    fmt.Printf("%v %p\n", s1, s1)   // 内存地址改变
    ```

    - 可以将一个 slice 追加到另一个 slice 的尾部
    - 若最终程度为超过被 `append` 的 slice 的容量，返回原始 slice
    - 若超过，则重新分配数组并将数据拷贝过去
- `copy()`

    ```go
    s1 := []int{1, 2, 3, 4, 5, 6}
    s2 := []int{7, 8, 9}
    // 截断拷贝
    copy(s2, s1)
    copy(s2[2:4], s1[1:3])
    ```

# `map`
- `key` 必须是支持 `==` 或 `!=` 比较运算的类型，不可使用函数、`map` 或 `slice`
- `map` 查找比线性搜索块，比使用索引访问数据的类型慢 100 倍
- `map` 使用 `make()` 创建，支持 `:=` 简写
    - `make([keyType]valueType, cap)`
    - `cap` 表容量，可省略；超出容量会自动扩容

    ```go
    var m map[int]string
    m = map[int]string{}        // 1
    m = make(map[int]string)    // 2

    var m map[int]string = make(map[int]string)

    m := make(map[int]string)

    m[1] = "ok"
    delete(m, 1)

    var m map[int]map[int]string
    m = make(map[int]map[int]string)
    m[1] = make(map[int]string)
    m[1][1] = "ok"
    a, ok := m[2][1]
    if !ok {
        m[2] = make(map[int]string)
        a[2][1] = "good"
    }
    a = m[2][1]

    // i 是索引，v 是 slice 值的副本
    // 类似于 forEach
    for i, v := range slice {

    }

    // v 也是副本
    for k, v := range map {

    }

    // 元素为为 map 类型的 slice
    sm := make([]map[int]string, 5)
    for i := range sm {

    }
    ```

- 使用 `len()` 获取元素个数
- 键值对不存在时自动添加，使用 `delete` 删除键值对
- 使用 `for range` 对 `map` 和 `slice` 进行迭代操作
- 存在嵌套的 `map` 时每一级的 `map` 都要单独初始化，否则会出现运行时错误
# 函数
- Go 函数不支持嵌套、重载和默认参数
- Go 函数无需声明原型就可直接使用（在函数的定义代码之前使用），支持不定长度变参、多返回值、命名返回值参数、匿名函数、闭包
- 函数可以作为一种类型使用
- 定义

    ```go
    // 没有返回值第二个括号可不写
    // 只有一个返回值第二个括号可省略
    func A(a int, b string) (int, string, int) {}
    func A(a int, b string) {}
    func A(a int, b string) int {}
    // a, b, c 都是 int 型；返回值也可以简写
    func A(a, b, c int) {}
    func A()(int, int, int) {
        a, b, c := 1, 2, 3
        return a, b, c
    }
    // 这里不需要 :=，a，b，c 在执行赋值语句之前就已经存在
    func A()(a, b, c int) {
        a, b, c = 1, 2, 3
        // 此时不写返回的参数名也可以
        // 但考虑到可读性建议写上
        return         
    }

    // 不定长变参（只能放最后）
    // a 在接受一系列参数后变成了 slice
    func A(a ...int) {
        fmt.Println(a)
    }
    ```

- 基本变量的值拷贝和 slice 的指针地址拷贝（并非传递指针）本质上都是拷贝传递
- Go 语言中一切皆类型
- 匿名函数不可以是最外层函数
- `defer`
    - 在函数体执行结束后（`main()` 函数 `return` 后）按照调用顺序的相反顺序执行（类似其它语言的析构函数）
        - 先进后出，后进先出
    - 函数发生严重错误也会执行
        - 发生严重错误时正常函数就不会执行了
        - 类似于 `try-catch` 中的 `finally`，无论任何情况都会执行
    - 常用语资源清理、文件关闭、解锁以及记录事件等操作
    - 支持匿名函数的调用
    - 与匿名函数配合可在 `return` 之后修改函数结果
    - 若函数体内的某个变量作为 `defer` 时的匿名函数的参数，则在定义 `defer` 时即已获得拷贝；直接在匿名函数体内使用某个局部变量则是引用该变量的地址
- Go 没有异常机制，有 `panic`/`recover` 模式来处理错误
- `panic` 可以在任何地方引发，`recover` 只有在 `defer` 调用的函数中有效
    - `recover` 将程序从 panic 状态恢复回来
    - `panic` 后程序非 `defer` 的程序都会终止执行
# `struct`
- Go 没有继承
- `type<Name> struct{}`
- `struct` 是值类型
- 给 `struct` 初始化时推荐使用取地址符号
    - 取 `struct` 值得时候无需加 `*`
- 匿名字段
    - 初始化的顺序要和类型对应得上
- 同类型（类型名相同，非内容相同） `struct` 可以赋值，判断是否相同
- 使用组合实现继承
- 嵌入结构是匿名字段，Go 将结构名称作为字段名称
    - 嵌入结构的字段会给到外层结构，通过 `.` 去读写（简便读写）
    - 同层存在同名字段时不能简写
- 匿名结构的字段和外层结构存在同名字段，外层的同名字段优先，嵌套的匿名结构的字段靠后
# `method`
- 通过显式说明 receiver 来实现与某个类型的组合
- receiver 可以是类型的值或指针
- 编译器通过接受者的类型判断是哪个类型的方法
- 不存在方法重载
- 可以使用值或指针（不用带 `*`）来调用方法，编译器会自动完成转换
- 方法可以看做是函数的语法糖（method expression）
- 只能为同一个包中的类型定义方法
    - 所以无法为内置类型（如 `int`）绑定方法
    - 类型别名改的指示名称，被别名的类型的底层方法不会附带过来，只会带过来一些基本的属性
    - 可通过类型别名来绑定方法
    - 使用方法绑定可以为任何一种 `type` 定义的类型结合方法
- 方法可以访问到结构的私有字段
# `interface`
- 接口是一个或多个方法签名的集合，只有方法的声明，没有实现，也没有数据字段
- 只要某个类型拥有某个接口的所有方法签名，就算实现了该接口，无须显式声明实现了具体哪个接口（称为 structural typing）
- Go 的所有接口都实现了空接口
    - type switch
    - 空接口可以作为任何数据类型的容器
- 接口调用不会做 receiver 的自动转换（带 `*` 和不带 `*` 有区别）
    - 方法集
    - 指针 receiver 的方法集包含了非指针（值拷贝） receiver 的方法集
- 接口支持匿名字段方法
- 接口可以实现类似 OOP 中的多态
- 接口转换只允许拥有超集的接口转成子集的接口
    - 方法签名多的转成方法签名少的
- 将对象赋值给接口时，会发生拷贝，接口内部存储的是指向这个复制品的指针
- 只有当接口存储的类型和对象都为 `nil` 时，接口才为 `nil`
# reflection
- 反射使用 `TypeOf` 和 `ValueOf` 函数从接口中获取目标对象信息
- 可以利用反射修改对象状态
    - 前提是 `interface.data` 是 `settable`，即 pointer-interface
- 可以利用反射动态调用方法
# 并发 concurrency
- `goroutine` 是官方实现的超级线程池
    - 每个实例的栈内存为 4-5k
    - 可以动态增减
    - 实现机制是标记清除
    - 降低了销毁和创建 `goroutine` 的开销
- 并发主要由切换时间片让人产生同时运行的错觉；并行（parallelism）直接利用多核实现多线程的运行
- Go 可以设置使用核数
- `goroutine` 通过通信来共享内存，而不是共享内存来通信
- channel 是 `goroutine` 之间沟通的桥梁，大都是阻塞（同步）的
- 通过 `make` 创建，`close` 关闭
- `main` 函数退出后未执行的 `goroutine` 也会被迫退出
- channel 是引用类型
- 可以使用 `for range` 来不断操作 channel
- channel 可以设置单向或双向通道
- 可以为每个 channel 设置缓存大小，在未被填满之前不会发生阻塞
- `select` 可处理一个或多个 channel 的发送与接收
- 同时有多个可用的 channel 时按随机顺序处理
- 可用空 `select` 阻塞 `main` 函数
    - 空 `select` 既没有发送也没有接收任务指令
- `select` 可以设置超时
# 流程

- > [Go 编程基础](https://golangcaff.com/docs/go-fundamental-programming/explain/167)