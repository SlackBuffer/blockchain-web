# 结构
- `GOPATH` 允许多个目录，多个目录的时候 Windows 下分隔符是是分号，Linux 系统是冒号，当有多个 `GOPATH` 时，默认会将 `go get` 的内容放在第一个目录下
- 新建应用或者一个代码包时都是在 `src` 目录下新建一个文件夹，文件夹名称一般是代码包名称，允许多级目录
    - 在 `src` 下面新建了目录 `$GOPATH/src/github.com/astaxie/beedb`，包路径就是 `"github.com/astaxie/beedb"`，包名称是最后一个目录 `beedb`
    - 建议 `package` 的名称和目录名保持一致
    - `package` 是 `main` 代表可执行应用，是其他名称代表应用包
- 安装
    - 方法 1. 进入对应的应用包目录，执行 `go install`
    - 方法 2. 在任意目录执行 `go install packageName`
    - 编译完成后生产 `.a` 的应用包
- 调用
    - `import` 自定义包的路径相对于 `$GOPATH/src` 
    - 若是多级目录，就在 `import` 里面引入多级目录
    - 若存在多个 `GOPATH`，Go会自动在多个 `$GOPATH/src` 中寻找
- 编译
    - 进入应用目录执行 `go build`
- `go get`
    - 通过这个命令可以获取相应的源码，对应的开源平台采用不同的源码控制工具，例如github 采用 `git`，googlecode 采用 `hg`，要想获取这些源码，必须先安装相应的源码控制工具
    - `go get` 本质上可以理解为首先通过源码工具 clone 代码到 src 下面，然后执行 `go install`
    - 使用远程只要在开头 `import` 相应的路径就可以
    - `go get -u` 参数可以自动更新包
    - `go get` 时会自动获取该包依赖的其他第三方包
- bin 目录下面存的是编译之后的可执行文件，pkg 下面存放的是应用包，src 下面保存的是应用源代码
# 命令
- `go build`
    - 用于编译代码。在包的编译过程中，若有需要，会同时编译与之相关联的包
    - 执行 `go build` 会编译当前目录下的所有 go 文件
        - 编译指定文件只需加上文件名v
    - `main` 包执行 `go build` 会在当前目录生成可执行文件
        - 执行 `go install` 会在 `$PATH/pkg` 目录下生成名为 `main` 的可执行文件
        - `go build -o ../../../bin/call`
    - 普通包执行 `go build` 不会生成任何文件
        - 用 `go install` 会在 pkg 下生成相应文件
    - `go build -o specifiedName` 指定编译输出的文件名。默认情况是 package 名(非 main 包)，或是第一个源文件的文件名( main 包)
    - package 名在 Go 语言规范中指代码中 `package` 后使用的名称，此名称可以与文件夹名不同，默认生成的可执行文件名是文件夹名
    - `go build` 会忽略目录下以 `_` 或 `.` 开头的 go 文件
    - `go build` 会选择性地编译以系统名结尾的文件（Linux、Darwin、Windows、Freebsd），例如 Linux 系统下编译只会选择 array_linux.go 文件，其它系统命名后缀文件全部忽略
    - 这个命令内部实际上分成了两步操作：第一步生成结果文件(可执行文件或者 `.a` 包)，第二步会把编译好的结果移到 `$GOPATH/pkg`或者 `$GOPATH/bin`
- `go clean`
    - 是用来移除当前源码包和关联源码包里面编译生成的文件
- `go fmt fileName.go`
- `go test`
    - 自动读取源码目录下面名为 `*_test.go` 的文件，生成并运行测试用的可执行文件
- `godoc`
    - `godoc builtin`，`godoc net/http`，`godoc fmt Printf`
    - `godoc -http=:8080`
- `go version`, `go env`, `go list`（列出当前安装的 package）, `go run`（编译运行 go 程序）
# 基础
- go 程序通过 `package` 组织
- `package <pkgName>` 指示当前文件所属包；包名为 `main 说明这是一个可独立运行的包，编译后会产生可执行文件；除了 `main` 包外，其它的包生成 `*.a` 文件（即包文件）并放置在 `$GOPATH/pkg/$GOOS_$GOARCH` 中（Mac 上是 `$GOPATH/pkg/darwin_amd64`）
- 每一个可独立运行的 go 程序，必定包含一个 `package main`，`main` 包中必定包含一个入口函数 `main`（`main.main()`），此函数既没有参数也没有返回值
- 字符串用一对双引号 `""` 或反引号 \`\` 括起来
    - 字符串不可变

        ```go
        s := "string"
        s[0] = `a`  // 抛错

        // 这样改
        c := []byte(s)
        c[0] = "a"
        s2 = string(c)
        ```

    - 可以使用 `+` 操作符连接两个字符串
    - \`\` 用来声明多行字符串，打印出 Raw 的形式
- 同一行的 iota 值相等
## 数组
- 长度是数组类型的一部分
- 数组不能改变长度
- 数组是值类型
- 数组作为函数参数传入的是副本
## slice 
- 声明数组时，方括号内写明数组的长度或使用 `...` 自动计算长度;声明 `slice` 时，方括号内没有任何字符
- 从概念上面来说 slice 像一个包含了三个元素结构体
    1. 一个指针，指向数组中 slice 指定的起始位置
    2. 长度，即 slice 的长度
    3. 最大长度，也就是 slice 开始位置到数组的最后位置的长度
    - > ![slice](https://raw.githubusercontent.com/astaxie/build-web-application-with-golang/master/zh/images/2.2.slice2.png)
- slice 可以访问到 `len()` 范围内的内容，访问 `len()` 以外 `cap()` 以内的部分会报错
    - 一个 slice 的 `len()` 以外 `cap()` 以内的内容可以被另一个 slice 访问到

    ```go
    arr := [10]int{7: 1, 8: 2, 9: 3}
	fmt.Println(arr)

	s := arr[6:8:10]
	fmt.Println(cap(s))
	fmt.Println(s)

	s1 := s[:4]
	fmt.Println(s1)
    ```

- 内置函数：`len`，`cap`，`append`，`copy`
- `append` 时若 slice 中没有剩余空间（`(cap-len) == 0`），将动态分配新的数组空间（原空间的两倍），返回的 slice 数组指针将指向新分配地址
- 3 参数 slice

    ```go
    slice = arr[2:4:7]  // cap() 是 7 - 2  = 5
    ```

## map
- `map[keyType]valueType`
- slice 的 key 只能是 `int` 型；map 的 key 可以是 `int`，`string` 以及所有完全定义了 `==`与 `!=` 操作的类型
- map 是引用类型，长度不固定
- `len` 返回 map 拥有的 key 的数量
- map 不是thread-safe，在多个 go-routine 存取时，必须使用 mutex lock 机制
- map 无序，每次打印出来的 map 键值对顺序会不同

    ```go
    m := map[string]string{"5": "a", "4": "b", "3": "c", "2": "d", "1": "e"}
	s := make([]string, len(m))
    i := 0
    
	for k, _ := range m {
		fmt.Print(m[k]) // 次序不定
		s[i] = k
		i++
	}
	fmt.Println()

	sort.Strings(s)
	// fmt.Println(s)

	for i, length := 0, len(s); i < length; i++ {
		fmt.Print(m[s[i]])  // 有序
	}
    fmt.Println()
    
    four, ok := m["4"]
    if ok {
        fmt.Println("4 is here")
    }
    ```

    - map 内置有判断是否存在 key 的机制
- `delete(mapName, keyName)`
- `new(T)` 分配了**零值填充**的 T 类型的内存空间，并且返回其地址（一个 `*T` 类型的值），即 `new` 返回指针
- `make(T, args)` 只能创建 `slice`、`map` 或 `channel`，返回一个有初始值（非零）的 T 类型，而不是 `*T`
    - 指向数据结构的引用在使用前必须被初始化，如 slice 是一个包含指向 array 的指针、长度和容量的三项描述符，在这些项目被初始化之前，slice 为 `nil`
    - `make` 初始化了内部的数据结构，填充以适当的值（`args`）
## 流程
- `if`
    - 条件判断语句里面允许声明一个变量，该变量的作用域是该条件逻辑块范围

    ```go
    if x := computedValue(); x > 10 {
        fmt.Println("x is greater than 10")
    ```

- `goto` 只能跳转到当前函数内定义的标签
- go 没有 `,` 操作符，可用平行赋值代替
- `for range` 可用于读取 slice 和 map 的数据
- go 支持多返回值，可以使用 `_` 来丢弃不需要的返回值
- `switch` 没有表达式时会匹配 `true`
    - 一个 `case` 可以写多个值，逗号隔开
- 传到函数里的参数都是原值的拷贝，不过有值拷贝和指针拷贝之分
    - 传进去的指针变量（副本）和原件指向同一块内存
- channel，slice，map 的实现机制类似指针，传参时传入变量名即是传入了指针
- `defer` 后进先出
- go 中函数也是一种变量，可以通过 `type` 来定义，它的类型就是所有拥有相同的参数、相同的返回值的一种函数
    - 函数作为类型后可以把此类型的函数当作参数来传递
- `panic`
    - 中断原有的控制流程，进入一个 panic 流程中
    - 函数 `F` 调用 `panic`，函数 `F` 的执行被中断，`F` 中的延迟函数会正常执行，然后 `F` 返回到调用它的地方；在调用的地方，`F` 的行为就像调用了 `panic`；这一过程继续向上，直到发生 `panic` 的 `goroutine` 中所有调用的函数返回，然后程序退出
    - panic 可以直接调用 `panic` 产生，也可由运行时错误产生，例如访问数组越界
- `recover`
    - 让进入令人 panic 流程的 `goroutine` 恢复过来；
    - 仅在延迟函数中有效
    - 在正常的执行过程中，调用 `recover` 会返回 `nil`，并且没有其它任何效果
    - 若当前 `goroutine` 陷入 panic，调用 `recover` 可以捕获到 panic 的输入值，并且恢复正常的执行
- 一个 `package` 可以写任意多个 `init` 函数，但建议只写一个
- go 会自动调用 `init()` 和 `main()` 函数
- `main` 包若还导入了其他包，则会在编译时一次导入
- 一个包若被多个包同时导入，它只会被导入一次
- 当一个包被导入时，如果该包还导入了其它的包，那么会先将其它包导入进来，然后再对这些包中的包级常量和变量进行初始化，接着执行 `init` 函数（如果有的话），依次类推。等所有被导入的包都加载完毕了，就会开始对 `main` 包中的包级常量和变量进行初始化，然后执行 `main` 包中的 `init` 函数（如果存在的话），最后执行`main`函数
    - > ![](https://raw.githubusercontent.com/astaxie/build-web-application-with-golang/master/zh/images/2.3.init.png)
- `import` 
    1. 标准库去 `GOROOT` 环境变量指定目录去加载该模块
    2. 相对路径（bad)
    3. 绝对路径
        - `import "shorturl/model"` 加载 `GOPATH/src/shoruturl/model` 模块

    ```go
    import (
        _ "github.com/ziutek/mymysql/godrv"
    )
    ```

    - 不使用包里的函数，只调用包里的 `init` 函数
## struct
- `struct` 作为嵌入的匿名字段时，它的全部字段都被隐式嵌入，嵌套着可以像访问自身字段一样访问嵌入 `struct` 的字段（继承）
- 初始化

    ```go
    s1 := Student{Human{"M", 25, 120}, "CS"}
    s2 := Student{Human: Human{"M", 25, 120}, major: "CS"}
    ```

- 自定义类型、内置类型都可以作为匿名字段
## method
- `method` 是附属在一个给定的类型上，声明时在 `func` 后增加一个 receiver（即 method 所依从的主体）
- `func (r ReceiverType) funcName(parameters) (results)`
- `method` 名字相同、接受者不同，`method` 就是不同的
- `method` 可以访问接受者的字段
- 方法的 receiver 是以值传递的
- `method` 可以定义在任何自定义类型、内置类型上
- 若一个 `method` 的 `receiver`（调用者，拥有者）是 `*T` ,可以直接在一个 `T` 类型的实例变量 `V` 上面调用这个 `method`，而不需要用 `&V` 去调用这个 `method`
- 若一个 `method` 的 `receiver` 是 `T`，可以直接在一个 `*T` 类型的变量 `P` 上面调用这个 `method`，而不需要用 `*P` 去调用这个 `method`
- 若匿名字段实现了一个 `method`，包含这个你名字段的 `struct` 也能调用该 `method`
## interface
- `interface` 是一组 `method` 签名的组合，通过 `interface` 定义对象的一组行为
- 若某个对象实现了某个接口的所有方法，就称此对象实现了此接口，称该对象是该 `interface` 类型
    - `interface` 可以被任意的对象实现
    - 一个对象可以实现任意多个接口
- 任意类型都实现了空接口 `interface{}`
- 空接口在需要存储任意类型的数值时有用
    - 一个函数把 `interface{}` 作为参数，它就可以接受任意类型的值作为参数
    - 返回值同理

    ```go
    var a interface{}
    ```

- 一个 `interface` 的变量里可以存放实现该 `interface` 的任意类型的对象实例
- `interface` 是一组抽象方法的集合，它必须由非 `interface` 类型实现而不能自实现，可以通过接口调用方法
    - duct-typing
- 若需要某个类型能被 `fmt` 包以特殊的格式输出，必须实现 `Stringer` 这个接口，若没有实现这个接口，`fmt` 将以默认的方式输出

    ```go
    type Stringer interface {
        String() string     // [ ] what is the string here
    }
    ```   

- 确定 `interface` 变量里存储的类型
    1. comma-ok 断言（`value, ok := element.(T)`）
    2. switch
        - > [link](https://github.com/astaxie/build-web-application-with-golang/blob/master/zh/02.6.md)
- 一个 `interface1` 作为 `interface2` 的一个嵌入字段，那么 `interface2` 隐式的包含了 `interface1` 里面的 `method`
## [ ] 反射
- 反射能检查程序在运行时的状态
- 要去反射一个类型的值，首先要把它转化成 `reflect` 对象（`reflect.type` 或 `reflect.Value`）

    ```go
    t := reflect.Typeof(i)  

    v := reflect.ValueOf(i)

    tag := t.Elem().Field(0).Tag    
    name := v.Elem().Field(0).String()  

    var x float64 = 3.4
    p := reflect.ValueOf(&x)    // 传 x 会报错
    v := p.Elem()
    v.SetFloat(7.1)
    ```

- > [The laws of reflection](https://blog.golang.org/laws-of-reflection)
## 并发
- `go` 并非执行并发操作，而是创建一个并发任务单元，新建的任务被放置在系统队列中，等待调度器安排合适系统线程去获取执行权；当前流程不会阻塞，不会等待该任务启动，且运行时也不保证并发任务的执行次序
- `defer` 向**当前函数**注册稍后执行的函数调用，这些调用直到当前函数执行结束前才被执行
- 用 `time.Sleep(time.second)` 让 goroutine 在 main 逻辑之后执行
- 可在多出使用 `Wait` 阻塞，都能接收到通知（顺序？）
- `Gocached` 暂停，释放线程去执行其他任务，当前任务被放回队列，等待下次调度时恢复执行
    - 很少使用，运行时会主动向长时间运行（10 ms）的任务发出抢占调度
- `Goexit` 立即终止当前任务，运行时确保所有已注册的延迟调用被执行，不会影响其他并发任务，不会引发 `panic`，无法捕获
    - 在 `main.main` 里调用 `Goexit`，它会等待其他任务结束，然后让进程直接崩溃
    - 无论位于哪一层，`Goexit` 立即终止整个调用栈
    - `os.Exit` 可终止进程且不执行延迟调用
- 通道是一个队列。同步模式下，发送和接收双方配对，然后直接复制数据给对方。若配对失败，则置入等待队列，知道另一方出现后才被唤醒
    - 通道是显式的，操作双方必须知道数据类型和具体通道，并不关心另一端操作者身份和数量
    - 若另一端未准备妥当，或消息未能及时处理时，会发生阻塞
- 同步模式必须有配对的 goroutine 出现，否则会一直阻塞
- 异步模式在缓冲区未满或数据读完前不会阻塞
- 通道常被用作传递消息（数据）和事件通知
    - 关闭通道、写入数据均可解除阻塞
- 缓冲区大小仅是内部属性，不是类型的组成部分
- 通道变量本身就是指针，可用相等操作符判断是否为同一对象或 `nil`
- `cap` 和 `len` 返回缓冲区大小和当前已缓冲数量
    - 同步通道都返回 0 
- 向已关闭通道发送数据引发 panic
- 重复关闭或关闭 `nil` 通道会引发 panic
- 从已关闭通道接收数据，返回已缓冲数据或零值
- 无论收发，`nil` 通道都会阻塞
- 单向通道

    ```go
    c := make(chan int)
    var send chan<- int = c
    var recv <-chan int = c
    ```

    - 不能在单向通道上做逆操作
    - `close` 不能用于接收端
    - 无法将单向通道转回双向
- [ ] 每个 goroutine 都需要 `defer wg.Done()`？
- `select` 语句可以同时处理多个通道，随机选择一个可用通道做收发操作
---
- goroutine 是通过 go 的 runtime 管理的一个线程管理器
- 通过 `go` 关键字实现
- goroutine 运行在相同的地址空间
- goroutine 之间通过 channel 通信
- channel 通过 `<-` 来接收和发送数据

    ```go
    ch := make(chan int)
    ch <- v // 发送 v 到 channel ch
    v := <- ch  // 从 ch 接收数据
    ```

- 默认情况，channel 接收和发送数据是阻塞的
    - 读取操作是阻塞的，直到接收到数据才不阻塞
    - 发送操作是阻塞的，直到数据被读出
- `ch := make(chan type, value)`
    - `value` 为 0 时，channel 无缓冲阻塞读写
    - `value` 大于 0 时，channel 有缓冲、非阻塞，直到写满 `value` 个元素才阻塞写入
    - `ch:= make(chan bool, 4)` 创建可以存储 4 个元素的 `bool` 型 channel，前 4 个元素可以无阻塞的写入，当写入第5个元素时，代码将会阻塞，直到其他 goroutine 从 channel 中读取一些元素以腾出空间
- 可以通过 `for-range` 操作缓存型的 channel
    - `for i := range c` 能够不断的读取 channel 里面的数据，直到该 channel 被显式的关闭
    - 消费方可以通过语法 `v, ok := <-ch` 测试 channel 是否被关闭
    - 应在生产者处关闭 channel，消费处关闭 channel 容易引起 panic
- 可以通过 `select` 设置超时
# Web 基础
- `ListenAndServe` 初始化一个 `server` 对象，然后调用了 `net.Listen("tcp", addr)`，即底层用 TCP 协议搭建一个服务，监控设置的端口

