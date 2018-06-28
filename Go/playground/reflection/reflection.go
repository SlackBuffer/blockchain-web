package main

import (
	"fmt"
	"reflect"
)

type User struct {
	Id   int
	Name string
	Age  int
}

// 反射将匿名字段当独立字段处理
type Manger struct {
	User  // 相当于 User User
	title string
}

func (u User) Hello() {
	fmt.Println("hello world")
}

func main() {
	/*
		u := User{1, "OK", 12}
		// u 以值拷贝的形式传入
		Info(u)
	*/

	/*
		m := Manger{User: User{1, "OK", 12}, title: "abc"}
		t := reflect.TypeOf(m)

		// 取匿名字段 User
		fmt.Printf("%#v\n", t.Field(0))
		fmt.Printf("%#v\n", t.Field(1))

		// User 相对于 Manage 的索引为 0，Id 相对于 User 的索引为 0
		fmt.Printf("%#v\n", t.FieldByIndex([]int{0, 0}))
	*/

	/*
		// 修改基本类型值
		x := 123
		v := reflect.ValueOf(&x)
		v.Elem().SetInt(99)
		fmt.Println(x)
	*/

	/*
		u := User{1, "ok", 12}
		Set(&u)
		fmt.Println(u)
	*/

	u := User{1, "slack", 12}
	u.Hi("ho")
	v := reflect.ValueOf(u)
	mv := v.MethodByName("Hi")

	args := []reflect.Value{reflect.ValueOf("bufer")}
	mv.Call(args)
}

func Info(o interface{}) {
	t := reflect.TypeOf(o)
	fmt.Println("Type:", t.Name())

	// 传入的类型不对时这样处理（ Info(&u) ）
	if k := t.Kind(); k != reflect.Struct {
		fmt.Println("XXX")
		return
	}

	v := reflect.ValueOf(o)
	fmt.Println("Fields:")

	for i := 0; i < t.NumField(); i++ {
		f := t.Field(i)
		val := v.Field(i).Interface()
		fmt.Printf("%6s: %v = %v\n", f.Name, f.Type, val)
	}

	for i := 0; i < t.NumMethod(); i++ {
		m := t.Method(i)
		fmt.Printf("%6s: %v\n", m.Name, m.Type)
	}
}

func Set(o interface{}) {
	v := reflect.ValueOf(o)

	if v.Kind() == reflect.Ptr && !v.Elem().CanSet() {
		fmt.Println("XXX")
		return
	} else {
		v = v.Elem()
	}

	/* if f := v.FieldByName("Name"); f.Kind() == reflect.String {
		f.SetString("HO")
	} */

	f := v.FieldByName("Name")
	if !f.IsValid() {
		fmt.Println("BAD")
		return
	}

	if f.Kind() == reflect.String {
		f.SetString("HO")
	}
}

func (u User) Hi(name string) {
	fmt.Println("hello", name, ", my name is", u.Name)
}
