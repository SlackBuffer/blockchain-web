# Numeric values
## Length and size
### Relative length units
- Depending on the unit, relative lengths can be the size of a specific character, the line height, or the size of the viewport
- **Font-relative lengths** define the `<length>` value in terms of the size of a particular character or font attribute in the font currently in effect in an element or its parent
- `em`
    - `1em` is the same as the font-size of the current element (more specifically, the width of a capital letter M)
        - The default base `font-size` given to web pages by web browsers before CSS styling is applied is 16 pixels, which means the computed value of `1em` is 16 pixels for an element by default
    - Relative to its parent
- `rem`
    - Represents the `font-size` of the root element (typically `<html>`)
    - When used within the root element `font-size`, it represents its initial value (a common browser default is 16px, but user-defined preferences may modify this)
- **Viewport-percentage lengths** define the `<length>` value relative to the size of the viewport
## Unitless line height
- Acts as a simple multiplying factor
- `line-height`
    - `line-height: 1.5` means `1.5 * font-size`
# Percentages
- `font-size` using percentage is relative to the parent's font-size
- Only calculated values can be inherited. Thus, even if a percentage value is used on the parent property, a real value (such as a width in pixels for a `<length>` value) will be accessible on the inherited property, not the percentage value
- `height: <percentage>`: Defines the height as a percentage of **containing block's height**
    - Same for `<img>`
    - 若复元素的高度本身是由 `<img>` 的高度构成的，则在 `<img>` 设置如 `height: 200%;` 的百分比高度会无效