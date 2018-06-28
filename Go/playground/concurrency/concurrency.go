package main

import (
	"fmt"
	"sync"
)

var c chan string

func main() {
	/*
		go Go()
		// main 函数睡眠后运行 Go() 的 goroutine 开始运行
		time.Sleep(2 * time.Second)
	*/

	/*
		c := make(chan bool)
		go func() {
			fmt.Println("go")
			c <- true
			close(c)
		}()
		// main 运行到此处就阻塞，等待将内容放入 c
		// <-c

		// c 有值了才能迭代
		for v := range c {
			fmt.Println(v)
		}
	*/

	/*
		runtime.GOMAXPROCS(runtime.NumCPU())
		c := make(chan bool, 10)
		for i := 0; i < 10; i++ {
			go Do(c, i)
		}

		for i := 0; i < 10; i++ {
			<-c
		}
	*/

	/*
		runtime.GOMAXPROCS(runtime.NumCPU())
		wg := sync.WaitGroup{}
		// 在任务数 10
		wg.Add(10)
		for i := 0; i < 10; i++ {
			go I(&wg, i)
		}
		wg.Wait()
	*/

	/*
		c1, c2 := make(chan int), make(chan string)
		o := make(chan bool, 2)
		go func() {
			// 无限循环
			for {
				select {
				case v, ok := <-c1:
					// channel 被关闭
					if !ok {
						o <- true
						break
					}
					fmt.Println("c1", v)
				case v, ok := <-c2:
					if !ok {
						o <- true
						break
					}
					fmt.Println("c2", v)
				}
			}
		}()

		c1 <- 1
		c2 <- "sb"
		c1 <- 3
		c2 <- "hi"

		close(c1)
		close(c2)

		// c1 和 c2 都关闭了程序才退出
		for i := 0; i < 2; i++ {
			<-o
		}
	*/

	/*
		c := make(chan int)
		go func() {
			for v := range c {
				fmt.Println(v)
			}
		}()
		for {
			select {
			case c <- 0:
			case c <- 1:
			}
		}
	*/

	/*
		c := make(chan bool)
		select {
		case v := <-c:
			fmt.Println(v)
		case <-time.After(3 * time.Second):
			fmt.Println("timeout")
		}
	*/
	/*
		c = make(chan string)
		go Pinpong()
		for i := 0; i < 10; i++ {
			c <- fmt.Sprintf("From main: hello, #%d", i)
			fmt.Println(<-c)
		} */

}

func Go() {
	fmt.Println("go go go")
}

func Do(c chan bool, index int) {
	a := 1
	for i := 0; i < 1000000; i++ {
		a += i
	}
	fmt.Println(index, a)
	c <- true
}

func I(wg *sync.WaitGroup, index int) {
	a := 1
	for i := 0; i < 1000000; i++ {
		a += i
	}
	fmt.Println(index, a)
	// 调用一次 Done 待完成的任务数就减 1
	wg.Done()
}

func Pinpong() {
	i := 0
	for {
		fmt.Println(<-c)
		c <- fmt.Sprintf("From Pingpong: hi, #%d", i)
		i++
	}
}
