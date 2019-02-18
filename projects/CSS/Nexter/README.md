continues at 95
# CSS grids
- 2-dimensional
- Grid container: `display: grid;`
    - `display: grid-inline;`
- Grid items are direct children of grid container
- Row axis, column axis
    - Cannot interchange
- Grid lines
    - Vertical and horizontal lines that divide the grid and separate the columns and rows
    - Automatically numbered, starting from 1 to the number of rows/columns plus one
- Row gutter, column gutter
- The space between 2 grid lines is called a grid track
    - If it's horizontal, it's a row
    - If it's vertical, it's a column
- The area between 2 vertical and 2 horizontal grid lines is called a grid area
- If the area is between 2 adjacent row lines and 2 adjacent column lines, it' called a grid cell
- `.container>.item.item--$*6`
- Firefox
    - Overlay grid; Display line numbers
## Attributes
- https://codepen.io/slackbuffer/pen/exbyBo?editors=1100
- Common

    ```scss
    grid-template-rows: 150px 150px;
    grid-template-columns: 150px 150px 150px;

    grid-template-columns: repeat(2, 150px) 200px;
    grid-template-columns: repeat(2, 150px) 1fr;
    grid-template-columns: repeat(3, 1fr);
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-columns: 50% 1fr 1fr;

    grid-row-gap: 30px;
    grid-column-gap: 50px;
    grid-gap: 30px;
    ```

    - `fr`: fractional unit
    - Percentage doesn't take gap into account, it's relative to the parent element's width
- Position cells

    ```scss
    /* grid-row-start: 2;
    grid-row-end: 3;
    grid-column-start: 2;
    grid-column-end: 3; */

    grid-row: 2 / 3;
    grid-column: 2 / 3;

    grid-area: 2 / 2 / 3 / 3; // confusing
    ```