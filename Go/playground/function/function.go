package main

import (
	"fmt"
)

func main() {
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
}
