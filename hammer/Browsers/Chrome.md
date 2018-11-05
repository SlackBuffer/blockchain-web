- [style console output](https://developers.google.com/web/tools/chrome-devtools/console/console-write#styling_console_output_with_css)
    - `%s` - string
    - `%i` or `%d` - integer
    - `%f` - floating point value
    - `%o` - expandable DOM element, as seen in the Element panel
    - `%O` - JS object
    - `%c` - Applies CSS style rules to the output string as specified by the second parameter


        ```js
        console.log('%c%s\n%c%d', 'color: white; background: #029e74; font-size: 16px;', '_______________________', 'color: #ff9200; background: #363636;',123)
        ```