package main

import "fmt"

/* type USB interface {
	Name() string
	Connect()
} */

// 嵌入接口
type USB interface {
	Name() string
	Connecter
}

type Connecter interface {
	Connect()
}

// PhoneConnecter 实现了 USB 接口（有接口里的所有方法）
type PhoneConnecter struct {
	name string
}

// 为 PhoneConnecter 添加 Name() 方法
func (pc PhoneConnecter) Name() string {
	return pc.name
}

// 为 PhoneConnecter 添加 Connect() 方法
func (pc PhoneConnecter) Connect() {
	fmt.Println("Connected:", pc.name)
}

func main() {
	/*
		// a 是接口
		var a USB
		// PhoneConnecter 实现了 USB 接口，所以可以赋值给 a、可以传给 Disconnect
		a = PhoneConnecter{"PhoneConnecter"}
		a.Connect()
		Disconnect(a)
	*/

	/*
		// 接口转换
		pc := PhoneConnecter{"PhoneConnecter"}
		var a Connecter
		// a 拿到的是 pc 的复制品
		a = Connecter(pc)
		a.Connect() // 转换后 a 不存在 Name() 方法

		pc.name = "pc"
		a.Connect()
	*/

	// 此处 a 存了一个 nil
	var a interface{}
	fmt.Println(a == nil)

	var p *int = nil
	// 此时 a 存了一个指向 nil 的指针，即 a 存储的类型不是 nil
	a = p
	fmt.Println(a == nil)
}

/*
// 要求传入实现了 USB 接口的变量
func Disconnect(usb USB) {
	// 类型断言
	// 判断是否是 PhoneConnecter
	if pc, ok := usb.(PhoneConnecter); ok {
		fmt.Println("Disconnected:", pc.name)
		return
	}
	fmt.Println("Unknown device")
}
*/

// type switch
func Disconnect(usb interface{}) {
	switch v := usb.(type) {
	case PhoneConnecter:
		fmt.Println("Disconnected:", v.name)
	default:
		fmt.Println("Unknown device")
	}
}
