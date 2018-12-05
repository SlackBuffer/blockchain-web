- Words in a variable name are better concated with `_`
- `7.5 % 5 = 2.5`
- idle
    - cursor + enter = repeat that command
- `\` always generates a float 
- `2 ** 3` integer, `math.pow(2, 3)` float
- `""""""`, `''''''`
- `#` comment
- `input([prompt])`
    - Always returns a **string**
- `'=' * 24`
- concatenation
- `abc + str(1)`
- `"{} - {}".format('abc', 1)`, `"{1} - {0}".format('abc', 1)`

    ```python
    name = 'sb'
    a = 'your name is {}'
    a.format(name)
    ```

- String methods
    - `count()`
    - `lower()`, `upper()`, `capitalize()`, `title()`, `isupper()`, `islower()`, `istitle()`, `isalpha()`, `isdigit()`, `isalnum()`
    - `index()`, `find()`
    - `strip()`, `lstrip()`, `rstrip()` (首尾)
        - > `input().strip()`
    - `len()`
- Strings are immutable data type
- `string[start:end:step]`, `'abc'[::-1]`
- Logical operator
    - `not`, `and`, `or`
- List (array)
    - `[]` can slice directly
    - `remove()`(only the first one), `del list[0]` (can delete slice too)