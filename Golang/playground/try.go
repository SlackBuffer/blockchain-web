package main

import (
	"fmt"
	"regexp"
)

type human struct {
	age  int
	name string
}

type student struct {
	id int
	human
}

const (
	Password = `^\S{7,16}$`
)

func main() {
	// fmt.Println("abc")
	// hm := human{age: 2, name: "haha"}
	// std := student{human: hm, id: 123}
	// fmt.Println(std)

	// fmt.Println((wrapper()))

	password := "123456789"
	if ok, _ := regexp.Match(Password, []byte(password)); !ok {
		fmt.Println("invalid")
	}
	fmt.Println("ok")
}

func wrapper() []student {
	hms := [2]human{}
	stds := make([]student, len(hms))
	hms[0] = human{age: 2, name: "haha"}
	hms[1] = human{age: 23, name: "cccc"}
	stds[0] = student{human: hms[0], id: 123}
	stds[1] = student{human: hms[1], id: 456}
	fmt.Println(stds)

	return stds
}
