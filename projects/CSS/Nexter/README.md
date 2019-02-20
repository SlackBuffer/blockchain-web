continues at 105
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
- A fractional unit fills up the entire remaining space but it's never smaller than the minimal content of a row or a column 
- Position cells

    ```scss
    /* grid-row-start: 2;
    grid-row-end: 3;
    grid-column-start: 2;
    grid-column-end: 3; */

    grid-row: 2 / 3;
    grid-column: 2 / 3;

    grid-area: 2 / 2 / 3 / 3; // confusing

    // span grid items
    // grid-column: 2 / 4;
    grid-column: 1 / span 3;
    grid-column: 1 / -1; // -1 represents the end
    ```

- If there're more items that cells defined, CSS grid will automatically add a new row or column, called an **implicit grid**
- There can be multiple grid items in the same cell
    - Set `z-index` to show the hidden one
- Naming grid lines

    ```scss
    grid-template-rows: [header-start] 100px [header-end box-start] 200px [box-end main-start] 400px [main-end footer-start] 100px [footer-end];

    grid-template-columns: repeat(3, [col-start] 1fr [col-end]) 200px [grid-end]; // col-start 1; col-start 3; col-end 3;
    ```

- Naming grid areas

    ```scss
    grid-template-areas: "head head head head"
                         "box box box side"
                         "main main main side"
                         "footer footer footer footer";
    ```

    - `.` represents an empty cell (needs to position related cells in order for it to work)
- Exercise
   1. My way: https://codepen.io/slackbuffer/pen/xMMLYb?editors=1100#0
   2. https://codepen.io/slackbuffer/pen/zeedbx?editors=1100#0
        - Named grid lines, named grid areas
- Style implicit gird

    ```scss
    grid-auto-rows: 80px;
    grid-auto-flow: column; // default is row
    grid-auto-columns: .5fr; // order matters; need follow the previous one
    ```

- Align grid items to grid **areas**

    ```scss
    align-items: center; // default is stretch
    justify-items: center;

    align-self: start;
    justify-self: start;
    ```

- Align grid tracks to grid container

    ```scss
    justify-content: center;
    align-content: center;

    // remove empty cell that was created because the automatic
    // placement algorithm tries to keep the grid items in order
    // of HTML markup
    grid-auto-flow: row dense;
    ```

- https://codepen.io/slackbuffer/pen/aXMPWX?editors=1100#0
- `min-content`
    - column: minimal with to hold the longest word
    - row:
- `max-content`
- `minmax()`
- Responsive grid layout

    ```scss
    // using auto-fill and auto-fit
    grid-template-rows: repeat(2, minmax(150px, min-content));
    
    // create as many tracks with the desired width as possible; 
    // won't auto collapse empty tracks
    grid-template-columns: repeat(auto-fill, 100px);
    // auto collapse empty tracks and set the width to zero
    grid-template-columns: repeat(auto-fit, 100px);
    
    width: 90%;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    grid-auto-rows: 150px;
    ```

- https://codepen.io/slackbuffer/pen/wNONON?editors=1100#0