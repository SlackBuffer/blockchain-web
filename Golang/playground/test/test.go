package abc

import (
	"encoding/json"
	"fmt"
	"runtime"
)

type Human struct {
	name   string
	age    int
	weight int
}

type Student struct {
	Human
	major string
}

func a() {
	h := &Human{
		name: "ho",
		age:  24,
	}
	b, err := json.Marshal(h)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(b))
	fmt.Println(h)
	/*
		// slice
		arr := [10]int{7: 1, 8: 2, 9: 3}
		fmt.Println(arr)

		s := arr[6:8:10]
		fmt.Println(cap(s))
		fmt.Println(s)

		s1 := s[:4]
		fmt.Println(s1)
	*/

	/*
		m := map[string]string{"5": "a", "4": "b", "3": "c", "2": "d", "1": "e"}
		s := make([]string, len(m))
		i := 0
		// map 是无序的，每次 for range 取出 key 的顺序不一致
		for k, _ := range m {
			fmt.Print(m[k]) // 次序不定
			s[i] = k
			i++
		}
		fmt.Println()

		// 实现对 map 中 key 的排序
		// 然后可以根据 key 有序地取出 map 的值
		sort.Strings(s)
		// fmt.Println(s)

		for i, length := 0, len(s); i < length; i++ {
			fmt.Print(m[s[i]])
		}
		fmt.Println()

		four, ok := m["4"]
		if ok {
			fmt.Println(four)
		}
	*/

	/*
		m := map[string]string{"5": "a", "4": "b", "3": "c", "2": "d", "1": "e"}
		for k, v := range m {
			fmt.Println(k, ": ", v)
		}
		s := make([]int, 3)
		for i, v := range s {
			fmt.Println(i, v)
		}
	*/
	/*
		s1 := Student{Human{"M", 25, 120}, "CS"}
		s2 := Student{Human: Human{"M", 25, 120}, major: "CS"}
		fmt.Println(s1, s2) */
	/*
		var x float64 = 3.4
		v := reflect.ValueOf(x)
		fmt.Println(v.Type(), v.Kind(), v.Float()) */
	/*
		go say("world") //开一个新的Goroutines执行
		say("hello")    //当前Goroutines执行 */

	/* 	c := make(chan int)
	   	quit := make(chan int)
	   	go func() {
	   		for i := 0; i < 10; i++ {
	   			fmt.Println(<-c)
	   		}
	   		quit <- 0
	   	}()
	   	fibonacci(c, quit)
	*/

	// fmt.Printf("%c\n", 'a'+1)

	/*
		a := 100

		go func(x, y int) {
			time.Sleep(time.Second * 4)
			println("go:", x, y)
		}(a, counter())

		a += 100
		println("main:", a, counter())
		time.Sleep(time.Second * 3)
	*/

	/*
		var wg sync.WaitGroup
		for i := 0; i < 10; i++ {
			wg.Add(1)
			go func(id int) {
				defer wg.Done()
				time.Sleep(time.Second * 4)
				println("goroutine", id, "done.")
			}(i)
		}
		println("main ...")
		wg.Wait()
		println("main exit.")
	*/

	/*
		var wg sync.WaitGroup

		go func() {
			wg.Add(1)
			println("hi")
		}()
		wg.Wait()
		println("exit.")
	*/

	/*
		var wg sync.WaitGroup
		wg.Add(1)

		go func() {
			wg.Wait()
			println("wait exit.")
		}()
		go func() {
			time.Sleep(time.Second * 1)
			println("done")
			wg.Done()
		}()
		wg.Wait()
		println("main exit")
	*/

	/*
		for i := 0; i < 2; i++ {
			go func(x int) {
				for n := 0; n < 2; n++ {
					fmt.Printf("%c: %d\n", 'a'+x, n)
					time.Sleep(time.Millisecond)
				}
			}(i)
		}
		runtime.Goexit()
		println("main exit.")
	*/

	/*
		var wg sync.WaitGroup
		ready := make(chan struct{})

		for i := 0; i < 3; i++ {
			wg.Add(1)
			go func(id int) {
				defer wg.Done()
				println(id, ": ready.")
				<-ready
				println(id, ": running...")
			}(i)
		}
		time.Sleep(time.Second * 2)
		println("Ready? Go!")
		close(ready)
		wg.Wait()
	*/
	/*
		var wg sync.WaitGroup
		wg.Add(2)
		c := make(chan int)
		var send chan<- int = c
		var recv <-chan int = c

		go func() {
			// defer wg.Done()
			for x := range recv {
				println(x)
			}
		}()

		go func() {
			defer wg.Done()
			defer close(c)

			for i := 0; i < 3; i++ {
				send <- i
			}
		}()
		wg.Wait()
	*/

	/* 	// Parse a time value from a string in the standard Unix format.
	   	t, err := time.Parse(time.UnixDate, "Sat Mar  7 11:06:39 PST 2015")
	   	if err != nil { // Always check errors even if they should not happen.
	   		panic(err)
	   	}

	   	// time.Time's Stringer method is useful without any format.
	   	fmt.Println("default format:", t)

	   	// Predefined constants in the package implement common layouts.
	   	fmt.Println("Unix format:", t.Format(time.UnixDate))

	   	// The time zone attached to the time value affects its output.
	   	fmt.Println("Same, in UTC:", t.UTC().Format(time.UnixDate))

	   	// The rest of this function demonstrates the properties of the
	   	// layout string used in the format.

	   	// The layout string used by the Parse function and Format method
	   	// shows by example how the reference time should be represented.
	   	// We stress that one must show how the reference time is formatted,
	   	// not a time of the user's choosing. Thus each layout string is a
	   	// representation of the time stamp,
	   	//	Jan 2 15:04:05 2006 MST
	   	// An easy way to remember this value is that it holds, when presented
	   	// in this order, the values (lined up with the elements above):
	   	//	  1 2  3  4  5    6  -7
	   	// There are some wrinkles illustrated below.

	   	// Most uses of Format and Parse use constant layout strings such as
	   	// the ones defined in this package, but the interface is flexible,
	   	// as these examples show.

	   	// Define a helper function to make the examples' output look nice.
	   	do := func(name, layout, want string) {
	   		got := t.Format(layout)
	   		if want != got {
	   			fmt.Printf("error: for %q got %q; expected %q\n", layout, got, want)
	   			return
	   		}
	   		fmt.Printf("%-15s %q gives %q\n", name, layout, got)
	   	}

	   	// Print a header in our output.
	   	fmt.Printf("\nFormats:\n\n")

	   	// A simple starter example.
	   	do("Basic", "Mon Jan 2 15:04:05 MST 2006", "Sat Mar 7 11:06:39 PST 2015")

	   	// For fixed-width printing of values, such as the date, that may be one or
	   	// two characters (7 vs. 07), use an _ instead of a space in the layout string.
	   	// Here we print just the day, which is 2 in our layout string and 7 in our
	   	// value.
	   	do("No pad", "<2>", "<7>")

	   	// An underscore represents a space pad, if the date only has one digit.
	   	do("Spaces", "<_2>", "< 7>")

	   	// A "0" indicates zero padding for single-digit values.
	   	do("Zeros", "<02>", "<07>")

	   	// If the value is already the right width, padding is not used.
	   	// For instance, the second (05 in the reference time) in our value is 39,
	   	// so it doesn't need padding, but the minutes (04, 06) does.
	   	do("Suppressed pad", "04:05", "06:39")

	   	// The predefined constant Unix uses an underscore to pad the day.
	   	// Compare with our simple starter example.
	   	do("Unix", time.UnixDate, "Sat Mar  7 11:06:39 PST 2015")

	   	// The hour of the reference time is 15, or 3PM. The layout can express
	   	// it either way, and since our value is the morning we should see it as
	   	// an AM time. We show both in one format string. Lower case too.
	   	do("AM/PM", "3PM==3pm==15h", "11AM==11am==11h")

	   	// When parsing, if the seconds value is followed by a decimal point
	   	// and some digits, that is taken as a fraction of a second even if
	   	// the layout string does not represent the fractional second.
	   	// Here we add a fractional second to our time value used above.
	   	t, err = time.Parse(time.UnixDate, "Sat Mar  7 11:06:39.1234 PST 2015")
	   	if err != nil {
	   		panic(err)
	   	}
	   	// It does not appear in the output if the layout string does not contain
	   	// a representation of the fractional second.
	   	do("No fraction", time.UnixDate, "Sat Mar  7 11:06:39 PST 2015")

	   	// Fractional seconds can be printed by adding a run of 0s or 9s after
	   	// a decimal point in the seconds value in the layout string.
	   	// If the layout digits are 0s, the fractional second is of the specified
	   	// width. Note that the output has a trailing zero.
	   	do("0s for fraction", "15:04:05.00000", "11:06:39.12340")

	   	// If the fraction in the layout is 9s, trailing zeros are dropped.
	   	do("9s for fraction", "15:04:05.99999999", "11:06:39.1234") */
}

var c int

func counter() int {
	c++
	return c
}

func say(s string) {
	for i := 0; i < 5; i++ {
		runtime.Gosched()
		fmt.Println(s)
	}
}

func fibonacci(c, quit chan int) {
	x, y := 1, 1
	for {
		select {
		case c <- x:
			x, y = y, x+y
		case <-quit:
			fmt.Println("quit")
			return
		}
	}
}
