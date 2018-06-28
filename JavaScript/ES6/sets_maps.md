# `Set`
- 集合（set）：一组不包含重复元素的值
- 用法

    ```js
    let set = new Set();
    set.add(5);
    set.add('5');
    console.log(set.size)
    let arr = [...set];

    let set1 = new Set([1, 2, 3, 3, 3]);
    set1.has(1);
    set1.remove(2);
    set1.clear();

    // 数组去重
    function eliminateDuplicates(items) {
        return [...new Set(items)];
    }
    let numbers = [1, 2, 3, 3, 3, 4, 5],
        noDuplicates = eliminateDuplicates(numbers);
    console.log(noDuplicates);      // [1,2,3,4,5]
    ```

    - `Set` 构造器可接受任意一个 iterable object 作为参数
    - set 的 `forEach()` 方法第一个参数和第二个参数相同，即 set 里的每个值既被当作 key 又被当做 value
- set 是强类型，若里面存放的是具名对象，该具名对象被赋值为 `null` 后，变量对该对象已不存在引用，但 set 依然对该对象存在引用，导致该对象无法被回收
    - 此时用 [`WeakSet`](https://leanpub.com/understandinges6/read/#leanpub-auto-sets-and-maps)
- > 对象作为对象属性都会被转为 `[object Object]`，所有对象的属性都会被隐式转换为字符串

    ```js
    let map = Object.create(null),
        key1 = {},
        key2 = {};
    map[key1] = "foo";
    console.log(map[key2]);
    ```

# `Map`
- 用法

    ```js
    let map = new Map(),
        key1 = {};
    map.set("title", "abc");
    map.set(key1, 3);
    console.log(map.get("title"));
    console.log(map.get(key1));         // 3

    // has(key), delete(key), clear(), size

    let map1 = new Map([["name", "sb"], ["age", 28]]);
    ```

    - 键可以是对象，可以为对象绑定额外数据
    - `forEach` 按加入键值对加入 map 的顺序遍历