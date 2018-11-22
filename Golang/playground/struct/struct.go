package main

import (
	"fmt"
)

type person struct {
	Name    string
	Age     int
	Contact struct {
		Phone, City string
	}
}

// 匿名字段
type p struct {
	string
	int
}

type human struct {
	Sex int
}

// human 是匿名字段，要将结构名称作为字段名称
// 嵌入结构的字段会给到外层结构
type teacher struct {
	human
	Name string
	Age  int
}

type student struct {
	human
	Name string
	Age  int
}

func main() {
	/*
		a := person{}
		a.Name = "sb"
		a.Age = 28
		fmt.Println(a)

		b := person{
			Name: "ho",
			Age:  24,
		}
		A(&b)
		fmt.Println(b)
	*/

	/*
		a := &person{
			Name: "sb",
			Age:  18,
		}
		a.Contact.Phone = "12345678"
		a.Contact.City = "NY"
		// 这里不需要写 *a.name，Go 提供了便利
		A(a)
		a.Name = "slack"
		fmt.Println(a)
	*/

	/*
		// 匿名结构
		a := &struct {
			Name string
			Age  int
		}{
			Name: "ho",
			Age:  23,
		}
		fmt.Println(a)
	*/

	/*
		c := &p{"sb", 27}
		fmt.Println(c)
	*/

	a := teacher{Name: "sb", Age: 19, human: human{Sex: 1}}
	b := student{Name: "ho", Age: 20}
	a.human.Sex = 100
	b.Sex = 10
	fmt.Println(a, b)
}

func A(per *person) {
	per.Age = 13
	fmt.Println("A", per)
}
