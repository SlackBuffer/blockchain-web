- [rules](https://eslint.org/docs/rules/)

    ```json
    {
        "rules": {
            "semi": ["error", "always"],
            "quotes": ["error", "double"]
        }
    }
    ```

    - `semi`/`quotes`：规则名
    - `array` 第一个值
        - `"off"` or `0` - turn the rule off
        - `"warn"` or `1` - turn the rule on as a warning (doesn’t affect exit code)
        - `"error"` or `2` - turn the rule on as an error (exit code will be `1`)
- ESLint will not lint your code unless you **extend from a shared configuration** or **explicitly turn rules on** in your configuration.
    - `"extends": "eslint:recommended"`: all of the rules checked on the rules page will be turned on