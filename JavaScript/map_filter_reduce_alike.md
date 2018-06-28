- Array, 
# Iterative methods
- 接受 2 个参数：
    1. 方法 - 接受 3 个参数：
        1. 当前数组元素值
        2. 当前数组元素下标
        3. 目标数组
    2. （可选） scope object，决定 `this`
## `filter()`
- 筛选经传入的方法处理过后为 `true` 的元素
- 返回一个数组

    ```javascript
    var numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];        
    var filterResult = numbers.filter(function(item, index, array) {
        return (item > 2);
    });

    filterResult;       // [3, 4, 5, 4, 3]
    ```

## `map()`
- 对数组的每个元素用传入的方法处理并返回处理结果

    ```javascript
    var numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];        
    var mapResult = numbers.map(function(item, index, array) {
        return item * 2;
    });
    mapResult;          // [2, 4, 6, 8, 10, 8, 6, 4, 2]
    ```

## `forEach()`
- 效果同用 `for` 循环遍历数组元素。
- 不会修改原数组元素。
- 无返回值。
## `every()`
- 对每一个元素用传入的方法处理，若每一个元素都返回 `true`，则最终结果为 `true`。
## `some()`
- 有一个元素为 `true`，最终结果就为 `true`。
# Reduction methods
- 遍历所有元素，返回最终值。
- 接受 2 个参数：
    1. 方法 - 接受 4 个参数：
        1. 前一个元素值
        2. 当前元素值
        3. 当前元素下标
        4. 目标数组
    2. （可选） 初始值
    - 没有初始值时，第一次遍历从第二个元素开始，此时第一个 index 是 1 不是 0；有初始值时 index 从 0 开始。
    - 前一次遍历的返回值作为下一次遍历的第一个参数
## `reduce()`
- 从第一个元素开始遍历。

    ```javascript
    var values = [1, 2, 3, 4];
    var sum = values.reduce(function(prev, cur, index, array) {
        console.log('current index: ', index);
        return prev + cur;
    }, 0);
    sum;            // 10
    ```

## `reduceRight()`
- 从最后一个元素开始遍历。