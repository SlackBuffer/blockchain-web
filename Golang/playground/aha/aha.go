package main

import (
	"fmt"
)

func main() {

	/*
		t := time.Now()
		fmt.Println(t.Format(time.ANSIC))
	*/

	s := []string{"a", "b", "c"}
	// 引用了 v 的地址
	// 最后地址都变成了 "c" 的地址
	for _, v := range s {
		go func() {
			fmt.Println(v)
		}()
	}
	select {}
}
