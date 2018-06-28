package main

import (
	"encoding/json"
	"fmt"
	"reflect"
)

type Employee struct {
	Name   string
	Number int
}

func main() {
	emp := Employee{Name: "2018/05/25 19:46:02.732", Number: 5454}
	e, err := json.Marshal(emp)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(e))
	fmt.Println("type:", reflect.TypeOf(emp))

}
