# Functions
## Function declarations
- Declaration

    ```go
    func name(parameter-list) (result-list) {
        body
    }
    ```

    - Parameter list specifies the names and types of its parameters; the result list specifies the type of the valus that the function returns
    - If the function returns one unnamed result or no results at all, parentheses are optional and usually omitted
    - Leaving off the result list entirely declares a function that does not return any value and is called only for its effects
- Parameter in the declaration; arguments in the call
- A function that has a result list must end with a `return` statement unless execution clearly cannot reach the end of the function (perhaps because the function ends with a call to `panic` or an infinite `for` loop with no `break`)
- 4 ways to declare a function with 2 parameters and 1 result

    ```go
    func add(x int, y int) int      { return x + y }
    func sub(x, y int) (z int)      { z = x - y; return }
    func first(x int, _ int) int    { return x }
    func zero(int, int) int         { return 0 }
    fmt.Printf("%T\n", add) // "func(int, int) int"
    ```

- The type of a function is sometimes called its signature
- Two functions have the same type or signature if they have the same sequence of parameter types and the same sequence of result types
    - The names of parameters and results don't affect the type, nor does whether or not they were declared using the factored form
- Every function must provide an argument for each parameter, in the order in which the parameters were declared
    - Go has no concept of default parameter values, nor any way to specify arguments by name, so the names of parameters and result don't matter to the called except as documentation
- Parameters are local variables within the body of the function, with their initial values set to the arguments supplied by the caller
- Function parameters and named results are variables in the same lexical block as the function's outermost local variables
- Arguments are passed by value, so the function receives a copy of each argument
    - If the argument contains some kind of reference, like a pointer, slice, map, **function**, or channel, then the caller may be affected by any modifications the function makes to variables **indirectly referred** to by the argument
- A function without a body indicates that the function is implemented in a language other than Go

    ```go
    package math
    func Sin(x float64) float64 // implemented in assembly language
    ```

## Recursion
- Functions may call themselves
- The `golang.org/x/...` repositories hold packages designed and maintained by the Go team for application such as networking, internationalized text processing, mobile platform, image manipulation, cryptography, and developer tools
    - These packages are not in the standard library because they're still under development or because they're rarely needed
# Packages and the Go tool
## Import paths
- Each package is identified by unique string called import path
## The package declaration
- A package declaration is required at the start of every Go file
    - Its main purpose is to determine the default identifier for that package when it's imported by another package
- Conventionally, the package name is the last segment of the import path, with 3 major exceptions
    1. A package defining a command (an executable Go program) always has the name `main`, regardless of the package's import path. This is a signal to `go build` that it must invoke the linker to make an executable file
    2. Some files in the directory may have the suffix `_test` on their package name if the file name ends with `_test.go`. Such a directory may define 2 packages: the usual one, plus another called an external test package
        - The `_test` suffix signals to `go test` that it must build both packages, and it indicates which files belong to each package
        - External test packages are used to avoid cycles in the import graph arising from dependencies
    3. Some tools for dependency management append version number suffixes to package import paths, such as `"gopkg.in/yaml.v2"`. The package name excludes the suffix, so in this case it would be just `yaml`
## Import declarations
- A Go source file may contain zero or more `import` declarations immediately after the `package` declaration and before the first non-import declaration
- The order of imported packages is not significant (both `gofmt` and `goimports` will group and sort for you)
- Renaming import

    ```go
    import (
        "crypto/rand"
        mrand "math/rand"
    )
    ```

    - The alternative name affects only the importing file
    - Other file, even ones in the same package, may import the package using its default name, or a different name
- Each import declaration establishes a dependency from the current package to the imported package
- The `go build` tool reports an error if these dependencies form a circle
## Blank imports
- It's an error to import a package into a file but not refer to the name it defines within that file
- On occasion we must import a package merely for the side effects of doing so: evaluation of the initializer expressions of its package-level variables and execution of its `init` function
- Use a renaming import in which the alternative name is `_`, the blank identifier
- This is known as a blank import most often used to implement a compile-time mechanism whereby main program can enable optional features by blank-importing additional packages
- The standard library's `image` package exports a `Decode` function that reads bytes from `io.Reader`, figures out which image format was used to encode the data, invokes the appropriate decoder, then returns the resulting `image.Image`
    - The standard library provides decoders for GIF, PNG, and JPEG, and users may provide others, but to keep executables small, decoders are not included in an application unless explicitly requested
    - The `image.Decode` function consults a table of supported formats
    - An entry is added to the table by calling `image.registerFormat`, typically from within the package initializer of the supporting package for each format
## Packages and naming
- Keep package name short, but not so short as toe be cryptic
- Be descriptive and unambiguous
- Avoid choosing package names that are commonly used for related local variables
- Package name usually take the **singular** form
    - The standard packages `bytes`, `errors`, and `strings` use the plural to avoid hiding the corresponding predeclared types and, in the case of `go/types`, to avoid conflict with a keyword
- Avoid package names that already have other connotations
## The Go tool
- To keep the need for configuration to a minimum, the `go` tool relies heavily on conventions
    - Given the name of a Go source file, the tool can find its enclosing package, because each directory contains a single package and the import path of a package corresponds to the directory hierarchy in the workspace
    - Given the import path of a package, the tool can find the corresponding directory in which it stores object files
### Workspace organization
- https://golang.org/cmd/go/#hdr-GOPATH_environment_variable
    - The `GOPATH` environment variable lists places to look for Go code. On Unix, the value is a colon-separated string. On Windows, the value is a semicolon-separated string. On Plan 9, the value is a list
    - [Set a custom `GOPATH`](https://github.com/golang/go/wiki/SettingGOPATH)
- `GOPATH` specifies the root of the workspace
- When switching to a different workspace, users update the value of `GOPATH`

    ```bash
    export GOPATH=$HOME/gobook
    go get gopl.io/...
    ```

- `GOPATH` has 3 subdirectories
    - `src` holds the source code
        - Each package resides in a directory whose name relative to `$GOPATH/src` is the package's import path. 
            - The path below src determines the import path or executable name
            - A single `GOPATH` workspace contains multiple version-control repositories beneath `src`, such as`gopl.io` or `golang.org`
        - `pkg` is where the build tools store compiled packages
            - The `pkg` directory holds installed package objects
            - As in the Go tree, each target operating system and architecture pair has its own subdirectory of pkg (pkg/GOOS_GOARCH)
            - If DIR is a directory listed in the GOPATH, a package with source in DIR/src/foo/bar can be imported as "foo/bar" and has its compiled form installed to "DIR/pkg/GOOS_GOARCH/foo/bar.a"
        - `bin` holds executable programs
- `GOROOT` specifies the root directory of the Go distribution, which provides all the packages of the **standard library**
    - The directory structure beneath `GOROOT` resembles that of `GOPATH`
    - User never need to set `GOROOT` since, by default, the `go` tool will use the location where it was installed
- `go env`
- `GOOS` specifies the target operation system
- `GOARCH` specifies the target processor architecture
### Downloading packages
- When using the `go` tool, a package's import path indicates not only where to find it in the local workspace, but where to find it on the internet so that `go get` can retrieve and update it
- The `go get` command can download a single package or an entire subtree or repository using the `...` notation
- The tool also computes and downloads all the dependencies of the initial packages
- Once `go get` has downloaded the packages, it builds and then installs the libraries and commands

    ```go
    go get github.com/golang/lint/golint
    $GOPATH/bin/golint gopl.io/ch2/popcount
    ```

- `got get` has support for popular code-hosting sites like GitHub, Bitbucket, and Launchpad and can make the appropriate request to their version-control systems
    - For less well-known sites, you may have to indicate which version-control protocol to use in the import path
    - Run `go help importpath` for the details
- The directories that `go get` creates are true clients of the remote repository, not just copies of the files, so you can use version-control commands to see a diff of local edits you've made or to update to a different revision
- Go lets packages use a custom domain name in their import path while being hosted by a generic service such as googlesource.com or github.com
- `go get -u` will ensure that all packages it visits, including dependencies are updated to their latest version before being build and installed
    - Without `-u`, packages that already exist locally will not be updated
- `go get -u` is  convenient when you're getting started but may be inappropriate for deployed projects, where precise control of dependencies is critical for release hygiene
    - The usual solution is to **vendor** the code, that is, to make a persistent local copy of all the necessary dependencies, and to update this copy carefully and deliberately
    - Prior to Go 1.5, his required changing those package's import paths, so our copy of `golang.org/x/net/html` would become `gopl.io/vendor/golang.org/x/net/html`. More recent versions of the `go` tool support vendoring directly
- `go help gopath`
    - Go 1.6 includes support for using local copies of external dependencies to satisfy imports of those dependencies, often referred to as vendoring
    - Code below a directory named "vendor" is importable only by code in the directory tree rooted at the parent of "vendor", and only using an import path that omits the prefix up to and including the vendor element
### Building packages
- The `go build` command compiles each argument package
    - If the package is a library, the result is discarded; this merely checks that the package is free of compile errors
    - If the package is named `main`, `go build` invokes the linker to create an executable in the current directory; the name of the executable is taken from the last segment of the package's import path
- Since each directory contains one package, each executable program (or command in Unix terminology), requires its own directory
    - These directories are sometimes children of a directory named `cmd`
- Packages may be specified by their import path, or by a relative directory name, which must start with a `.` or `..` segment. If no argument is provided, the current directory is assumed

- https://golang.org/cmd/go/#hdr-GOPATH_environment_variable
- https://golang.org/doc/code.html
- https://go.googlesource.com/proposal/+/master/design/25719-go15vendor.md
- https://blog.altoros.com/golang-internals-part-3-the-linker-and-object-files.html
- https://golang.org/cmd/compile/