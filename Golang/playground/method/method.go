package main

import (
	"fmt"
)

type A struct {
	Name string
}

type B struct {
	Name string
}

type TZ int

type I int

func main() {
	/*
		a := A{}
		// 同样不需要通过 *a.Print() 来调用
		a.Print() // 调用后 a.Name 才被改掉；A 的其它实例的 Name 不受影响
		fmt.Println(a.Name)

		c := A{}
		fmt.Println(c.Name)

		b := B{}
		b.Print()
		fmt.Println(b.Name)
	*/

	/*
		var a TZ
		a.Print()       // method value
		(*TZ).Print(&a) // method expression
	*/

	var a I
	a.Increase(100)
	fmt.Println(a)
	a.Increase1(I(100))
	fmt.Println(a)
}

func (x *A) Print() {
	x.Name = "AA"
	fmt.Println("A")
}

func (y B) Print() {
	y.Name = "BB"
	fmt.Println("B")
}

// receiver 是 TZ 的指针类型
func (a *TZ) Print() {
	fmt.Println("TZ")
}

func (a *I) Increase(num int) {
	*a += I(num)
}

func (a *I) Increase1(num I) {
	*a += num
}
