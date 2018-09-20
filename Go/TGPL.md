<!-- The Go Programming Language -->
# 1. Tutorial
- > [Go Blog](https://blog.golang.org)
- > [Go Playground](https://play.golang.org)
- > [Standard library](https://golang.org/pkg)
- > [Book's source code](http://gopl.io)
- > Fetch source code 
    - `go get gopl.io/ch1/helloworld`
- Communicating Sequential Process (CSP)
    - A program is a parallel composition of processes that have no shared state; the processes communicate and synchronize using channels
- Packages
    - Go code is organized into packages 
    - A package consists of one or more `.go` source files in a single directory that define what the package does
    - Each source file begins with a `package` declaration that states which package the file belongs to, followed by a list of other packages that it imports
        - The `import` declarations must follow the `package` declaration
        - The list form of `import` declaration is conventionally used
    - Package `main` defines a standalone executable program, not a library
    - By convention, we describe each package in a comment immediately preceding its package declaration  
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
- `++`, `--`
    - postfix only
    - `i++` is a statement, not an expression
        - so `j = i++` is illegal
- `if`
    - Go allows a simple statement such as a local variable to precede the `if` condition
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
    - A method is a function associated with a named type
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
        - [ ] channel blocks, right?
- *channel*
    - A communication mechanism that allows one goroutine to pass values of a **specified type** to another goroutine
- `fmt.printf`
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
    ```
 -->
- dup
    - `Sacnner` reads input and breaks it into lines or words
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
- [ ] lissajous    
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
    - Behind the scenes, server2 runs the handler for each incoming request in a separate goroutine so it can serve multiple requests simultaneously
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
- Go has 2 keywords. They cannot be used as names
    - `break`, `case`, `chan`, `const`, `continue`, `default`, `defer`, `else`, `fallthrough`, `for`, `func`, `go`, `goto`, `if`, `import`, `interface`, `map`, `package`, `range`, `return`, `select`, `struct`, `switch`, `type`, `var`
- Go has about a dozen ***predeclared names*** like `int` and `true` for built-in constants, types, and functions
    - These names are not reserved, there're a handful of places where redeclaring one of them makes sense
- Scope
    - An entity declared within a function is local to that function. An entity declared outside a function is visible in **all files of the package** to which it belongs
- Visibility
    - The case of the first letter of a name determines its visibility ***across package boundaries***
    - A name beginning with an upper-case letter is exported. That means it's visible and accessible outside of its own package and may be referred to by other parts of the program
- Package names are always in lower case
- There' no limit on name length
    - Go programs lean toward short names, especially for local variables with small scopes
    - Generally, the larger the scope of a name, the longer and more meaningful it should be
- Use "camel case"
- The letters of acronyms and initialisms are always rendered **in the same case**
    - `htmlEacape`, `HTMLEscape`
## Declarations
- A declaration names a program entity and specifies some or all of its property
- 4 major kinds of declarations: `var`, `const`, `type`, `func`
-- Functions and other package-level entities may be declared **in any order**
- (`const`, `var`) Declarations may appear at package level(so the names are visible throughout the package) or within a function(so the names are visible only within that function)
## Variables
- A variable is a piece of storage containing a value
- A var declaration creates a variable of a particular type, attaches a name to it, and sets its initial value
    - `var name type = expresssion`
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
    - > tuple assignment: `i, j = j, i` swaps values of `i` and `j`
- `f, err := os.Open(name)`
- A short variable declaration **must declare at least one new variable**
    - If some of variables in a short variable declaration were already declared **in the same lexical block**, then,  for those variables, the short variable declaration acts like an **assignment**
    - A short variable declaration acts like an assignment only to variables that were already in the same lexical scope; declarations in an outer block are ignored
- Declare a string variable
    1. `s := ""`
        - can be used only within a function, not for package-level variables
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
- If a variable is declared `var x int`, the expression `&x` ("address of x") yields a value to an integer variable, that is, a value of type `*int`, which is pronounced "pointer to int"
    - If this value is called `p`, we say "`p` points to `x`", or equivalently "`p` contains the address of `x`"
    - The variable to which `p` points is written `*p`. The expression `*p` yields the value of that variable, an `int`
    - Since `*p` denotes a variable, it may also appear on the left-hand side of an assignment, in which case the assignment updates the variable
- Each component of a variable of aggregate type - a field of a struct or an element of an array - is also a variable and thus also has an address too