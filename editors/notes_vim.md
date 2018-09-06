- commit
    - `a`: input commit message
    - `esc`
    - `:wq`: write and quit vim
    - `:qa!`
# Mode
1. normal mode (**command mode**)
    - everything typed in is interpreted as commands
    - case sensitive
2. insert mode
    - type `i` to enter insert mode
    - press `Esc` to return to command mode
3. (command) line mode
    - type `:` to enter line mode from command mode
# Navigation
- next line: `j`
- previous line: `k`
- move cursor right: `l`, space
- move cursor left: `h`, backspace
- page down: `ctrl-f` (foward)
- page up: `ctrl-b`
- move cursor one word right: `w`
    - consider punctuation as word when using `w`
- move cursor one word left: `W`
    - ignore punctuation and uses whitespace as word boudary
- move cursor one word left: `b`
- move cursor one word left: `B`
- move cursor to the beginning of the line: `0`
- move cursor to the first character of the line: `^` (regular expression)
- go to line
    - command mode
        - `lineNumber-gg`, `lineNumber-G`
        - `gg`: go to first line of the file
        - `G`: go to the last line of the file
    - command line mode
        - `:-lineNumber-enter`
        - `:$`: jump to the end of the file
- move cursor to the end of the line: `$` (regular expression)
- `z-enter`: keep the cursor in the current positon and but move the text up on the screen (near the top of the page, can be configured)
- `ctrl-g`: show file name, file status, cursor position, current line, total lines
    - `g-ctrl-g` shows more detailed information
- `:set ruler`, `:set noruler`, `set ruler!` (toggle)