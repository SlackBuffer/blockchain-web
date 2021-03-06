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
    - `in`
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
    - `in`
    - `[]` can slice directly
    - `remove()`(only the first one), `del list[0]` (can delete slice too)
    - `append()`, `a = a + [1]`, `a = a + list("abc")`, `list("abc") => ["a", "b", "c"]`, `insert(index, value)`
      - > `append()`, `remove()`, `insert()` returns an empty value (`<class 'NoneType>`)
- Tuple
  - Immutable
  - `tp = (1,2,3,'a')`，括号可省略，但不要省
  - **Multiple assignment**

    ```python
    (a, b, c) = 1,2,3
    (a, b, c) = [1,2,3]
    (a, b, c) = "123"
    ```

- Dictionary (JS object)
  - key, value, `[]`
  - `del dic[key]`
  - `list(dic.keys())`, `value()`, `items()`
- `from random import choice`
- `for i in range(1, 11)` 
- `pass` (`continue`)
- list comprehension
  - `even_numbers = [x for x in range(1, 101) if x % 2 == 0]`