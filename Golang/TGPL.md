<!-- The Go Programming Language -->
# Tips
- Package structure
    - The source code for a package resides in one or more `.go` files, usually in a **directory** whose name ends with the import path
        - `gopl.io/ch1/helloworld` package are stored in directory `$GOPATH/src/gopl.io/ch1/helloworld`
    - A package consists of one or more `.go` source files in a single directory that define what the package does
    - Each package serves as a separate name space for its declarations
        - Within the `image` package, the identifier `Decode` refers to a different ***function*** than does the same identifier in the `unicode/utf16` package
    - Package `main` defines a standalone executable program, not a library
    - By convention, we describe each package in a comment immediately preceding its package declaration  
    - Package names are always in lower case
- Source file structure
    - Each source file begins with a `package` declaration that states which package the file belongs to, followed by a list of other packages that it imports
    - The `import` declarations must follow the `package` declaration
    - By convention, we describe each package in a comment immediately preceding its package declaration
        - The `doc comment` immediately preceding the package declaration documents the package as a whole. Only one file in each package should have a package doc comment
        - Extensive doc comments are often placed in a file of their own, conventionally called `doc.go`
    - Functions and other package-level entities may be declared ***in any order***
- Declarations
    - A declaration names a program entity and specifies some or all of its property
    - A declaration associates a name with a program entity, such a function or a variable    
    - A `var` declaration tends to be reserved for local variables that need an explicit type that differs from that of the initializer expression - [ ], or for when the variable will be assigned a value later and its initial value is unimportant
    - Short variable declarations are used within a function only, not for package-level variables
        - Declarations with multiple initializer expressions should be used only when they help readability (such as for short and natural groupings like initialization part of a `for` loop)
        - **`:=` is a declaration, `=` is an assignment**
        - > <mark>tuple assignment: `i, j = j, i` swaps values of `i` and `j`</mark>
        - A short variable declaration **must declare at least one new variable**
            - If some of variables in a short variable declaration were already declared **in the same lexical block**, then, for those variables, the short variable declaration acts like an **assignment**
            - A short variable declaration acts like an assignment only to variables that were already in the same lexical scope; declarations in an outer block are ignored
    - Declare a `string` variable
        1. `s := ""`
            - Can be used only within a function, not for package-level variables
        2. `var s string`
            - relies on default initialization to the zero value
        3. `var s = ""`
            - rarely used except when declaring multiple variables
        4. `var s string = ""`
            - explicit about the variable's type
            - redundant when variable type is the same as that of the initial value
            - necessary when they are not of the same type
- `new`
    - `new(T)` creates an **unnamed** variable of type `T`, initializes it to the zero value of `T`, and returns its **address**, which is a value of type `*T` (此处 `*T` 是指存放类型为 `T` 的变量的地址的指针类型变量，不是取变量 `T` 的值)
        
        ```go
        p := new(int)   // p, of type *int, points to an unnamed int variable
        fmt.Println(*p) // "0"
        *p = 2          // sets the unnamed int to 2
        fmt.Println(*p) // "2"
        var q *int = new(int)
        fmt.Println(*q) // "0"
        ````

    - A variable created with `new` is no different from an ordinary local variable whose address is taken, except that there's no need to invent (and declare) a dummy name
    - Thus the `new` is only a syntactic convenience
    - Each call to `new` returns a distinct variable with a unique address
        - One exception: two variables whose type carries no information and is therefore of size zero, such as `struct{}` or `[0]int`, may, depending on the implementation, have the same address
- Type declarations
    - A `type` declaration defines a new **named type** that has the same underlying types as an existing type - `type name underlying-type`
    - The underlying type of a named type determines its structure and representation, and also the set of intrinsic operations it supports, which are the same as if the underlying type had been used directly
    - Type declarations most often appear at package level, where the named type is **visible** throughout the package, and if the name is exported (it starts with an upper-case letter), it’s accessible from other packages as well
    - The named type provides a way to separate different and perhaps incompatible uses of the underlying types so that they can't be mixed unintentionally
        - Even though `Celsius` and `Fahrenheit` have the same underlying type, they are not the same type, so they cannot be be compared or combined in arithmetic expressions
        - Distinguishing the types makes it possible to avoid errors like inadvertently combining temperatures in the 2 different scales
        - An explicit type conversion like `Celsius(t)` or `Fahrenheit(t)` is required to convert from a `float64`. 
        - `Celsius(t)` and  `Fahrenheit(t)` are conversions, not function calls. They don't change the value or representation in any way, but they make the change of meaning explicit
    - Comparison operators like `==` and `<` can also be used to compare a value of a named type to another of the same type, or to a **value** of the underlying type
    - Named types also make it possible to define new behaviors for values of the type. These behaviors are expressed as a set of functions associated with the type, called the type's methods - `func (c Celsius) String() string { return fmt.Sprintf("%g°C", c) }`
        - The `Celsius` parameter `c` appears before the function name, associate with the `Celsius` type a method named `String` that returns `c`'s numeric value followed by °C
        - `func String() string { ... }` is the method associated with `Celsius` type
        - > Many types declare a `String` method of this form because it controls how values of the type appear when printed as a string by the `fmt` package
- Type conversions
    - For every type `T`, there's a corresponding conversion operation `T(x)` that converts the value `x` to type `T`
    - A conversion from one type to another type is allowed if **both have the same underlying type**, or if both are **unnamed pointer** types (created with `new`) that point to variables of the same underlying type
    - Conversions are allowed between numeric types, and between string and some slice types. These conversions **may change** the representation of the value
        - Converting a floating-point number to an integer discards any fractional part
        - Converting a string to a `[]byte` slice allocates a copy of the string data
- Initialization
    - One package is initialized at a time, in the order of imports in the program, **dependencies first**
    - Package initialization begins by initializing package-level variables in the order in which they are declared, except that **dependencies are resolved first**
    - If the package has multiple `.go` files, they are initialized in the order in which the files are given to the compiler
        - The `go` tool sorts `.go` files by name before invoking the compiler
    - Each variable declared at package level starts life with the value of its initializer expression, if any
    - For some variables (like table of data), an initializer expression may not be the simplest way to set its initial value. In that case, the `init` function mechanism may be simpler
        - Such `init` function can't be called or referenced, but otherwise they are normal functions
        - Within each file, `init` functions are automatically executed when the program starts, **in the order** in which they are declared
        - Initialization proceeds from the **bottom up**; the `main` package is the last to be initialized
    - Package-level variables are initialized **before `main` begins**
    - Local variables are initialized as their declarations are encountered during function execution
- Imports
    - Within a Go program, every package is identified by a unique string called *import path*. These are the strings that appear in an `import` declaration like `"gopl.io/ch2/tempconv"`
    - By convention, a package's name matches the last segment of its import path
    - An import declaration may specify an alternative name to avoid conflicts
- Scope, visibility
    - The scope of a declaration is the part of the source code where a use of the declared name refers to the declaration
    - A *syntactic block* is a sequence of statements enclosed in braces like those that surround the body of a function or a loop
        - A name declared inside a syntactic block is not visible outside that block, the block encloses its declarations and determines their scope
    - The scope of a declaration is a region of the program text; it's a compile-time property
        - The lifetime of a variable is the range of time during the execution when the variable can be referred to by other parts of the program; it's a run-time property
    - *Lexical block*: other groupings of declarations that are not explicitly surrounded by braces
        - Universe block: a lexical block for the entire source code
            - The declarations of built-in types, functions, and constants like `int`, `len`, `true` are in the universe block and can be referred throughout the entire program        
        - There's a lexical block for each package; for each file; for each `for`, `if`, and `switch` statement; for each case in a `switch` or `select` statement; for each explicit syntactic block
        -  `for` loops, `if` statements, and `switch` statements create implicit blocks **in addition to their body blocks**
            - The `for` loop creates 2 lexical blocks: the explicit block `for` the loop body, and an implicit block that additionally encloses the variables declared by the initialization clause.  The scope of a variable declared in the implicit block is the condition, post-statement(`i++`), and body of the for statement
            - [ ] The second `if` statement is **nested** within the first, so variables declared within the first statement's **initializer** are visible within the second
            - For a `switch` statement, there's a block for the condition and a block for each case body
    - The scope of a control-flow label, as used by `break`, `continue`, and `goto` statements, is the entire enclosing function
    - At the package level, the order in which declarations appear has no effect on their scope, so a declaration may refer to [ ] itself or to another that follows it, letting us declare recursive or mutually recursive types and functions
    - Package-level names like the types and constants declared in one file of a package are visible to all the other files **of the same package**
    - **"exported" 对 packages 之间而言的**
    - Imported packages are declared at the **file level**, so they can be referred to from the same file, but not from another file in the same package without another `import`
- Lifetime of variables
    - The lifetime of a package-level variable is the entire execution of the program
    - Local variables have dynamic lifetimes: a new instance is created each time the declaration statement is executed, and the variable lives on until it becomes unreachable, at which point its storage may be recycled
        - Every package-level variable, and every local variable of each currently active function, can potentially be the start or root of a path to the variable in question, following pointers and other kinds of references that ultimately lead to the variable
        - If no such path exists, the variable has become unreachable, so it can no longer affect the rest of the computation
    - Function parameters and results are local variables too; they are created each time their enclosing function is called
- Pointers
    - If a variable is declared `var x int`, the expression `&x` ("address of `x`") yields a value (`p`) to an integer variable, that is, a value of type `*int`, which is pronounced "pointer to `int`"
    - If this value is called `p`, we say "`p` points to `x`", or equivalently "`p` <del>contains</del> is the address of `x`"
    - <del>The variable to which `p` points is written `*p`. The expression `*p` yields the value of that variable, an `int` </del> The variable that holds the `p` value is written `*p`. The expression `*p` yields the value of the value sits on the location of `p`
    - Since `*p` denotes a variable, it may also appear on the left-hand side of an assignment, in which case the assignment updates the variable
    - The zero type of a pointer of any type is `nil`
        - `var p *int`
        - Each time we take the address of a variable or copy a pointer, we create new **aliases** or ways to identify the same variable
        - To find all the statements that access a variable, we have to know all its alias
        - It's not just pointers that create aliases; aliasing also occurs when we copy values of other reference types like slices, maps, and channels, and even structs, arrays, and interfaces that contains these types
- A complier may choose to allocate local variables on the heap or the stack

    ```go
    var global *int
    func f() {
        var x int
        x = 1
        global = &x
    }
    func go() {
        y := new(int)
        *y = 1
    }
    ```

    - `x` must be heap-allocated because it's still reachable from the variable `global` after `f` has returned; we say `x` escapes from `f`
    - It's safe for the complier to allocate `*y` on the stack, even though it was allocated with `new`
    - Keeping unnecessary pointers to short-lived objects within long-lived objects, especially global variables, will prevent the GC from reclaiming the short-lived objects
- Assignments
    - `++`, `--` are postfix only
        - `i++` is a statement, not an expression, thus `j = i++` is illegal
    - ***All of the right-hand expression are evaluated before any of the variables are updated***, making this form most useful when some of the variables appear on both sides of the assignment
        - Tuple assignment
    - Certain expressions, such as a call to a function with multiple results, produce several values. When such a call is used in an assignment statement, the left-hand side must have as many variables as the function has results
        - Often, functions use these additional results to indicate some kind of error, either by returning an `error`, or a `bool`, usually called `ok`
        - 3 operators sometimes behave this way too
            - If a map lookup, type assertion, or channel receive appears in an assignment in which two results are **expected**, each produces an additional boolean result
    - Assignment statements are an explicit form of assignment
    - Places where assignment occurs implicitly
        - A function call implicitly assigns the values to the corresponding parameter variables
        - A `return` statement implicitly assigns the `return` operands to the corresponding result variables
        - A literal expression for a composite type: `medals := []string{"gold", "silver", "bronze"}`, as if it had been written like `medals[0] = "gold"; medals[1] = "silver"; medals[2] = "bronze"`
            - The elements of maps and channels, though not ordinary variables, are also subject to implicit assignments
    - An assignments is always legal if the left-hand side (the variable) and the right-hand side (the value) have the same type. More generally, the assignment is legal only if the value is *assignable* to the type of the variable
        - The rule for assignability
            - For the types we've discussed so far, the types must exactly match
            - `nil` may be assigned to any variable of interface or reference type
            - Constants have more flexible rules for assignability that avoid the need for most explicit conversions
- Normal practice in Go is to deal with the error in the `if` block and then return, so that the successful execution path is not indented
- By convention, formatting functions whose names end in `f` use the formatting rules of `fmt.Printf`, whereas those whose names ends in `ln` follow `Println`, formatting their arguments as if by `%v`, followed by a newline (P.10)
---
# APIs
- `fmt`
    - `fmt.Fprintf` - `func Fprintf(w io.Writer, format string, a ...interface{}) (n int, err error)`
        - Formats according to a format specifier and writes to `w`
        - Returns the number of bytes written and any write error encountered
    - `Sprintf` - `func Sprintf(format string, a ...interface{}) string`
        - Formats according to a format specifier and returns the resulting string
# 1. Tutorial
- > [Go Blog](https://blog.golang.org)
- > [Go Playground](https://play.golang.org)
- > [Standard library](https://golang.org/pkg)
- > [Book's source code](http://gopl.io)
- > Fetch source code 
    - `go get gopl.io/ch1/helloworld`
- Communicating Sequential Process (CSP)
    - A program is a parallel composition of processes that have no shared state; the processes communicate and synchronize using channels
- Semicolons
    - Go does not require semicolons at the end of statements or declarations, except where two or more appear on the same line
    - Newlines following certain tokens are converted into semicolons
- Code formatting
    - The `gofmt` tool rewrites code into the standard format, and the `go` tool's `fmt` subcommand applies `gofmt` to all the files in the specified package, or the ones in the current directory by default
        - `gofmt` tool sorts the package names into alphabetical order
    - `goimports` manages the insertion and removal of import declarations as needed
        - > `go get golang.org/x/tools/cmd/goimports`
- Comments
    - Comments do not nest
- The value of a constant must be a number, string, or boolean
- If a variable is not explicitly initialized, it's implicitly initialized to the *zero value* of its type
- `if`
    - Go allows a simple statement such as a local variable declaration to precede the `if` condition
        - `if err := r.ParseForm(); err != nil {...}` reduces the scope of variable `err`
- `switch`
    - Cases are evaluated from top to bottom, so the first matching one is executed
    -  The **optional** default case matches if none of the other cases does; it may be placed anywhere
    - Cases do not fall through by default (`fallthrough` statement overrides the behavior)
    - A `switch` does not need an operand; it can just list the cases, each of which is a boolean expression. This form is called a *tagless switch*; it's equivalent to `switch true`
<!-- 
    ```go
    switch coinFlip() {
        case "heads":
            heads++
        case "tails":
            tails++
        default: 
            fmt.Println("landed on edge!")
    }
    func Signum(x int) int {
        switch {
            case x > 0:
                return +1
            default: return 0
            case x < 0:
                return -1
        }
    }
    ``` 
 -->
- `for` loop
    - Any of the 3 parts can be omitted
    - The optional initialization **statement** is executed before the loop starts
<!-- 
    ```go
    for initialization; condition; post {
        // zero or more statements
    }
    // while loop
    for condition {
    }
    // infinite loop
    for {
    }
    ``` -->

- A `for`, `if` or `switch` may include an optional simple statement - a short variable declaration, an increment or assignment statement, or a function call - that can be used to set a value before it's tested
- `break`, `continue`, `goto`
    - A `break` causes control to resume at the next statement after the innermost `for`, `switch`, `select` statement
    - Statements may be labeled so that `break` and `continue` can refer to them
    - `goto` statement is intended for machine-generated code
- `map`
    - A map holds a set of **`key/value`** pairs
        - The key may be of any type whose value can be compared with `==` (string being the most common example)
        - The value may be of any type
    - A map provides constant-time operations to store, retrieve or test for an item in the set
    - The order of map iteration is **random**
- **Named types**
    
    ```go
    type Point struct {
        X, Y int
    }
    var p Point
    ```

- Function
    - Function `main` is where execution of the program begins 
    - It's a good style to write a comment before the declaration of each function to specify its behavior
- Function literal
    - An anonymous function defined at its point of use
    - `http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {...})`
- Methods
    - A method is **a function associated with a named type**
    - Methods may be attached to any named type
- **Interfaces**
    - Interfaces are abstract types that let us treat different concrete types in the same way based on **what methods they have**, not how they are represented or implemented 
- Pointers
    - Pointers are values that contain the address of a variable
    - `&` yields the address of a variable
    - `*` retrieves the variable that the pointer refers to
    - There's no pointer arithmetic
- ***goroutine***
    - A goroutine a concurrent function execution
    - The function `main` runs in a goroutine and  the `go` statement creates additional goroutines
    - When one goroutine attempts a send or receive on a channel, it blocks util another goroutine attempts the corresponding receive or send operation, at which point the value is transferred and both goroutines proceed
        - <mark>[ ] channel blocks, right?</mark>
- *channel*
    - A communication mechanism that allows one goroutine to pass values of a **specified type** to another goroutine
- `fmt.printf`
    - > p.10
    - `%v`: any value in natural format
    - By convention, formatting functions whose names end in `f` use the formatting rules of `fmt.Printf`, whereas those whose names ends in `ln` follow `Println`, formatting their arguments as if by `%v`, followed by a newline
- ***blank identifier***
    - `_`
    - It may be used whenever syntax requires a variable name but program logic does not
- Documentation
    - `godoc -http=:8080`
    - `go doc strconv.Atoi`
- Command-Line Arguments
    - Command-line arguments are available to a program in a variable named `Args` that is part of the `os` package
    - The first element of `os.Args`, `os.Args[0]` is the name of the command itself
        - `os.Args[1:len(os.Args)]`, `os.Args[1:]`
        - > `s[m:n]` yields a slice that refers to elements `m` through `n-1`
            - If `m` or `n` is omitted, it defaults to 0 or `len(s)` respectively
## Demos
- echo
    - `-n` causes `echo` to omit the trailing newline that would normally be printed; `-s sep` causes it to separate the output arguments by the contents of the string `sep` instead of the default single space
<!-- 
    ```go
    // echo1
    func main() {
        var s, sep string
        for i := 1; i < len(os.Args); i++ {
            s += sep + os.Args[i]
            sep = " "
        }
        fmt.Println(s)
    }
    // echo2
    func main() {
        s, sep := "", ""
        // it's an initialization
        for _, arg := range os.Args[1:] {   // range produces a pair of value in each iteration of the loop
            s += sep + arg
            sep = " "
        }
        fmt.Println(s)
    }
    // echo3
    func main() {
        fmt.Println(strings.Join(os.Arg[1:], " "))
    }
    // echo4
    /*  `flag.Bool` creates a new flag variable of type bool. It takes 3 arguments: the name of the flag `"n"`, the variable's default value (`false`), a message that will be printed if the user provides an invalid argument, an invalid flag, or `-h` 
    ** or `-help`
    ** `flag.String` takes name, a default value, and a message, and creates a string variable
    ** the variable `sep` and `n` are pointers to the flag variable
    ** When the program is run, it must call `flag.Parse` before the flags are used, to update the flag variables from their default
    ** values. - [ ] The non-flag arguments are available from `flags.Args()` as a slice of strings
    ** If `flag.Parse()` encounters an error, it prints a usage message and calls `os.Exit(2)` to terminate the program
    */
    var n = flag.Bool("n", false, "omit trailing newline")
    var sep = flag.String("s", " ", "separator")
    func main() {
        flag.Parse()
        fmt.Print(strings.Join(flag.Args(), *sep))
        if !*n {
            fmt.Println()
        }
    }
    ```
 -->
- dup
    - `Scanner` reads input and breaks it into lines or words
    - When the end of the input is reached, `Close` closes the file and releases any resources
    - When a map is passed into a function, the function receives **a copy of the reference**, so any change the called function makes to the underlying data structure will be visible through the caller's map reference too
<!-- 
    ```go
    // dup1
    func main() {
        counts := make(map[string]int) // key string, value int
        input := bufio.NewScanner(os.Stdin)
        // each call to `input.Scan()` reads the next line and removes the newline character from the end
        // return true if there's a line and false when there's no more input
        // the result can be retrieved by calling `input.Text()`
        for input.Scan() {
            // the first time a new line is seen, counts[line] evaluates to the zero value for its type
            counts[input.Text()]++
            /* line := input.Text()
            counts[line] += 1 */
        }
        for line, n := range counts {
            if n > 1 {
                fmt.Printf("%d\t%s\n", n, line)
            }
        }
    }

    // dup2
    func main() {
        counts := make(map[string]int)
        files := os.Args[1:]
        if len(files) == 0 {
            countLines(os.Stdin, counts)
        } else {
            for _, arg := range files {
                f, err := os.Open(arg)
                if err != nil {
                    fmt.Fprintf(os.Stderr, "dup2: %v\n", err)
                    continue
                }
                countLines(f, counts)
                f.Close()
            }
        }
        for line, n := range counts {
            if n > 1 {
                fmt.Printf("%d\t%s\n", n, line)
            }
        }
    }
    func countLines(f *os.File, counts map[string]int) {
        input := bufio.NewScanner(f)
        for input.Scan() {
            counts[input.Text()]++
        }
    }

    // dup3
    func main() {
	counts := make(map[string]int)
	for _, filename := range os.Args[1:] {
		data, err := ioutil.ReadFile(filename)
		if err != nil {
			fmt.Fprintf(os.Stderr, "dup3: %v\n", err)
			continue
        }
        // `ReadFile` returns a byte slice that must be converted into a string so it can be split by `strings.split`
		for _, line := range strings.Split(string(data), "\n") {
			counts[line]++
		}
        }
        for line, n := range counts {
            if n > 1 {
                fmt.Printf("%d\t%s\n", n, line)
            }
        }
    }
    ``` 
-->
- <mark>[ ] lissajous</mark>
    - `[]color.Color{}` (slice) and `gif.GIF{...}` (struct) are **composite literals**
<!-- 
    ```go
    var palette = []color.Color{color.White, color.Black}

    const (
        whiteIndex = 0 // first color in palette
        blackIndex = 1 // next color in palette
    )
    func main() {
        lissajous(os.Stdout)
    }
    func lissajous(out io.Writer) {
        const (
            cycles  = 5
            res     = 0.001
            size    = 100
            nframes = 64
            delay   = 8
        )
        // generates a random number between 0 and 3
        freq := rand.Float64() * 3.0
        anim := gif.GIF{LoopCount: nframes}
        phase := 0.0
        // each outer loop producing a single frame of the animation
        for i := 0; i < nframes; i++ {
            rect := image.Rect(0, 0, 2*size+1, 2*size+1)
            // all pixels are initially set to the palette's zero value (the zeroth color in the palette), which is white - [ ] later
            img := image.NewPaletted(rect, palette)
            for t := 0.0; t < cycles*2*math.Pi; t += res {
                x := math.Sin(t)
                y := math.Sin(t*freq + phase)
                img.SetColorIndex(size+int(x*size+0.5), size+int(y*size+0.5), blackIndex)
            }
            phase += 0.1
            anim.Delay = append(anim.Delay, delay)
            anim.Image = append(anim.Image, img)
        }
        gif.EncodeAll(out, &anim)
    }
    ``` 
-->
- concurrent fetch
    - Having one `main` do all the printing ensures that output from each goroutine is processed as a unit (blocked), with no danger of interleaving if two goroutine finishes at the same time
<!--     
    ```go
    func main() {
	    start := time.Now()
        ch := make(chan string)
        for _, url := range os.Args[1:] {
            go fetch(url, ch) // start a goroutine
        }
        for range os.Args[1:] {
            fmt.Println(<-ch) // receive from channel ch
        }
        fmt.Printf("%.2fs elapsed\n", time.Since(start).Seconds())
    }
    func fetch(url string, ch chan<- string) {
        start := time.Now()
        resp, err := http.Get(url)
        if err != nil {
            ch <- fmt.Sprint(err)
            return
        }
        // io.Copy function reads the body of the response and discards it by writing to ioutil.Discard output stream
        nbytes, err := io.Copy(ioutil.Discard, resp.Body)
        resp.Body.Close()
        if err != nil {
            ch <- fmt.Sprintf("while reading %s: %v", url, err)
            return
        }
        secs := time.Since(start).Seconds()
        ch <- fmt.Sprintf("%.2fs  %7d  %s", secs, nbytes, url)
    }
    ``` 
-->
- server
    - Behind the scenes, `server2` runs the handler for each incoming request in a separate goroutine so it can serve multiple requests simultaneously
        - If 2 concurrent request try to update `count` at the same time, it might not be incremented consistently (race condition)
        - Must ensure at most one goroutine accesses the variable at a time
<!-- 
    ```go
    // server 1
    func main() {
        http.HandleFunc("/", handler)
        log.Fatal(http.ListenAndServe("localhost:8000", nil))
    }
    // a request is represented as a struct of type `http.Request`
    func handler(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, " URL.Path = %q\n", r.URL.Path)
    }

    // server 2
    func main() {
        // a request for /count invokes counter and all others invoke handler
        http.HandleFunc("/", handler)
        http.HandleFunc("/count", counter) // excluding /count requests themselves
        log.Fatal(http.ListenAndServe("localhost:8000", nil))
    }
    func handler(w http.ResponseWriter, r *http.Request) {
        mu.Lock()
        count++
        mu.Unlock()
        fmt.Fprintf(w, "URL.Path = %q\n", r.URL.Path)
    }
    func counter(w http.ResponseWriter, r *http.Request) {
        mu.Lock()
        fmt.Fprintf(w, "Count %d\n", count)
        mu.Unlock()
    }
    ``` 
-->
# Program structure
- Variables store value. Simple expressions are combined into larger ones with operation like addition and subtraction. Basic types are collected into aggregates like arrays and structs. Expressions are used in statements whose execution order is determined by control-flow statements like `if` and `for`. Statements are grouped into functions for isolation and reuse. Functions are gathered into source files and packages
## Names
- The name of Go functions, variables, constants, types, statement labels, and packages follow a simple rule: a name begin with a letter (that is, anything that Unicode deems a letter) or an underscore and may have any number of additional letters, digits, and underscores
- Go has **25** keywords. They cannot be used as names
    - `break`, `case`, `chan`, `const`, `continue`, `default`, `defer`, `else`, `fallthrough`, `for`, `func`, `go`, `goto`, `if`, `import`, `interface`, `map`, `package`, `range`, `return`, `select`, `struct`, `switch`, `type`, `var`
- Go has about a dozen ***predeclared names*** like `int` and `true` for built-in constants, types, and functions
    - These names are not reserved, there're a handful of places where redeclaring one of them makes sense
- Scope
    - An entity declared within a function is **local** to that function. An entity declared outside a function is visible in **all files of the package** to which it belongs
- Visibility
    - The case of the first letter of a name determines its visibility ***across package boundaries***
    - A name beginning with an upper-case letter is **exported**. That means it's visible and accessible outside of its own package and may be referred to by other parts of the program
- Package names are always in lower case
- There' no limit on name length
    - Go programs lean toward short names, especially for local variables with small scopes
    - Generally, the larger the scope of a name, the longer and more meaningful it should be
- Use "camel case"
- The letters of acronyms and initialisms are always rendered **in the same case**
    - `htmlEscape`, `HTMLEscape`
## Declarations
- A declaration names a program entity and specifies some or all of its property
- 4 major kinds of declarations: `var`, `const`, `type`, `func`
- Functions and other package-level entities may be declared ***in any order***
- (`const`, `var`) Declarations may appear at package level(so the names are visible throughout the package) or within a function(so the names are visible only within that function)
## Variables
- A variable is a piece of storage containing a value
- A var declaration creates a variable of a particular type, attaches a name to it, and sets its initial value
    - `var name type = expression`
    - Either the `type` or the `= expression` can be omitted, but not both
        1. If the expression is omitted, the initial value is the *zero value* for its type
- Initializers may be literal values or arbitrary expressions
    - Package-level variables are initialized **before `main` begins**
    - Local variables are initialized as their declarations are encountered during function execution
- It's possible to declare and optionally initialize a set of variables in a single declaration
- A set of variables can also be initialized by calling a function that returns multiple values

    ```go
    var i, j, k int // int int int
    var b, f, s = true, 2.3, "four" // bool, float64, string
    var f, err = os.Open(name)  // returns a file and an error
    ```

- A `var` declaration tends to be reserved for local variables that need an explicit type that differs from that of the initializer expression - [ ], or for when the variable will be assigned a value later and its initial value is unimportant
- ***zero vale***
    - numeric type: 0
    - string: `""`
    - boolean: `false`
    - interfaces, reference types(slice, pointer, map, channel, function): `nil`
    - aggregate type (array, struct): zero value of all of its elements or fields
### Short Variable Declarations
- `name := expression`
    - Used within a function only, not for package-level variables
    - The type of `name` is determined by the type of `expression`
    - Used to declare and initialize the majority of local variables
- **`:=` is a declaration, `=` is an assignment**
- `i, j := 0, 1`
    - Declarations with multiple initializer expressions should be used only when they help readability (such as for short and natural groupings like initialization part of a `for` loop)
    - > <mark>tuple assignment: `i, j = j, i` swaps values of `i` and `j`</mark>
- `f, err := os.Open(name)`
- A short variable declaration **must declare at least one new variable**
    - If some of variables in a short variable declaration were already declared **in the same lexical block**, then, for those variables, the short variable declaration acts like an **assignment**
    - A short variable declaration acts like an assignment only to variables that were already in the same lexical scope; declarations in an outer block are ignored
- Declare a `string` variable
    1. `s := ""`
        - Can be used only within a function, not for package-level variables
    2. `var s string`
        - relies on default initialization to the zero value
    3. `var s = ""`
        - rarely used except when declaring multiple variables
    4. `var s string = ""`
        - explicit about the variable's type
        - redundant when variable type is the same as that of the initial value
        - necessary when they are not of the same type
### Pointers
- Variables created by declarations are identified by a name, such as `x`, but many variables are identified only by expressions like `x[i]` or `x.f`
- A pointer value is the address of a variable. A pointer is thus the **location** at which a value is stored
    - Not every value has an address, but every variable does
    - With a pointer, we can read or update the value of a variable indirectly, without using or even knowing the name of the variable, if indeed it has a name
- If a variable is declared `var x int`, the expression `&x` ("address of `x`") yields a value (`p`) to an integer variable, that is, a value of type `*int`, which is pronounced "pointer to `int`"
    - If this value is called `p`, we say "`p` points to `x`", or equivalently "`p` contains the address of `x`"
    - The variable to which `p` points is written `*p`. The expression `*p` yields the value of that variable, an `int`
    - Since `*p` denotes a variable, it may also appear on the left-hand side of an assignment, in which case the assignment updates the variable
- Each component of a variable of aggregate type - a field of a struct or an element of an array - is also a variable and thus also has an address too
- The zero type of a pointer of any type is `nil`
    - `var p *int`
- Pointers are **comparable**
    - Two pointers are equal if and only if they point to the same variable or both are nil
    - `p != nil` is `true` if `p` points to a variable
- It's safe for a function to return the address of a local variable
    - The local variable will remain in existence even after the call has returned if there's a pointer still refers to it
    - Each call to `f()` returns a distinct value
<!-- 
    ```go
    func main() {
        fmt.Println(f() == f())
    }
    func f() *int {
        v := 1
        return &v
    }
    ```
 -->
 - Each time we take the address of a variable or copy a pointer, we create new **aliases** or ways to identify the same variable
    - To find all the statements that access a variable, we have to know all its alias
    - It's not just pointers that create aliases; aliasing also occurs when we copy values of other reference types like slices, maps, and channels, and even structs, arrays, and interfaces that contains these types
### The `new` function
- Another way to create a variable is to use the built-in function `new`
- `new(T)` creates an **unnamed** variable of type `T`, initializes it to the zero value of `T`, and returns its **address**, which is a value of type `*T`
    - A variable created with `new` is no different from an ordinary local variable whose address is taken, except that there's no need to invent (and declare) a dummy name
    - Thus the `new` is only a syntactic convenience
- Each call to `new` returns a distinct variable with a unique address
    - One exception: two variables whose type carries no information and is therefore of size zero, such as `struct{}` or `[0]int`, may, depending on the implementation, have the same address
### Lifetime of variables
- The lifetime of a package-level variable is the entire execution of the program
- Local variables have dynamic lifetimes: a new instance is created each time the declaration statement is executed, and the variable lives on until it becomes unreachable, at which point its storage may be recycled
    - Function parameters and results are local variables too; they are created each time their enclosing function is called
- Garbage collector
    - Every package-level variable, and every local variable of each currently active function, can potentially be the start or root of a path to the variable in question, following pointers and other kinds of references that ultimately lead to the variable
    - If no such path exists, the variable has become unreachable, so it can no longer affect the rest of the computation
- A complier may choose to allocate local variables on the heap or the stack
    - `x` must be heap-allocated because it's still reachable from the variable `global` after `f` has returned; we say `x` escapes from `f`
    - It's safe for the complier to allocate `*y` on the stack, even though it was allocated with `new`
    - Keeping unnecessary pointers to short-lived objects within long-lived objects, especially global variables, will prevent the GC from reclaiming the short-lived objects

    ```go
    var global *int
    func f() {
        var x int
        x = 1
        global = &x
    }
    func go() {
        y := new(int)
        *y = 1
    }
    ```

## Assignments
- The value held by a variable is updated by an assignment statement, which in its simplest form has a variable on the left of the sign `=` sign and an expression on the right
- `++`, `--`
    - postfix only
    - `i++` is a statement, not an expression, thus `j = i++` is illegal
- Each of the arithmetic and binary operators has a corresponding assignment operator allowing (`*=`)
### Tuple assignment
- ***All of the right-hand expression are evaluated before any of the variables are updated***, making this form most useful when some of the variables appear on both sides of the assignment
<!-- 
    ```go
    // GCD (greatest common divisor)
    func gcd(x, y int) int {
        for y != 0 {
            x, y = y, x%y
        }
        return x
    }
    // n-th Fibonacci number
    func fib(n int) int {
        x, y := 0, 1
        for i := 0; i < n; i++ {
            x, y = y, x+y
        }
        return x
    }
    ``` 
-->
- Certain expressions, such as a call to a function with multiple results, produce several values
    - When such a call is used in an assignment statement, the left-hand side must have as many variables as the function has results
    - Often, functions use these additional results to indicate some kind of error, either by returning an `error`, or a `bool`, usually called `ok`
- There're 3 operators that sometimes behave this way too
    - If a map lookup, type assertion, or channel receive appears in an assignment in which two results are **expected**, each produces an additional boolean result
<!-- 
    ```go
    v, ok = m[key]
    v, ok = x.(T)
    v, ok = <-ch
    ```
 -->
- As with variable declarations, we can assign unwanted values to the blank identifier
### Assignability
- Assignment statements are an explicit form of assignment
- Places where assignment occurs implicitly
    - A function call implicitly assigns the values to the corresponding parameter variables
    - A `return` statement implicitly assigns the `return` operands to the corresponding result variables
    - A literal expression for a composite type: `medals := []string{"gold", "silver", "bronze"}`
        - The elements of maps and channels, though not ordinary variables, are also subject or implicit assignments
- An assignments is always legal if the left-hand side (the variable) and the right-hand side (the value) have the same type. More generally, the assignment is legal only if the value is *assignable* to the type of the variable
- The rule for assignability
    - For the types we've discussed so far, the types must exactly match
    - `nil` may be assigned to any variable of interface or reference type
    - Constants have more flexible rules for assignability that avoid the need for most explicit conversions
## Type Declarations
- A `type` declaration defines a new **named type** that has the same underlying types as an existing type
    - `type name underlying-type`
- Type declarations most often appear at package level, where the named type is visible throughout the package, and if the name is exported (it starts with an upper-case letter), it’s accessible from other packages as well
- The named type provides a way to separate different and perhaps incompatible uses of the underlying types so that they can't be mixed unintentionally
    - Even though `Celsius` and `Fahrenheit` have the same underlying type, they are not the same type, so they cannot be be compared or combined in arithmetic expressions
    - Distinguishing the types makes it possible to avoid errors like inadvertently combining temperatures in the 2 different scales
    - An explicit type conversion like `Celsius(t)` or `Fahrenheit(t)` is required to convert from a `float64`. 
    - `Celsius(t)` and  `Fahrenheit(t)` are conversions, not function calls. They don't change the value or representation in any way, but they make the change of meaning explicit
<!-- 
    ```go
    type Celsius float64
    type Fahrenheit float64
    const (
        AbsoluteZeroC Celsius = -273.15
        FreezingC     Celsius = 0
        BoilingC      Celsius = 100
    )
    func CToF(c Celsius) Fahrenheit { return Fahrenheit(c*9/5 + 32) }
    func FToC(f Fahrenheit) Celsius { return Celsius((f - 32) * 5 / 9) }
    ```
 -->
 - For every type `T`, there's a corresponding conversion operation `T(x)` that converts the value `x` to type `T`
 - A conversion from one type to another type is allowed if **both have the same underlying type**, or if both are **unnamed pointer** types that point to variables of the same underlying type
    - These conversions change the type but not the representation of the value
    - If `x` is assignable to `T`, a conversion is permitted but is usually redundant
- Conversions are allowed between numeric types, and between string and some slice types
    - These conversions may change the representation of the value
        - Converting a floating-point number to an integer discards any fractional part
        - Converting a string to a `[]byte` slice allocates a copy of the string data
- The underlying type of a named type determines its structure and representation, and also the set of intrinsic operations it supports, which are the same as if the underlying type had been used directly
- Comparison operators like `==` and `<` can also be used to compare a value of a named type to another of the same type, or to a **value** of the underlying type
- Named types also make it possible to define new behaviors for values of the type. These behaviors are expressed as a set of functions associated with the type, called the type's methods - `func (c Celsius) String() string { return fmt.Sprintf("%g°C", c) }`
    - The `Celsius` parameter `c` appears before the function name, associate with the `Celsius` type a method named `String` that returns `c`'s numeric value followed by °C
    - > Many types declare a `String` method of this form because it controls how values of the type appear when printed as a string by the `fmt` package
## Packages and Files
- The source code for a package resides in one or more `.go` files, usually in a **directory** whose name ends with the import path
    - `gopl.io/ch1/helloworld` package are stored in directory `$GOPATH/src/gopl.io/ch1/helloworld`
- Each package serves as a separate name space for its declarations
    - Within the `image` package, the identifier `Decode` refers to a different ***function*** than does the same identifier in the `unicode/utf16` package
- Packages
    - A package consists of one or more `.go` source files in a single directory that define what the package does
    - Each source file begins with a `package` declaration that states which package the file belongs to, followed by a list of other packages that it imports
        - The `import` declarations must follow the `package` declaration
        - The list form of `import` declaration is conventionally used
    - Package `main` defines a standalone executable program, not a library
    - By convention, we describe each package in a comment immediately preceding its package declaration  
- Package-level names like the types and constants declared in one file of a package are visible to all the other files of the package
    - Visibility
- The `doc comment` immediately preceding the package declaration documents the package as a whole. Only one file in each package should have a package doc comment
    - Extensive doc comments are often placed in a file of their own, conventionally called `doc.go`
### Imports
- Within a Go program, every package is identified by a unique string called *import path*
    - These are the strings that appear in an `import` declaration like `"gopl.io/ch2/tempconv"`
    - When using the `go` tool, an import path denotes a directory containing one or more Go source files that together make up the package
- Each package has a package name (the short name but not necessarily unique that appear in its `package` declaration)
    - By convention, a package's name matches the last segment of its import path
    - An import declaration may specify an alternative name to avoid conflicts
### Package Initialization
- Package initialization begins by initializing package-level variables in the order in which they are declared, except that **dependencies are resolved first**

    ```go
    var a = b + c   // a initialized third
    var b = f()     // b initialized second
    var c = 1       // c initialized first
    func f() int {return c + 1}
    ```    

- If the package has multiple `.go` files, they are initialized in the order in which the files are given to the compiler
    - The `go` tool sorts `.go` files by name before invoking the compiler
- Each variable declared at package level starts life with the value of its initializer expression, if any
    - For some variables (like table of data), an initializer expression may not be the simplest way to set its initial value. In that case, the `init` function mechanism may be simpler
- Any file may contain any number of functions whose declaration is just `func init() { /* ... */ }`
    - Such `init` function can't be called or referenced, but otherwise they are normal functions
    - Within each file, `init` functions are automatically executed when the program starts, in the order in which they are declared
- One package is initialized at a time, in the order of imports in the program, **dependencies first**
- Initialization proceeds from the **bottom up**; the `main` package is the last to be initialized
- <mark>[ ] population count</mark>
## Scope
- A declaration associates a name with a program entity, such a function or a variable
- The scope of a declaration is the part of the source code where a use of the declared name refers to the declaration
    - The scope of a declaration is a region of the program text; it's a compile-time property
    - The lifetime of a variable is the range of time during the execution when the variable can be referred to by other parts of the program; it's a run-time property
- A *syntactic block* is a sequence of statements enclosed in braces like those that surround the body of a function or a loop
    - A name declared inside a syntactic block is not visible outside that block, the block encloses its declarations and determines their scope
- *Lexical block*: other groupings of declarations that are not explicitly surrounded by braces
    - Universe block: a lexical block for the entire source code
    - There's a lexical block for each package; for each file; for each `for`, `if`, and `switch` statement; for each case in a `switch` or `select` statement; for each explicit syntactic block
    -  `for` loops, `if` statements, and `switch` statements create implicit blocks **in addition to their body blocks**

    ```go
    func main() {
        x := "hello!"
        for i := 0; i < len(x); i++ {
            x := x[i]
            if x != '!' {
                x := x + 'A' - 'a'
                fmt.Printf("%c", x) // "HELLO"
            }
        }
    }
    // the for loop creates 2 lexical blocks
    // the explicit block for the loop body, and an implicit
    // block that additionally encloses the variables
    // declared by the initialization clause
    // the scope of a variable declared in the implicit block
    // is the condition, post-statement(i++), and body of the for statement

    if x := f(); x == 0 {
        fmt.Println(x)
    } else if y := g(x); x == y {
        fmt.Println(x, y)
    } else {
        fmt.Println(x, y)
    }
    fmt.Println(x, y) // compile error: x and y are not visible here
    // [ ] the second if statement is **nested** within the first, so variables declared within the first 
    // statement's initializer are visible within the second
    ```

    - For a `switch` statement, there's a block for the condition and a block for each case body
- The declarations of built-in types, functions, and constants like `int`, `len`, `true` are in the universe block and can be referred throughout the entire program
- Declarations outside any functions, that is, at package level, can be referred to from any file in the same package
- Imported packages are declared at the file level, so they can be referred to from the same file, but not from another file in the same package without another `import`
- Local declarations can be referred to only from within the same function or perhaps just a part of it
- The scope of a control-flow label, as used by `break`, `continue`, and `goto` statements, is the entire enclosing function
- When the compiler encounters a reference to a name, it looks for a declaration, staring with the innermost enclosing lexical block and working up to the universe block
    - If the compiler finds no declaration, it reports an "undeclared name" error
    - If a name is declared in both an outer block and an inner block, the inner declaration will be found first. In that case, the inner declaration is said to shadow or hide the outer one, making it inaccessible
    - <mark>At the package level, the order in which declarations appear has no effect on their scope, so a declaration may refer to itself or to another that follows it, letting us declare recursive or mutually recursive types and functions</mark>
<!-- 
    ```go
    if f, err := os.Open(fname); err != nil { // compile error: unused f
        return err
    }
    f.Stat()    // compile error: undefined f
    f.Close()   // compile error: undefined f
    
    f, err := os.Open(fname)
    if err != nil {
        return err
    }
    f.Stat()
    f.Close()

    if f, err := os.Open(fname); err != nil {
        return err
    } else {
        // f and err are visible here too
        f.Stat()
        f.Close()
    }
    ```
  -->
- Normal practice in Go is to deal with the error in the `if` block and then return, so that the successful execution path is not indented
# Basic Data Types
- 4 categories
    1. basic types
    2. aggregate types
        - arrays, structs
    3. reference types
        - pointers, slices, maps, functions, channels
    4. interface
## Integers
- Go's numeric data types include several sizes of integers, floating-point numbers, and complex numbers. Each numeric type determines the size and signedness of its values
- 4 distinct sizes of integers - 8, 16, 32, 64
    - `int8`, `int16`, `int32`, `int64`, `uint8`, `uint16`, `uint32`, `uint64`
    - `int` and `uint` are the natural or most efficient size for signed and unsigned integers on a particular platform
        - Both these types have the same size, either 32 or 64 bits
        - different compilers may make different choices even on identical hardware
- `rune` is a synonym for `int32` and indicates that a value is a Unicode code point
- `byte` is a synonym for `uint8` and emphasizes that the value is a piece of raw data rather than a small numeric quantity
- `uintptr` is an unsigned integer type, whose width is not specified but is sufficient to hold all the bits of a pointer value
    - Used only for low-level programming, such as at the boundary of a Go program and a C library or an operating system
- Regardless of their size, `int`, `uint`, and `uintptr` are different types from their explicitly sized siblings. An explicit conversion is required
- Signed numbers are represented in 2's-complement form, in which the high-order bit is reserved for the sign of the number (`0` positive, `1` negative). Unsigned integers use the full range of bits
    - 8 bit 有 256 个状态
        1. 无符号数
            - 最小数 `00000000`（`0`），最大数 `11111111`（`255`）
        2. 有符号数
            - 共 7 位用于表示数字范围
            - 正数最小数 `00000000`（`+0`），正数最大数 `01111111`（`127`）
            - 负数最“大”数 `10000000`（`-0`），负数最小数 `11111111`（`-127`）
            - 同时存在正零和负零，存在冗余
            - `10000000` 是某个负数的补码，减 `1` 得到 `01111111`，取反得到原码 `10000000` （[ ] 想象一下前面还有很多 0，这样第一个 1 就不是符号位了，就用它来表示 128 吧，又因为是负数，所以是 -128）
            - > https://www.jianshu.com/p/35cf507ebe7f            
    - 机器数：一个数在计算机中的二进制表示，带符号
    - 真值：机器数对应的真正的数值
    - 原码 = 符号位 + 真值绝对值

        ```
         00010000   (16)            10001000    (-8)
        +10001000   (-8)           +10001000    (-8)
        ---------                  ---------
         10011000   (-24 wrong)     00010000    (16 wrong)
        ```

        - 原码若用于有减法参与的运算会得到结果错误
        - 正常的加法规则不适用于有负数参与的加法，因此必须制定两套运算规则，意味着必须为加法运算设计两种电路
    - 反码
        - 正数反码即正数本身
        - 负数反码是**其原码**的**符号位以外的各位**逐位**取反**或该负数的绝对值（即**对应的正数**）的原码的每一个二进制位都取反

        ```
         00010000   (16 的反码)            11110111    (-8 的反码)
        +11110111   (-8 的反码)           +11110111    (-8 的反码)
        ---------                        ---------
         00000111   (just wrong)          11111000    (just wrong)  
        ```

    - 补码
        - 正数补码即正数本身
        - 负数补码是该负数的绝对值（即**对应的正数**）的原码的每一个二进制位都取反，再加 `1`

        ```
         00010000   (16 的补码)            11111000    (-8 的补码)
        +11111000   (-8 的补码)           +11111000    (-8 的补码)
        ---------                        ---------
         00001000   (8 的补码)             11110000    (-16 的补码)  
        ```

        - **[补码本质](http://www.ruanyifeng.com/blog/2009/08/twos_complement.html)**
            1. `负数 = 0 - 该负数的绝对值`，不够减就**借位**

                ```
                 00000000   (0)            
                -00001000   (8)           
                            (-8)

                # 发生借位，实际被减数是 100000000，100000000 = 11111111 + 1
                 100000000
                - 00001000
                ----------
                  11111000

                # 上一步等价于一下两步
                 11111111   # 取反步骤
                -00001000
                ---------
                 11110111   # 加 1 步骤
                +00000001
                ---------
                 11111000
                ```

    - 正数的原码、反码、补码的最高位都是 0，所以最高位为 1 的一定是以某种码表示的负数
    - 计算机内部采用（对应正数）的 2 的补码（Two's Complement）表示负数
    - 计算机读到最高位是 1 的数，知道该数是负数，而负数是以补码形式存储的，所以它将其当补码处理
- 5 level of precedence for **binary operators**
    1. `*`, `/`, `%`, `<<`, `>>`, `&`, `&^`
    2. `+`, `-`, `|`, `^`
    3. `==`, `!=`, `<`, `<=`, `>`, `>=`
    4. `&&`
    5. `||`
    - Operators at the same level **associate to the left**
    - Each operator in the first 2 lines has a corresponding assignment operator
    - `+`, `-`, `*` and `/` may be applied to integer, floating-point, and complex numbers
        - The behavior of `/` depends on whether its operands are integers (`5.0/4` is `1.25`, `5/4` is `1`, `5.0/1.0` is `5`)
        - Integer division truncates the result toward zero
    - The remainder operator `%` applies only to integers. The sign of the remainder is always the same as the sign of the dividend (`-5%3` and `-5%-2` are both `-2`)
- Overflow
    - The high-order bits that do not fit will be silently discarded
- All values of basic type - booleans, numbers, and strings - are comparable, meaning that 2 values of the same type may be compared using `==` and `!=`
- Integers, floating-point numbers, and strings are ordered by the comparison operators
- For integers, `+x` is shorthand for `0+x` and `-x` is shorthand for `0-x`; for floating-point and complex numbers, `+x` is just `x` and `-x` is negation of `x`
- Bitwise binary operators: `&`, `|`, `^`, `&^`, `<<` `>>`
    - The first 4 treat their operands as bit patterns with no concept of arithmetic carry or sign
    - `^`
        1. It's bitwise exclusive OR (XOR) when used as a binary operator
        2. It's bit wise negation or complement: returns a value with each bit in its operand inverted
    - `&^` operator is bit clear (AND NOT): in the expression `z = x &^ y`, each bit of `z` is `0` if the corresponding bit of `y` is `1`; otherwise it equals the corresponding bit of `x`
    - `x<<n`, `x>>n`
        - `n` determines the number of bit positions to shift and must be unsigned
        - **`x` may be unsigned or signed**
        - Arithmetically, a left shift `x<<n` is equivalent to multiplication by `2^n` and a right shift `x>>n` is equivalent to the floor of division by `2^n`
        - Left shifts fill the vacated bits with zeros, as do right shifts of unsigned numbers, but right shifts of signed numbers fill the vacated bits with copies of the sign bit
            - For this reason, it is important to use unsigned arithmetic when you’re treating an integer as a bit pattern
- Binary operators for arithmetic and logic (except shifts) must have operands of the same type
- Use bitwise operations to interpret a `uint8` value as a compact and efficient set of 8 independent bits

    ```go
    var x uint8 = 1<<1 | 1<<5
    var y uint8 = 1<<1 | 1<<2
    fmt.Printf("%08b\n", x) // "00100010", the set {1, 5}
    fmt.Printf("%08b\n", y) // "00000110", the set {1, 2}
    fmt.Printf("%08b\n", x&y) // "00000010", the intersection {1}
    fmt.Printf("%08b\n", x|y) // "00100110", the union {1, 2, 5}
    fmt.Printf("%08b\n", x^y) // "00100100", the symmetric difference {2, 5}
    fmt.Printf("%08b\n", x&^y) // "00100000", the difference {5}
    for i := uint(0); i < 8; i++ {
        if x&(1<<i) != 0 { // membership test (easy to understand, just try it)
            fmt.Println(i) // "1", "5"
        }
    }
    fmt.Printf("%08b\n", x<<1) // "01000100", the set {2, 6}
    fmt.Printf("%08b\n", x>>1) // "00010001", the set {0, 4}
    ```

- We tend to use the signed `int` form even for quantities that can't be negative

    ```go
    medals := []string{"gold", "silver", "bronze"}
    for i := len(medals) - 1; i >= 0; i-- {
        fmt.Println(medals[i])
    }
    ```

    - The built-in `len` function returns a signed `int`
    - If `len` returns an unsigned number, then `i` too would be a `uint`, and the condition `i >= 0` would always be `true` by definition. After the 3rd iteration, in which `i == 0`, the `i--` statement would cause `i` to become not `-1`, but the maximum `uint` value (for example, `2^64 -1`), and the evaluation of `medals[i]` would fail at run time, or panic, by attempting to access an element outside the bounds of the slice
    - For this reason, unsigned numbers tend to be used only when their bitwise operators or peculiar arithmetic operators are required, as when implementing *bit sets*, parsing binary file formats, or for hashing and cryptography. They are typically not used for merely non-negative quantities
- In general, an explicit conversion is required to convert a value from one type to another
    - Many integer-to-integer conversions do not entail any change in value; they just tell the complier to how to interpret a value
    - A conversion that narrows a big integer into a smaller one, or a conversion from a **integer to floating-point** or vice versa, may change the value or lose precision
        - Float ot integer conversion discards any fractional part, truncating toward zero
    - Avoid conversions in which the operands is out of range for the target type, because the behavior depends on the implementation
- Integer literals of any size and type can be written as ordinary decimal numbers, octal numbers (begin with `0`), hexadecimal (begin with `0x` or `0X`)
    - Hex digits may be upper or lower case
    - Octal numbers seem to be used for exactly one purpose - file permissions on POSIX system
- When printing numbers using the `fmt` package, we can control the radix and format with the `%d`, and `%x` verbs

    ```go
    o := 0666
    fmt.Printf("%d %[1]o %#[1]o\n", o) // 438 666 0666
    x := int64(0xdeadbeef)
    fmt.Printf("%d %[1]x %#[1]x %#[1]X\n", x) // 3735928559 deadbeef 0xdeadbeef 0XDEADBEEF
    ```

    - Usually a `Printf` format string containing multiple `%` verbs would require the same number of extra operands, but the `[1]` adverbs after `%` tell `Printf` to use the first operand over and over again
    - The `#` adverb for `%o` or `%x` or `%X` tells `Printf` to emit a `0` or `0x` or `0X` prefix respectively
- Rune literals are written as a character within single quotes
    - A simple example is an ASCII character like `'a'`. It's possible to write any Unicode code point directly or with numeric escapes
    - Runes are printed with `%c`, or with `%q` if quoting is desired

    ```go
    ascii := 'a'
    unicode := '国'
    newline := '\n'
    fmt.Printf("%d %[1]c %[1]q\n", ascii)
    fmt.Printf("%d %[1]c %[1]q\n", unicode)
    fmt.Printf("%d %[1]c %[1]q\n", newline)
    ```

## Floating-point Numbers
- Go provides 2 sizes of floating-pointing numbers, `float32` and `float64`
    - The limit of floating-point value can be found in the `math` package
        - The constant `math.MaxFloat32` and `math.MaxFloat64` is about `3.4e38` and `1.8e308` respectively. The smallest positive values are near `1.4e-45` and `4.9e-324`, respectively
    - A `float32` provides approximately 6 decimal digits of precision, whereas a `float64` provides about 15 digits
    - `float64` should be preferred for most purposes because `float32` computations accumulate error rapidly unless one is quite careful, and the largest positive integer that can be exactly represented as a `float32` is small

    ```go
    var f float32 = 16777216    // 1 << 24
    fmt.Println(f)      // 1.6777216e+07
    fmt.Println(f+1)    // 1.6777216e+07
    ```

    - Digits may be omitted before the decimal point (`.708`) or after it (`1.`)
    - Very small or very large numbers are better written in scientific notation, with the letter `e` or `E` preceding the decimal exponent
- Floating-point values are conveniently printed with `Printf`'s `%g` verb, which choose the most compact representation that has adequate precision, but for table data, the `%e` (exponent) or `%f` (no exponent) forms may be more appropriate
    - All 3 verbs allow field width and numeric precision to be controlled

    ```go
    for x := 0; x < 8; x++ {
        fmt.Printf("x = %d e^x = %8.3f\n", x, math.Exp(float64(x)))
    }
    ```

- `math` package has functions for creating and detecting the special values defined by IEEE 754
    - The positive and negative infinities, which represent numbers of excessive magnitude and the result of division by zero
    - `NaN`, the result of such mathematically dubious operations as `0/0` or `Sqrt(-1)`
        - `math.IsNaN` test whether  its argument is a not-a-number value, and `math.NaN` returns such a value
        - It's tempting to use `NaN` as a sentinel value in a numeric computation, but testing whether a specific computational result is equal to `NaN` is fraught with peril because any comparison with `NaN` yields `false` (except `!=`, which is always the negation of `==`)
        - If a function that returns a floating-point result might fail, it's better to report the failure separately

        ```go
        func compute() (value float64, ok bool) {
            if failed {
                return 0, false
            }
            return result, true
        }
        ```

## Complex Numbers
- Go provides 2 sizes of complex numbers, `complex64` and `complex128`, whose components are `float32` and `float64` respectively
    - The built-in function `complex` creates a complex number from its real and imaginary components, and the built-in `real` and `imag` functions extract those components
    - The `math/cmplx` package provides library functions for working with complex numbers

    ```go
    var x complex128 = complex(1, 4) // 1+2i
    // x := 1 + 4i
	fmt.Println(real(x), imag(x))
    ```

## Booleans
- The conditions in `if` and `for` statements are booleans, and comparison operators like `==` and `<` produce a boolean result
- `&&` and `||` have short-circuit behavior: if the answer is already determined by the value of the left operand, the right operand is not evaluated
    - `s != "" && s[0] == 'x'`: `s[0]` would panic if applied to an empty string
- There's no implicit conversion from a boolean value to a numeric value like 0 or 1, or vice versa
## Strings
- A string is an immutable sequence of bytes
    - Strings may contain arbitrary data, including bytes with value 0, but usually they contain human-readable text
    - Text strings are conventionally interpreted as UTF-8-encoded sequences of Unicode **code points** (*runes*)
- The built-in `len` function returns the **number of bytes** (**not runes**) in a string, and the index operation `s[i]` retrieves the **`i`-th byte** of string `s`, where `0<=i<len(s)`. Attempting to access a byte outside this range results in a panic
    - The `i`-th byte of a string is not necessarily the `i`-th character of a string, because the UTF-8 encoding of a non-ASCII code point require two or more bytes
- The substring operation `s[i:j]` yields a new string consisting of the bytes of the original string starting at index `i` and continuing up to, but not including , the byte at index `j` (the containing `j-i` bytes). A panic results if either index is out of bounds or if `j` is less than `i`
    - Either or both of the `i` and `j` operands may be omitted, in which case the default values of `0` (the start of the string) and `len(s)` (its end) are assumed, respectively
- The `+` operator makes a new string by concatenating two strings
- Strings may be compared with comparison operators like `==` and `<`; the comparison is done **byte to byte**, so the result is the natural lexicographic ordering
- String values are **immutable**
    - Immutability means that it's safe for two copies of a string to share the same underlying memory, making it cheap to copy strings of any length. Similarly, a string `s` and a substring like `s[7:]` may safely share the same data, so the substring operation is also cheap. No new memory is allocated in either case
    
    ```go
    s := "left foot"
    t := s
    s += ", right foot"
    ```

    - This does not modify the string that `s` originally held but causes `s` to hold the new string formed by the `+=` statement (***explanation for immutability***)
### String Literals
- A string value can be written as a string literal, a sequence of bytes enclosed in **double quotes**
    - Because Go source files are always encoded in UTF-8 and Go text are conventionally interpreted as UTF-8, we can include Unicode code points in string literals
- Escape sequences that begin with a backslash `\` can be used to insert arbitrary byte values into the string
    - Arbitrary bytes can also be included in literal strings using hexadecimal or octal escapes. A hexadecimal escape is written `\xhh`, with exactly two hexadecimal digits `h` (in upper or lower case). An octal escape is written `\ooo` with exactly three octal digits `o` not exceeding `\377`. Both denote a **single byte** with the specified value
- A raw string literal is written `...`
    - Within a rao string literal, no escape sequences are processed; the contents are taken literally, including backslashes and newlines, so a raw string may spread over several lines in the program source
    - The only processing is that carriage returns are deleted so that the value of the string is the same on all platforms, including those conventionally put carriage return in text files
### Unicode
- > https://blog.golang.org/strings
- US-ASCII uses 7 bits to represent 128 characters
- Unicode collects all of the characters in all of the world's writing systems, plus accents and other diacritical marks, control codes like tab and carriage return, and plenty of esoterica, and assigns each one of a standard number called a *Unicode code point*, in Go terminology, a `rune`
    - Unicode version 8 defines code points for over 120000 characters in well over 100 languages and scripts
- The natural data type to hold a single rune is `int32`, and that's what Go uses; it has the synonym **`rune`** for precisely this purpose
    - We could represent a sequence of runes as a sequence of `int32` values. In this representation, which is called UTF-32 or UCS-4, the encoding of each Unicode code point has the same size, 32 bits. This is simple and uniform, but it uses munch more than necessary since most computer-readable text in ASCII, which require only 8 bits or 1 byte per character
    - All the characters in widespread use still number fewer than 65536, which would fit in 16 bits
### UTF-8
- UTF-8 is a **variable-length** encoding of Unicode code points as bytes
    - It uses between 1 and 4 bytes to represent each, but only 1 byte for ASCII characters, and only 2 or 3 bytes for most runes in common use
    - The high-order bits of the first byte of the encoding for a rune indicate how many bytes follow
        - A high-order `0` indicates 7-bit ASCII, where each rune takes only 1 byte, so it's identical to conventional ASCII
        - A high-order `110` indicates that the rune takes 2 bytes; the second byte begins with `10`

        ```
        0xxxxxxx                             runes 0−127     (ASCII)
        110xxxxx 10xxxxxx                    128−2047        (values <128 unused)
        1110xxxx 10xxxxxx 10xxxxxx           2048−65535      (values <2048 unused)
        // 最大值是 2^(x 的位数) - 1，上一组范围内的数没被使用到

        11110xxx 10xxxxxx 10xxxxxx 10xxxxxx  65536−0x10ffff  (other values unused)
        ```

    - A variable-length encoding precludes direct indexing to access the `n`-th character of a string, but UTF-8 has many desirable properties to compensate. The encoding is compact, compatible with ASCII, and self-synchronizing: it's possible to find the beginning of a character by backing up no more than three bytes. It's also a prefix code, so it can be decoded from left to right without any ambiguity or lookahead. No rune's encoding is a substring of any other, or even a sequence of others, so you can search for a rune by just searching its bytes, without worrying about the preceding context. The lexicographic byte order equals the Unicode code point order, so sorting UTF-8 works naturally. There're no embedded NUL (zero) bytes, which is convenient for programming languages that use NUL to terminate strings
    - The `unicode` package provides functions for working with individual runes, and the `unicode/utf8` package provides functions for encoding and decoding runes as bytes using UTF-8
- Many Unicode characters are hard to type on a keyboard or to distinguish visually from similar-looking ones; some are invisible. Unicode escapes in Go string literals allow us to specify them by their numeric code point value
    - Two forms: `\uhhhh` for a 16-bit value and `Uhhhhhhhh` for a 32-bit value, where each `h` is a hexadecimal digit

    ```go
    "BF"
    "\xe4\xb8\x96\xe7\x95\x8c" // 1110,0100 10,111000 10,010110, 去掉 1110, 10, 10 连起来即是 4e16 (100111000010110)
    "\u4e16\u754c"
    "\U00004e16\U0000754c"
    ```

- Unicode escapes may also be used in rune literals
    - `'B' '\u4e16' '\U00004e16'` are equivalent
    - A rune whose value is less than 256 may be written with a single hexadecimal escape, such as `'\x41'` fro `'A'`, but for higher values, a `\u` or `\U` escape must be used. Consequently, `\xe4\xb8\x96` is not a legal rune literal literal, even though those 3 bytes are a valid UTF-8 encoding of a single code point
- Thanks to the nice properties of UTF-8, many string operations don't require decoding

    ```go
    func HasPrefix(s, prefix string) bool {
        return len(s) >= len(prefix) && s[:len(prefix)] == prefix
    }
    func hasSuffix(s, suffix string) bool {
        return len(s) >= len(suffix) && s[len(s)-len(suffix):] == suffix
    }
    func Contains(s, substr string) bool {
        for i := 0; i < len(s); i++ {
            if HasPrefix(s[i:], substr) {
                return true
            }
        }
        return false
    }
    ```

- Individual Unicode characters

    ```go
    s := "Hello, 世界"
    fmt.Println(len(s)) // "13"
    fmt.Println(utf8.RuneCountInString(s)) // "9"

    for i := 0; i < len(s); {
        r, size := utf8.DecodeRuneInString(s[i:])
        fmt.Printf("%d\t%c\n", i, r)
        i += size
    }

    for i, r := range "Hello, 世界" {
        fmt.Printf("%d\t%q\t%d\n", i, r, r)
    }

    // count the number of runes in a string
    n :=0
    for range s {
        n++
    }
    utf8.RuneCountInString(s)
    ```

    - Each call to `DecodeRuneInString` return `r`, the rune itself, and `size`, the number of bytes occupied by the utf-8 encoding of `r`
    - Go's `range` loop, when applied to a string, performs UTF-8 decoding implicitly
    - Each time a UTF-8 decoder, whether explicit in a call to `utf8.DecodeRuneInString` or implicit in a `range` loop, consumes an unexpected input byte, it generates a special Unicode replacement character, `'\uFFFD'` (usually printed as a white question mark inside a black hexagonal or diamond-like shape)
        - When a program encounters this rune value, it's often a sign that some upstream part of the system that generated the string data has been careless in its treatment of text encodings
- UTF-8 is exceptionally convenient as an interchange format but within a program runes may be more convenient because they are of uniform size and are thus easily indexed in arrays and slices
- A `[]rune` conversion applied to a UTF-8 encoded string returns the sequence of unicode points that the string encodes

    ```go
    // "program" in Japanese katakana
    s := "プログラム"
    fmt.Printf("% x\n", s) // "e3 83 97 e3 83 ad e3 82 b0 e3 83 a9 e3 83 a0"
    r := []rune(s)
    fmt.Printf("%x\n", r) // "[30d7 30ed 30b0 30e9 30e0]"
    fmt.Println(string(r)) // "プログラム"
    fmt.Println(string(65)) // "A", not "65"
    fmt.Println(string(0x4eac)) // "京"
    fmt.Println(string(1234567)) // �
    ```

    - The verb `% x` inserts a space between each pair of hex digits
    - If a slice of runes is converted to a string, it produces the concatenation of the UTF-8 encoding of each rune
    - Converting an integer value to a string interprets the integer as a rune value, and yields the UTF-8 representation of that rune. If the rune is invalid, the replacement character is substituted
### Strings and Byte Slices
- 4 important standard packages for manipulating string
    1. `strings`
        - Searching, replacing, comparing, trimming, splitting, and joining strings
    2. `bytes`
        - Similar functions for manipulating slices of bytes, of type `[]byte`
        - Because strings are immutable, building up strings **incrementally** can involve a lot of allocation and copying. In such cases, it's more efficient to use the `bytes.Buffer` type
    3. `strconv`
        - Converting boolean, integer, and floating-point values to and from their string representations, and functions for quoting and unquoting strings
    5. `unicode`
        - Provides functions like `IsDigit`, `IsLetter`, `IsUpper`, and `IsLower` for classifying runes. Converting functions like `ToUpper` and `ToLower` convert a rune into the given case if it's a letter
            - All these functions use the Unicode standard categories for letters, digits, and so on
            - The `strings` package has similar functions, also called `ToUpper` and `ToLower`, that return a new string with the specified transformation applied to each character of the original string
- The `path` package works with slash-delimited paths on any platform. `path/filepath`
- Strings can be converted to byte slices and back again

    ```go
    s := "abc"
    b := []byte(s)
    s2 := string(b)
    ```

    - `[]bytes(s)` allocates a new byte array holding a copy of the bytes `s`, and yields a slice that references the entirety of that array
        - An optimizing compiler may be able to avoid the allocation and copying in some cases, but in general copying is required to ensure that the bytes of `s` remain unchanged even if those of `b` are subsequently modified
    - `string(b)` also makes a copy, to ensure immutability of the resulting `s2`
- To avoid conversions and unnecessary memory allocation, many of the utility functions in the `bytes` package directly parallel their counterparts in the `strings` package
- The `bytes` package provides the `Buffer` type for efficient manipulation of byte slices
    - A `Buffer` starts out empty but grows as data of types like `string`, `byte`, and `[]byte` are written to it
    - When appending the UTF-8 encoding of an arbitrary rune to `bytes.Buffer`, it's best to use `bytes.Buffer`'s `WriteRune` method, but `WriteByte` is fine for ASCII characters
    - The `bytes.Buffer` type is extremely versatile. It may be used as **a replacement for a file** whenever an an I/O function requires **a sink for bytes** (`io.Writer`), or **a source of bytes** (`io.Reader`)
### Conversions between strings and numbers
- `fmt.Sprintf`; `strconv.Itoa` (integer to ASCII)
    - `fmt.Println(fmt.Sprintf("%d", 123), strconv.Itoa(123)) // 123 123`
- `FormatInt` and `FormatUint` can be used to format numbers in a different base
    - `fmt.Println(strconv.FormatInt(int64(123), 2)) // 1111011`
    - The `fmt.Printf` verbs `%b`, `%d` `%o`, and `%x` are often more convenient than `Format` functions, especially when we want to include additional information besides the number
    - `s := fmt.Sprintf("x=%b", 123)`
- To parse a string representing an integer, use the `strconv` functions `Atoi` or `ParseInt`, or `ParseUint` for unsigned integers

    ```go
    x, err := strconv.Atoi("123")
    y, err := strconv.ParseInt("123", 10, 64) // base 10, up to 64 bits
    ```

    - The third argument of `ParseInt` gives the size of the integer type that the result must fit into. 16 implies `int16`, `0` implies `int`. In any case, the type of the result `y` is always `int64`, which you can then convert to a smaller type
    - Sometimes `fmt.Scanf` if useful for parsing input that consists of orderly mixtures fo strings and numbers all on a single line, but it can be inflexible, especially when handing incomplete or irregular input
## Constants
- Constants are expressions whose value is known to the compiler and whose evaluation is guaranteed to occ ur at comp ile time, not at run time
- The underlying typ e of every constant is a basic type: boolean, string, or number
- A constant declaration may specify a type as well as a value, but in the absence of an explicit type, the type is **inferred** from the expression on the right-hand side
- When a sequence of constants is declared as a group, the right-hand side expression may be omitted for all but the first of the group, implying that the previous expression and its type should be used again

    ```go
    const (
        a = 1
        b
        c = 2
        d
    )
    fmt.Println(a, b, c, d) // 1 1 2 2 
    ```

### `iota`
- Constant generator `iota`
  - The value of `iota` begins at zero and increments by one for each item in the sequence

    ```go
    type Weekday int
    const (
        Sunday Weekday = iota
        Monday
        Tuesday
        Wednesday
        Thursday
        Friday
        Saturday
    )
    const (
        _ = 1 << (10 * iota)
        KiB // 1024
        MiB // 1048576
        GiB // 1073741824
        TiB // 1099511627776 (exceeds 1 << 32)
        PiB // 1125899906842624
        EiB // 1152921504606846976
        ZiB // 1180591620717411303424 (exceeds 1 << 64)
        YiB // 1208925819614629174706176
    )
    ```

### Untyped Constants
- A constant can have any of the basic types like `int` or `float64`, including named basic types like `time.Duration`, many constants are not committed to a particular type
- The compiler represents these uncommitted constants with more precise than machine arithmetic; you may assume at least 256 bits of precision
  - By deferring this commitment, untyped constants not only retain their higher precision until later, but they can participate in many more expressions than committed constants without conversions

    ```go
    // The values ZiB and YiB are too big to store in any integer, but the following expression is legitimate
    fmt.Println(YiB/ZiB) // 1024

    // The floating-point constant math.Pi may be used wherever any floating point or complex value is needed
    // If math.Pi had been committed to a specific type such as float64, the result would not be as precise, and type 
    // conversion would be required to use it when a float32 or complex128 value is wanted
    ```

- There are 6 flavors of these uncommitted constants, called untyped boolean, untyped integer, untyped rune, untyped floating-point, untyped complex, untyped string
  - For literals, syntax determines flavor
    - 0: untyped integer; 0.0: untyped floating-point; 0i: untyped complex; \u0000: untyped rune; true, false: untyped boolean
    - String literals are untyped strings
- Only constants can be untyped. When an untyped constant is assigned to a variable or appears on the right-hand side of a variable declaration with an explicit type, the constants is implicitly converted to the type of that variable if possible
  - Whether implicit or explicit, converting a constant from one type to another requires the target type can represent the original value. Rounding is allowed for real and complex floating-point numbers

    ```go
    const (
        deadbeef = oxdeadbeef   // untyped int with value 3735928559
        a = uint32(deadbeef)    // uint32 with value 3735928559
        b = float32(deadbeef)   // float32 with value 3735928576 (rounded up)
        c = float64(deadbeef)   // float64 with value 3735928559 (exact)
        d = int32(deadbeef)     // compile error: constant overflows int32
    )
    ```

  - In a variable declaration without an explicit type (including short variable declarations), the flavor of the untyped constant implicitly determines the default type of the variable
    - Untyped integers are converted to `int`, whose size is not guaranteed, but untyped floating-point and complex numbers are converted to the explicitly size d types `float64` and `complex128`
    - The language has no unsized `float` and `complex` types analogous to unsized `int`, because it is very difficult to write correct numerical algorithms without knowing the size of one’s floating-point dat a types
  - To give the variable a different type, we must explicitly convert the untyped constant to the desired type or state the desired type in the variable declaration
    - These defaults are particularly important when converting an untyped constant to an interface value since they determine its dynamic type

    ```go
    var i = int8(0)
    var i int8 = 0
    ```

# Composite Types
- Arrays and structs are **aggregate types**; their values are **concatenations of other values in memory**
- Arrays are homogeneous—their elements all have **the same type**—whereas structs are heterogeneous
- Both arrays and structs are **fixed size**
- Slices and maps are dynamic dat a structures that grow as values are added
## Arrays
- The elements of a new array variable are initially set to the zero value for the element type

    ```go
    var a [3]int
    // Print the indices and elements
    for i, v := range a {
        fmt.Printf("%d %d\n", i, v)
    }

    var q [3]int = [3]int{1, 2, 3}
    var r [3]int = [3]int{1, 2}

    // ellipsis
    q := [...]int{1, 2, 3}
    fmt.Printf("%T\n", q) // "[3]int"
    ```

- **The size of an array is part of its type**, so `[3]int` and `[4]int` are different types
- The size must be a constant expression, that is, an expression whose value can be computed as the program is being **compiled**
- It's possible to specify a list of index and value pairs. In these form, indices can appear in any order and some may be omitted

    ```go
    type Currency int
    const (
        USD Currency = iota
        EUR
        GBP
        RMB
    )
    symbol := [...]string{USD: "$", EUR: "9", GBP: "!", RMB: """}
    
    r := [...]int{99: -1}
    ```

- If an array’s element type is comparable then the array type is comparable too, so we may **directly compare two arrays** of that type using the `==` operator, which reports whether all corresponding elements are equal. The `!=` operator is its negation

    ```go
    import "crypto/sha256"
    func main() {
        c1 := sha256.Sum256([]byte("x"))
        c2 := sha256.Sum256([]byte("X"))
        fmt.Printf("%x\n%x\n%t\n%T\n", c1, c2, c1 == c2, c1)
        // Output:
        // 2d711642b726b04401627ca9fbac32f5c8530fb1903cc4db02258717921a4881
        // 4b68ab3847feda7d6c62c1fbcbeebfa35eab7351ed5e78f4ddadea5df64b8015
        // false
        // [32]uint8
    }
    ```

    - `%x` to print all the elements of an array or slice of bytes in hexadecimal, `%t` to show a boolean, and `%T` to display the type of a value
- When a function is called, a copy of each argument value is assigned to the corresponding parameter variable, so the function receives a copy, not the original. Passing large arrays in this way can be inefficient, and any changes that the function makes to array elements affect only the copy, not the original. In this regard, Go treats arrays like any other type, but this behavior is different from languages that implicitly pass arrays by reference
  - We can explicitly pass a pointer to an array

    ```go
    // zeroes the contents of a[32]byte array
    func zero(ptr *[32]byte) {
        for i := range ptr {
            ptr[i] = 0
        }
    }
    // version 2
    func zero(ptr *[32]byte) {
        *ptr = [32]byte{}
    }
    ```

## Slices
- [ ] indirect how
- A slice type is written `[]T` (looks like an array type without a size)
  - The implicitly creates an array variable of the right size and yields a slice that points to it
- A slice is a lightweight dat a structure that gives access to a subsequence (or perhaps all) of the elements of an array, which is known as the **slice’s underlying array**
- A slice has three components: a pointer, a length, and a capacity
  - The pointer points to the first element of the array that is reachable through the slice, which is not necessarily the array’s first element
  - The length is the number of slice elements; it can’t exceed the capacity, which is usually the number of elements between the start of the slice and the end of the underlying array
    - The built-in functions `len` and `cap` return those values
- Multiple slices can share the same underlying array and may refer to overlapping parts of that array
- The slice operator `s[i:j]`, where `0 ≤ i ≤ j ≤ cap(s)`, creates a new slice that refers to elements `i` through `j-1` of the sequence `s`, which may be an array variable, a pointer to an array, or another slice
  - The resulting slice has `j-i` elements. If `i` is omitted, it’s 0, and if `j` is omitted, it’s `len(s)`. Thus the slice `months[1:13]` refers to the whole range of valid months, as does the slice `months[1:]`; the slice `months[:]` refers to the whole array
- Slicing beyond `cap(s)` causes a panic, but slicing beyond `len(s)` **extends** the slice
- Similarity of the substring operation on strings to the slice operator on `[]byte` slices
  - Both are written `x[m:n]`, and both return a subsequence of the original bytes, sharing the underlying representation so that both operations take **constant time**
  - The expression `x[m:n]` yields a string if `x` is a string , or a `[]byte` if `x` is a `[]byte`
- Since a slice contains a pointer to an element of an array, passing a slice to a function permits the function to modify the underlying array elements. In other words, copying a slice creates an alias (§2.3.2) for the underlying array

    ```go
    // reverses a slice of ints in place
    func reverse(s []int) {
        for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
            s[i], s[j] = s[j], s[i]
        }
    }
    ```

    - A simple way to rotate a slice left by `n` elements is to apply the `reverse` function three times
- Slices are not comparable, so we cannot use `==` to test whether 2 slices contain the same elements
  - Two reasons
    1. The elements of a slice are indirect, making it possible for a slice to **[ ] contain itself**. This makes deep equivalence problematic: not simple, not efficient, not obvious
    2. Because slice elements are indirect, **a fixed slice value may contain different elements**
       - Because a hash table such as Go’s **`map` type makes only shallow copies of its keys**, it requires that equality for each key remains the **same** throughout the lifetime of the hash table. Deep equivalence would thus make slices unsuitable for use as map keys
       - 同一个切片在不同阶段可能包含不同元素；哈希表只对 key 做浅拷贝，需要保持 key 在哈希表的整个生命周期都保持不变，对于切片而言，除非用深比较才能确定是否是同一个切片，所以切片不适合作哈希表的 key
           - For reference types like pointers and channels, the `==` operator tests reference identity, that is, whether the two entities refer to the same thing. An analogous "shallow" equality test for slices could be useful, and it would solve the problem with maps, but the **inconsistent** treatment of slices and arrays by the `==` operator would be confusing. The safest choice is to disallow slice comparisons altogether
           - 若切片的相等比较实现的引用的比较，可以解决切片不能作为哈希表 key 的问题，但会造成和数组的相等比较逻辑不一致的问题，我已干脆不允许切片之间的相互比较
  - The only legal slice comparison is against `nil`
  - The standard library provides the highly optimized `bytes.Equal` function for comparing two slices of bytes (`[]byte`)

    ```go
    func equal(x, y []string) bool {
        if len(x) != len(y) {
            return false
        }
        for i := range x {
            if x[i] != y[i] {
                return false
            }
        }
        return true
    }
    ```

- The zero value of a slice type is `nil`
  - A `nil` slice has no underlying array and has length and capacity zero
  - There are also non-nil slices of length and capacity zero, such as `[]int{}` or `make([]int, 3)[3:]`
  - As with any type that can have `nil` values, the `nil` value of a particular slice type can be written using a conversion expression such as `[]int(nil)`

    ```go
    var s []int // len(s) == 0, s == nil
    s = nil // len(s) == 0, s == nil
    s = []int(nil) // len(s) == 0, s == nil
    s = []int{} // len(s) == 0, s != nil
    ```

    - Use `len(s) == 0`, not `s == nil` to test whether a slice is empty
    - Other than comparing equal to `nil`, a `nil` slice behaves like any other zero-length slice; `reverse(nil)` is perfectly safe, for example
    - Unless clearly documented to the contrary, Go functions should treat all zero-length slices the same way, whether `nil` or non-nil
- The built-in function `make` creates a slice of a specified element type, length, and capacity. The capacity argument may be omitted, in which case the capacity equals the length
  - Under the hood, `make` creates an unnamed array variable and returns a slice of it; the array is accessible only through the returned slice

    ```go
    make([]T, len)
    make([]T, len, cap) // same as make([]T, cap)[:len]
    ```

### `append`
- The built-in `append` appends items to slices

    ```go
    var runes []rune
    for _, r := range "hello, 世界" {
        runes = append(runes, r)
    }
    fmt.Printf("%q\n", runes) // ['h' 'e' 'l' 'l' 'o' ',' ' ' '世' '界']
    // approach 2 - built-in conversion
    []rune("hello, 世界")
    ```

    ```go
    func appendInt(x []int, y ...int) []int {
        var z []int
        zlen := len(x) + len(y)
        if zlen <= cap(x) {
            // there's to grow, extend the slice
            z = x[:zlen]
        } else {
            // There is insufficient space. Allocate a new array
            // Grow by doubling, for amortized linear complexity
            zcap := zlen // 0 to 1
            if zcap < 2*len(x) {
                zcap = 2 * len(x)
            }
            z = make([]int, zlen, zcap)
            copy(z, x)
        }
        // z[len(x)] = y
        copy(z[len(x):], y)
        return z
    }
    func main() {
        var x, y []int
        for i := 0; i < 10; i++ {
            y = appendInt(x, i)
            fmt.Printf("%d  cap=%d\t%v\n", i, cap(y), y)
            x = y
        }
    }
    ```

    - Built-in function `copy` copies elements from one slice to another of the same type
      - Its first argument is the destination and its second is the source, resembling the order of operands in an assignment like dst = src
      - The slices may refer to the same underlying array; they may even overlap
      - `copy` returns the number of elements actually copied, which is the **smaller** of the two slice lengths, so there is no danger of running off the end or overwriting something out of range
    - Expanding the array by doubling its size at each expansion avoids an excessive number of allocations and ensures that appending a single element takes constant time on average
- The built-in `append` function may use a more sophisticated growth strategy than `appendInt`'s simplistic one
  - Usually we don’t know whether a given call to append will cause a reallocation, so we can’t assume that the original slice refers to the same array as the resulting slice, nor that it refers to a different one
  - Similarly, we must not assume that operations on elements of the old slice will (or will not) be reflected in the new slice
  - As a result, it’s usual to assign the result of a call to `append` to the same slice variable whose value we passed to `append` (`runes = append(runes, r)`)
  - The built-in `append` lets us add more than one new element, or even a whole slice of them

    ```go
    var x []int
	x = append(x, 2, 3)
	x = append(x, x...) // append the slice x
	fmt.Println(x)
    ```

- **Updating the slice variable** is required not just when calling `append`, but for any function that may change the length or capacity of a slice or make it refer to a different underlying array
- To use slices correctly, it’s important to bear in mind that although the elements of the underlying array are indirect, the slice’s pointer, length, and capacity are not. To update them requires an assignment. In this respect, slices are not "pure" reference types but resemble an aggregate type such as this struct:

    ```go
    type IntSlice struct {
        ptr *int
        len, cap int
    }
    ```

### In-Place Slice Techniques

```go
// returns the non-empty ones of a list of strings
func nonempty(strings []string) []string {
    i := 0
    for _, s := range strings {
        if s != "" {
            strings[i] = s
            i++
        }
    }
    return strings[:i]
}
func nonempty2(strings []string) []string {
    out := strings[:0]
    for _, s := range strings {
        if s != "" {
            out = append(out, s)
        }
    }
    return out
}
```

```go
// implement a stack
// given an initially empty slice stack
stack = append(stack, v) // push v
top := stack[len(stack)-1] // top of stack
stack = stack[:len(stack)-1] // pop
```

```go
// remove an element (using index) from the middle of a slice
// preserving the remaining order
func remove(slice []int, i int) []int {
    copy(slice[i:], slice[i+1,:])
    return slice[:len(slice)-1]
}
// not preserving order
func remove1(slice []int, i int) []int {
    slice[i] = slice[len(slice)-1]
    return slice[:len(slice)-1]
}
```

## Map
- A hash table an **unordered** collection of key/value pairs in which all the **keys are distinct**, and the value associated with a given key can be retrieved, updated, or removed using a **constant number of key comparison** on the average, no matter how large the hash table
- In Go, a `map` (`map[K]V`) is a reference to a hash table
  - All of the keys in a given map are of the same type, and all of the values are of the same type, but the keys need not be of the same type as the values
  - The key type `K` must be comparable using `==`, so that the map can test whether a given key is equal to one already within it
    - Though floating-point numbers are comparable, it’s a bad idea to compare floats for equality and, especially bad if `NaN` is a possible value
  - There are no restrictions on the value type `V`

    ```go
    age := make(map[string]int)
    age["a"] = 1

    ages := map[string]int{
        "a": 1,
        "b": 2
    }
    delete(ages, "a")
    ages["bob"] = ages["bob"] + 1
    
    for name, age := range ages {
        fmt.Printf("%s\t%d\n", name, age)
    }
    ```

    - A map lookup using a key that isn’t present returns the zero value for **the value type**
    - Cannot take a map element's address
        - One reason is that growing a map might cause rehashing of exist ing elements into new storage locations, thus potentially invalidating the address
    - Unordered
        - The order of map iteration is unspecified, and different implementations might use a different hash function, leading to a different ordering
            - [ ] 根据不同算法生成的 hash 随机分配内存地址？
        - In practice, the order is random, varying from one execution to the next. This is intentional, making the sequence vary helps force programs to be robust across implementations
        - Must sort the keys explicitly

        ```go
        // if keys are strings
        import "sort"
        var name []string
        // or
        // names := make([]string, 0, len(ages))
        for name := range ages {
            names = append(names, name)
        }
        sort.Strings(name)
        for _, name := range names {
            fmt.Println("%s\t%d\n", name, ages[name])
        }
        ```

    - The zero value for a map is `nil`, a reference to no hash table at all

        ```go
        var ages map[string]int
        ages == nil // true
        len(ages) // 0
        ```

        - Most operations on maps, including lookup, `delete`, `len`, and `range` loops, are safe to perform on a `nil` map reference, since it behaves like an empty map
        - Storing to a `nil` map causes a panic. Must **allocate** the map before you can store into it (use `make` or map literal on declaration)
    - Accessing a map element by subscripting always yields a value (corresponding value or zero value for the value type)

        ```go
        // detect non-existence value
        age, ok := ages["bob"]
        if !ok { /* "bob" not a key in map */}
        // combined
        if age, ok := ages["bob"]; !ok {}
        ```

- Maps cannot be compared to each other; the only legal comparison is with `nil`

    ```go
    // compare map
    func equal(x, y map[string]int) bool {
        if (len(x) != len(y)) {
            return false
        }
        for k, xv := range x {
            if yv, ok := y[k]; !ok || yv != xv {
                return false
            }
        }
        return true
    }
    ```

- Map serves `set` purpose

    ```go
    func main() {
        seen := make(map[string]bool)
        input := bufio.NewScanner(os.Stdin)
        for input.Scan() {
            line := input.Text()
            if !seen[line] {
                seen[line] = true
                fmt.Println(line)
            }
        }
        if err := input.Err(); err != nil {
            fmt.Fprintf(os.Stderr, "dedup: %v\n", err)
            os.Exit(1)
        }
    }
    ```

- Use slices as map key
    1. Define a helper function `k` that maps each key to a string
    2. Create a map whose keys are strings, applying the helper function to each key before accessing the map

    ```go
    // record the number of times Add has been called with a given list of strings
    var m = make(map[string]int)
    // convert a slice of strings into a single string
    func k(list []string) string { return fmt.Sprintf("%q", list) }

    func Add(list []string) { m[k(list)]++ }
    func Count(list []string) int { return m[k(list)] }
    ```

- Computes counts of Unicode characters

    ```go
    package main
    import (
        "bufio"
        "fmt"
        "io"
        "os"
        "unicode"
        "unicode/utf8"
    )
    func main() {
        counts := make(map[rune]int)
        var utflen = [utf8.UTFMax + 1]int // count of lengths of UTF-8 encodings
        invalid := 0 // count of invalid UTF-8 characters
        in := bufio.NewReader(os.Stdin)
        for {
            r, n, err := in.ReadRune() // returns rune, nbytes (the length in bytes of its UTF-8 encoding), error
            if err == io.EOF {
                break
            }
            if err != nil {
                fmt.Fprintf(os.Stderr, "charcount: %v\n", err)
                os.Exit(1)
            }
            if r == unicode.ReplacementChar && n == 1 {
                invalid++
                continue
            }
            counts[r]++
            utflen[n]++
        }
        fmt.Printf("rune\tcount\n")
        for c, n := range counts {
            fmt.Printf("%q\t%d\n", c, n)
        }
        fmt.Print("\nlen\tcount\n")
        for i, n := range utflen {
            if i > 0 {
                fmt.Printf("%d\t%d\n", i, n)
            }
        }
        if invalid > 0 {
            fmt.Printf("\n%d invalid UTF-8 characters\n", invalid)
        }
    }
    ```

# Struct
- A struct is an aggregate dat a type that groups together zero or more named values of arbitrary types as a single entity
    - Each value is called a filed
    - Fields are variables too
    - The individual field is accessed using **dot notation** or through a pointer
        - Dot notation also works with a pointer to a struct

    ```go
    type Employee struct {
        ID              int
        Name, Address   string
        DoB             time.time
        Salary          int
        Position        string
    }
    var sb Employee

    sb.Salary += 1000
    position := &sb.Position
    *position = "Senior " + *position

    var employeeOfMonth *Employee = &sb
    // the following two statements are equivalent
    employeeOfTheMonth.Position += " (proactive team player)"
    (*employeeOfTheMonth).Position += " (proactive team player)"
    ```

    - [ ] the assignment statement would not compile since its left-hand side would not identify a variable (tested and not true)
- Consecutive fields of the same type may be combined
- Field order is significant to type identity, different order means different struct type
    - 顺序不同，底层分配的空间不同，不同的 field 占据不同的连续空间
- The name of a struct filed is exported if it begins with a capital letter
- A named struct type `S` cant declare a field with the same type `S`: an aggregate value cannot contain itself (an analogous restriction applies to array)
    - `S` may declare a filed of the type `*S`

    ```go
    // tree-sort 二叉树
    type tree struct {
        value       int
        left, right *tree
    }
    // sorts values in place
    func Sort(values []int) {
        var root *tree
        for _, v := range values {
            root = add(root, v)
        }
        appendValues(values[:0], root)
    }
    // appends the elements of t to values in order and returns the resulting slice
    func appendValues(values []int, t *tree) []int {
        if t != nil {
            values = appendValues(values, t.left)
            values = append(values, t.value)
            values = appendValues(values, t.right)
        }
        return values
    }
    func add(t *tree, value int) *tree {
        if t == nil {
            t = new(tree)
            t.value = value
            return t
        }
        if value < t.value {
            t.left = add(t.left, value) // 递归更新一侧叶子节点
        } else {
            t.right = add(t.right, value)
        }
        return t
    }
    ```

- The zero value for a struct is composed of the zero values of each of its fields
    - In `bytes.Buffer`, the initial values of the struct is a ready-to-use empty buffer
    - The zero value of `sync.Mutex` is a ready-to-use unlocked mutex
- The struct type with no fields is called the empty struct, written `struct{}`
    - Some use it instead of `bool` as the value type of a map that represents a set, to emphasize that only the keys are significant, but the space saving is marginal and the syntax more cumbersome
## Struct literals
- Two forms

    ```go
    type Point struct{ X, Y int }
    p := Point{1, 2} // requires a value for every field, in the right order
    ```

    - Second form is initializing a struct by listing some or all of the field name and their corresponding values

    ```go
    // unexported identifiers can not be referred to from another package
    package p
    type T struct{ a, b int }
    package q
    import "p"
    var _ = p.T{a: 1, b: 2} // compile error: can't reference a, b
    var _ = p.T{1, 2} // compile error: can't reference a, b
    ```

- Struct values can be passed as arguments to functions and returned from them
- For efficiency, larger struct types are usually passed to or returned from functions indirectly using a pointer

    ```go
    func Scale(p Point, factor int) Point {
        return Point{p.X * factor, p.Y * factor}
    }
    func Bonus(e *Employee, percent int) int {
        return e.Salary * percent / 100
    }
    ```

- Go is a call-by-value language, the called function receives only a copy of an argument, not a reference to the original argument
- Shorthand notation to create and initialize a `struct` and obtain its address

    ```go
    pp := &Point{1, 2}
    // equivalent to 
    pp := new(Point)
    *pp = Point{1, 2}
    ```

    - `&Point{1, 2}` can be used directly within an expression, such as function calls
## Comparing structs
- If all the fields of a struct are comparable, the struct itself is comparable
- The `==` operation compares the corresponding fields of structs in order
- Comparable struct types (like other comparable types) can be used as the key type of a map

    ```go
    type address struct {
        hostname    string
        port        int
    }
    hits := make(map[address]int)
    hits[address{"golang.org", 443}]++
    ```

## Struct embedding and anonymous fields
- Use one named struct type as an **anonymous field** of another struct (syntactic shortcut)
    - Go let us declare a field with a type but no names (embedding). The type of the field must be a named type or a pointer to a named type
    - No corresponding shorthand for the struct literal syntax

    ```go
    type Point struct {
        X, Y int
    }
    type Circle struct {
        Point
        Radius int
    }
    type Wheel struct {
        Circle
        Spokes int
    }
    var w Wheel
    w.X = 8 // equivalent to w.Circle.Point.X = 8

    w = Wheel{8, 8, 5, 20} // compile error
    w = Wheel{X: 8， Y: 8， Radius: 5, Spokes: 20} // compile error
    
    w = Wheel{Circle{Point{8, 8}, 5}, 20}
    // trailing comma necessary
    w = Wheel{
        Circle: Circle {
            Point: Point{X: 8, Y: 8},
            Radius: 5,
        }
        Spokes: 20,
    }
    fmt.Printf("%#v\n", w)
    // the # adverb causes Printf's %v verb to display values in a form similar to Go syntax
    ```

- Because anonymous fields have implicit names, you can't have two anonymous fields of the same types since their names would conflict
- Because the name of the field is implicitly determined by its type, so is the visibility of the field

    ```go
    // point and circle being unexported
    w.X = 8 // still valid
    // the explicit long form would be forbidden outside the declaring package `w.circle.point.X = 8`
    ```

- Anonymous fields can be any named type or pointer to a named type
    - The shorthand notation used for selecting the fields of an embedded type works for selecting its methods as well
    - The outer struct type gains not just the fields of the embedded type but its methods too
    - This mechanism is the main way that complex object behaviors are composed from simpler ones
# JSON
- `encoding/json` package
- JSON is an encoding of JavaScript values as Unicode text
- JSON type strings are sequences of Unicode points enclosed in double quotes, with backslash escapes using a similar notation to Go, though JSON's `\uhhhh` numeric escapes denote UTF-16 codes, not runes
- Converting a Go data structure to JSON is called marshaling done by `json.Marshal`
    - Marshal produces a byte slice containing a very long string with no extraneous white space (hard to read)
- `json.MarshalIndent` produces neatly indented output
    - Two additional arguments define a prefix for each line of output and a string for each level of indentation
- Marshaling uses the Go struct field names as the filed names for the JSON objects(through reflection)
- Only exported fields are marshaled
- A field tag is a string of metadata associated at compile time with the field of a struct
    - It can be any literal string, but it's conventionally interpreted as a space-separated list of `key:"value"` pairs
    - Since they contain double quotation marks, field tags are usually written with raw string literals
    - The `json` key controls the behavior of the `encoding/json` package, and other `encoding/...` packages follow this convention

    ```go
    type Movie struct {
        Title   string
        Year    int     `json:"released"`
        Color   bool    `json:"color, omitempty"`
    }
    ```

    - The first part of the `json` field tag specifies an alternative JSON name for the Go field
        - Often used to specify an idiomatic JSON name like `total_count` for a Go field named `TotalCount`
        - `omitempty` indicates no JSON output should be produced if the field has the **zero value** for its type or is otherwise empty
- The inverse operation to marshaling, decoding JSON and populating a Go data structure, is called unmarshaling (`json.Unmarshal`)

    ```go
    var titles []struct{ Title string }
    if err := json.Unmarshal(data, &titles); err != nil {
        log.Fatalf("JSON unmarshaling failed: %s", err")
    }
    fmt.Println(titles)
    ```

    - By defining suitable Go data structures in this way, we can select which parts of the JSON input to decode and which to discard
- The query terms presented by a user could contain characters like `?` and `&` that have special meaning in a URL, use `url.QueryEscape` to ensure they are taken **literally**

    ```go
    // Package github provides a Go API for the GitHub issue tracker.
    // See https://developer.github.com/v3/search/#search-issues.
    package github

    import "time"
    const IssuesURL = "https://api.github.com/search/issues"
    type IssuesSearchResult struct {
        TotalCount int `json:"total_count"`
        Items []*Issue
    }
    type Issue struct {
        Number int
        HTMLURL string `json:"html_url"`
        Title string
        State string
        User *User
        CreatedAt time.Time `json:"created_at"`
        Body string // in Markdown format
    }
    type User struct {
        Login string
        HTMLURL string `json:"html_url"`
    }
    /* --- */
    package github

    import (
        "encoding/json"
        "fmt"
        "net/http"
        "net/url"
        "strings"
    )
    func SearchIssues(terms []string) (*IssueSearchResult, error) {
        q := url.QueryEscape(string.Join(terms, " "))
        resp, err := http.Get(IssuesURL + "?q=" + q)
        if (err != nil) {
            return nil, err
        }
        // must close resp.Body on all execution paths (`defer` could make this simpler)
        if resp.StatusCode != http.StatusOK {
            resp.Body.Close()
            return nil, fmt.Errorf("search query failed: %s", resp.Status)
        }
        var result IssuesSearchResult
        if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
            resp.Body.Close()
            return nil, err
        }
        resp.Body.Close()
        return &result, nil
    }
    /* Issues prints a table of GitHub issues matching the search terms */
    package main

    import (
        "fmt"
        "log"
        "os"
        "gopl.io/ch4/github"
    )
    func main() {
        result, err := github.SearchIssues(os.Args[1:])
        if err != nil {
            log.Fatal(err)
        }
        fmt.Printf("%d issues:\n", result.TotalCount)
        for _, item := result.Items {
            fmt.Printf("#%-5d %9.9s %.55s\n", item.Number, item.User.Login, item.Title)
        }
    }
    // go build gopl.io/ch4/issues
    // ./issues repo:golang/go is:open json decoder
    ```

    - The streaming decoder, `json.Decoder`, allows several JSON entities to be decoded in sequence from the same stream
# Text and HTML templates
- `text/template` and `html/template` provide a mechanism for substituting the values of variables into a text or HTML template
    - Separate the format from the code more completely
- A template is a string or file containing one or more portions enclosed in double braces, `{{...}}`, called actions
    - Most of the string is printed literally, but the actions trigger other behaviors
    - Each action contains an expression in the template language, a simple but powerful natation for printing values, selecting struct fields, calling functions and methods, expressing control flow such as `if-else` and `range` loops, and instantiating other templates

    ```go
    const templ = `{{.TotalCount}} issues:
    {{range .Items}}-----------------------------------
    Number: {{.Number}}
    User:   {{.User.Login}}
    Title:  {{.Title | pritf "%.64s"}}
    Age:    {{.CreateAt | daysAgo}} days
    {{end}}`
    func daysAgo(t time.Time) int {
        return int(time.Since(t).Hours() / 24)
    }
    ```

    - Within an action, there's a notion of the current value, referred to as "dot"
    - [ ] The dot initially refers to the template's parameter
    - `{{range .Items}}` and `{{end}}` actions create a loop
    - Within an action, the `|` notation makes the result of one operation the argument of another, analogous to a Unix shell pipeline
    - `printf` function is a built-in synonym for `fmt.Sprintf` in all templates
- A type may control its string formatting by defining certain methods, it may also define methods to control its JSON marshaling and unmarshaling behavior
    - The JSON-marshaled value of a `time.Time` is a string in a standard format
- Producing output with a template requires two steps
    1. Parse the template into a suitable internal representation
        - Parsing needs be done only once
    2. Execute it on specific inputs

    ```go
    report, err := template.New("report").
        Funcs(template.FuncMap{"daysAgo", daysAgo}).
        Parse(templ)
    if err != nil {
        log.Fatal(err)
    }
    ```

    - `template.New` creates and returns a template; `Func` adds `daysAgo` to the set of functions accessible within this template, then returns that template; `Parse` is called on the result
- Templates are usually fixed at compile time, failure to parse a template indicates a fatal bug
    - The `template.Must` helper function makes error handling more convenient: it accepts a template and an error, checks that the error is `nil` (and panics otherwise), and then returns the template

    ```go
    var report = template.Must(template.New("issuelist").
        Funcs(template.FuncMap{"daysAgo": daysAgo}).
        Parse(templ))
    func main() {
        result, err := github.SearchIssues(os.Args[1:])
        if err != nil {
            log.Fatal(err)
        }
        if err := report.Execute(os.Stdout, result); err != nil {
            log.Fatal(err)
        }
    }
    // go build gopl.io/ch4/issues
    // ./issues repo:golang/go is:open json decoder
    ```

- Had we used the `text/template` instead of `html/template`, the four-character string `"&lt;"` would have been rendered as a less-than character, and the string `"<link>"` would have become a link element
- We can suppress this **auto-escaping** behavior for fields that contain trusted HTML data by using the named string type `template.HTML` instead of `string`
    - Similar named types exist for trusted JavaScript, CSS, and URLs

    ```go
    func main() {
        const templ = `<p>A: {{.A}}</p><p>B: {{.B}}</p>`
        t := template.Must(template.New("escape").Parse(templ))
        var data struct {
            A string            // untrusted plain text
            B template.HTML     // trusted HTML
        }
        data.A = "<b>hello!</b>"
        daba.B = "<b>Hello!</b>"
        if err := t.Execute(os.Stdout. data); err != nil {
            log.Fatal(nil)
        }
    }
    // go doc html/template
    ```
























100-110 2019年01月14日