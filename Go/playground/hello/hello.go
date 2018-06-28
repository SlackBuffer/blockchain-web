package main

import (
	"errors"
	"fmt"
	"time"
)

// B iota 与 << 实现计算机存储单位的枚举
const (
	B float64 = 1 << (iota * 10)
	KB
	MB
	GB
)

func div(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}

	return a / b, nil
}

func test(x int) func() { // 返回函数类型
	return func() { // 匿名函数
		println(x) // 闭包
	}
}

func test2(a, b int) {
	defer println("dispose...") // 常用来释放资源、解除锁定、执行清理操作，可定义多个 defer，按 FILO 顺序执行
	println(a / b)
}

type user struct {
	name string
	age  byte
}

type manager struct {
	user  // 匿名嵌入其他类型
	title string
}

// X hahaha
type X int

// 为 X 类型定义 inc() 方法
func (x *X) inc() { // 名称前的参数称为 receiver，总用类似 python self
	*x++
}

func (u user) ToString() string {
	return fmt.Sprintf("%+v", u)

}

func (u user) Print() {
	fmt.Printf("%+v\n", u)
}

// Printer what
type Printer interface { // 接口类型
	Print()
}

func task(id int) {
	for i := 0; i < 5; i++ {
		fmt.Printf("%d: %d\n", id, i)
		time.Sleep(time.Second)
	}
}

// 消费者
func consumer(data chan int, done chan bool) {
	for x := range data { // 接收数据，直到通道被关闭
		println("recv:", x)
	}
	done <- true // 通知 main 消费结束
}

func producer(data chan int) {
	for i := 0; i < 4; i++ {
		data <- i // 发送数据
	}
	close(data)
}

func main() {
	/*
		var x int32
		var s = 'h'
		var str = "hello, go"
		println(x, str) // 0 hello, go

		y := 100
		println(s, y) // 104 100

		print(s, "s") // 104s
	*/

	/*
		// for...range
		x := []int{100, 101, 102}
		for i, n := range x {
			println(i, ":", n)
		}
	*/

	/*
		a, b := 10, 2
		c, err := div(a, b)

		fmt.Println(c, err)
	*/

	/*
		x := 100
		f := test(x)
		f()
	*/

	// test2(1, 0)

	/*
		x := make([]int, 0, 5) // 创建容量为 5 的切片

		for i := 0; i < 8; i++ {
			x = append(x, i) // 超出容量限制时自动分配更大的存储空间
		}
		fmt.Println(x)
	*/

	/*
		m := make(map[string]int)
		m["a"] = 1
		x, ok := m["a"]	// 使用 ok-idiom 模式获取值，用于确定 key/value 是否存在
		fmt.Println(x, ok) // 1 true
		delete(m, "a")
	*/

	/*
		var m manager
		m.name = "Tom" // 直接访问匿名字段的成员
		m.age = 27
		m.title = "CTO"
		fmt.Println(m)
		println(m.ToString()) // 调用 user.ToString()

		var p Printer = m // 只要包含接口所需的的全部方法，即表示实现了该接口
		p.Print()
	*/

	/*
		var x X
		x.inc()
		println(x)
	*/

	/*
		go task(1) // 创建 goroutine
		go task(2)
		time.Sleep(time.Second * 6)
	*/

	/*
		done := make(chan bool) // 用于接收消费结束信号
		data := make(chan int)  // 数据管道
		go consumer(data, done) // 启动消费者
		go producer(data)       // 启动生产者
		<-done                  // 阻塞，直到消费者发回结束信号
	*/

	/*
		x := 100
		println(&x)
		x, y := 200, "abc"
		println(&x, x)
		println(y)
	*/

	/*
		var a = 65
		b := string(a)
		fmt.Println(b)

		c := strconv.Itoa(a)
		fmt.Println(c)

		a, _ = strconv.Atoi(c)
		fmt.Println(a)

	*/

	/*
		fmt.Println(MB)
	*/

	/*
		a := 1
		var p *int = &a
		fmt.Println(p)
		fmt.Println(*p)
	*/

	/*
		// 冒泡排序
		a := [...]int{5, 2, 6, 3, 9}

		for i, length := 0, len(a); i < length; i++ {
			for j := i + 1; j < length; j++ {
				if a[i] < a[j] {
					temp := a[i]
					a[i] = a[j]
					a[j] = temp
				}
			}
		}
		fmt.Println(a)
	*/

	/*
		a := [...]int{5, 2, 6, 3, 9}
		s1 := a[:]
		// s1 := s1
		fmt.Println(s1)
	*/

	/*
		sm := make([]map[int]string, 5)
		for i := range sm {
			sm[i] = make(map[int]string)
			sm[i][1] = "ok"
			fmt.Println(sm[i])
		}
		fmt.Println(sm)
	*/

	/*
		m := map[int]string{1: "a", 2: "b", 3: "c", 4: "d", 5: "e"}
		s := make([]int, len(m))
		i := 0
		// map 是无序的，每次 for range 取出 key 的顺序不一致
		for k, _ := range m {
			s[i] = k
			i++
		}
		// 实现对 map 中 key 的排序
		// 然后可以根据 key 有序地取出 map 的值
		sort.Ints(s)
		fmt.Println(s)
	*/

	/*
		m1 := map[int]string{1: "a", 2: "b", 3: "c", 4: "d", 5: "e"}
		m2 := make(map[string]int)
		for k, v := range m1 {
			m2[v] = k
		}
		fmt.Println(m2)
	*/

	// A(1, 2, 3, 4) // [1 2 3 4]

	/*
		a, b := 1, 2
		A(a, b)
		fmt.Println(a, b)
	*/

	/*
		s1 := []int{1, 2, 3, 4}
		C(s1)
		fmt.Println(s1)
	*/

	/*
		a := 1
		P(&a)
		fmt.Println(a)
	*/

	/*
		// a 是 F 的复制品
		a := F
		a()
	*/

	/*
		// 三次调用指向同一个 x 而不是值的拷贝
		f := closure(4)
		fmt.Println(f(4))
		fmt.Println(f(1))
	*/

	/*
		fmt.Println("a")
		defer fmt.Println("b")
		defer fmt.Println("c")

		for i := 0; i < 3; i++ {
			// defer fmt.Println(i)
			defer func() {
				fmt.Println(i)
			}()
		}
	*/

	F()
	G()
	H()

}

func A(a ...int) {
	a[0] = 5
	a[1] = 6
	fmt.Println(a)
}

// s 是 s1 内存地址的拷贝，不是直接传进一个指针
func C(s []int) {
	s[0] = 5
	s[1] = 6
	fmt.Println(s)
}

func P(a *int) {
	*a = 2
	fmt.Println(*a)
}

func F() {
	fmt.Println("func f")
}

func G() {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println("Recover in B")
		}
	}()
	panic("Panic in G")
}

func H() {
	fmt.Println("func in h")
}

func closure(x int) func(int) int {
	fmt.Printf("%p\n", &x)
	return func(y int) int {
		fmt.Printf("%p\n", &x)
		return x + y
	}
}
