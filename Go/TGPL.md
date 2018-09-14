<!-- The Go Programming Language -->
# Tutorial
- communicating sequential process (CSP)
    - a program is a parallel composition of processes that have no shared state; the processes communicate and synchronize using channels
- > [Go Blog](https://blog.golang.org)
- > [Go Playground](https://play.golang.org)
- > [standard library](https://golang.org/pkg)
- [book's source code](http://gopl.io)
- fetch source code 
    - `go get gopl.io/ch1/helloworld`
- Structure
    - Go code is organized into packages 
        - a package consists of one or more `.go` source files in a single directory that define what the package does
        - each source file begins with a `package` declaration that states which package the file belongs to, followed by a list of other packages that it imports
            - the `import` declarations must follow the `package` declaration
            - the list form of `import` declaration is conventionally used
        - package `main` defines a standalone executable program, not a library
    - By convention, we describe each package in a comment immediately preceding its package declaration
    - function `main` is where execution of the program begins
- Semicolons
    - Go does not require semicolons at the end of statements or declarations, except where two or more appear on the same line
    - newlines following certain tokens are converted into semicolons
- Code formatting
    - The `gofmt` tool rewrites code into the standard format, and the `go` tool's `fmt` subcommand applies `gofmt` to all the files in the specified package, or the ones in the current directory by default
        - `gofmt` tool sorts the package names into alphabetical order
    - `goimports` manages the insertion and removal of import declarations as needed
        - > `go get golang.org/x/tools/cmd/goimports`
- If a variable is not explicitly initialized, it's implicitly initialized to the *zero value* of its type
- ***zero vale***
    - numeric type: 0
    - string: `""`
- `++`, `--`
    - postfix only
    - `i++` is a statement, not an expression
        - so `j = i++` is illegal
- `for` loop

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
    ```

    - any of the 3 parts can be omitted
    - the optional initialization **statement** is executed before the loop starts
- `map`
    - holds a set of **`key/value`** pairs
        - the key may be of any type whose value can be compared with `==` (string being the most common example)
        - the value may be of any type
    - provides constant-time operations to store, retrieve or test for an item in the set
    - the order of map iteration is **random**
- `fmt.printf`
    - `%v`: any value in natural format
    - By convention, formatting functions whose names end in `f` use the formatting rules of `fmt.Printf`, whereas those whose names ends in `ln` follow `Println`, formatting their arguments as if by `%v`, followed by a newline
- ***blank identifier***
    - `_`
    - may be used whenever syntax requires a variable name but program logic does not
- declare a string variable
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
    - Functions and other package-level entities may be declared **in any order**
## Command-Line Arguments
- Command-line arguments are available to a program in a variable named `Args` that is part of the `os` package
- The first element of `os.Args`, `os.Args[0]` is the name of the command itself
    - `os.Args[1:len(os.Args)]`, `os.Args[1:]`
    - > `s[m:n]` yields a slice that refers to elements `m` through `n-1`
        - if `m` or `n` is omitted, it defaults to 0 or `len(s)` respectively
- echo

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

- dup

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
    ```

    - `Sacnner` reads input and breaks it into lines or words
    - When the end of the input is reached, `Close` closes the file and releases any resources