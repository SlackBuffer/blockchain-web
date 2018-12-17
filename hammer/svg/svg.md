- `d` attribute of `<path>`
  - M - move to
  - L - line to
  - Z - close path
    - H - horizontal line to 
    - V - vertical line to 
    - C - curve to 
      - 贝塞尔曲线
      1. 1st coordinates represents the starting position of the control point
      2. 2nd coordinates represents the end point of the control stick
      3. 3rd coordinates represents the end point of the curve itself
      - > https://developer.mozilla.org/en-US/docs/Web/CSS/Tools/Cubic_Bezier_Generator
    - S - smooth curve to
- y axis is ↓
- Enter selection
  - Virtual elements created by D3 that haven't enter DOM yet
  - More data than the actual DOM elements needed to consume all the data to begin with
  - 数据比实际 DOM 元素多
- Exit selection
  - 实际 DOM 元素比数据多
- Scales
  1. Linear scale
    - Domain `[min, max]`: the range of the data passed in
    - Range `[min, max]`: the range of output values
  2. Band scale
    - Specially designed for x range issue
  3. Ordinal scales
  4. Time scale
- Firestore
  - Collections, documents (with id)
- Pie chart
  - `d3.pie()`, `d3.arc()`
- Interactions
  - Use named transitions and D3 knows different transitions on the same element should not interact with each other
- Data hierarchy
  - `hierarchy()`, `stratify()`




- Shaun Pelling
- > https://github.com/iamshaunjp/data-ui-with-d3-firebase/blob/lesson-20/planets.json