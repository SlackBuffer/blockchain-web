- 控制 button 是否为 disabled

  ```js
  valid() {
    return this.state.date && this.state.title && this.state.amount
  }
  ```

- 事件委托

  ```js
  handleChange(event) {
    let name, obj;
    name = event.target.name;
    // 逗号表达式，结果是最右边的表达式的值
    this.setState((
      obj = {},
      // obj["" + name] = event.target.value,
      obj[name] = event.target.value,
      obj
    ));
  }
  ```

- 新增数据的 id 不在前端创建，前端将数据发送至后端，后端生成 id，将数据和 id 一并返回
  - 本例前端创建新记录后直接更新页面，并未发起第二次请求
  - 添加成功后返回的 promise 的 `then()` 的数据就是新增的条目
- GET, POST, PUT
- `refs`
- toggle 状态的方法用取反 `!` 有利于复用
- `reduce` 对象数组的处理
- bootstrap
# 模拟数据
- [mock API](https://www.mockapi.io/)
  - `curl http://5af71a21c222a90014dbda4f.mockapi.io/api/v1/records`
  - postman POST 用 raw, JSON(application/json)
- [json server](https://github.com/typicode/json-server)（本地）
  - `json-server --watch db.json --port 3004`
  - postman POST 用 x-www-form-urlencoded
# 异步请求
- `componentDidMount()` 里发请求
- `fetch`

  ```js
  fetch('http://5af71a21c222a90014dbda4f.mockapi.io/api/v1/records').then(res => res.json())
  .then(data => {
    console.log(data)
  });
  
  fetch('http://localhost:3004/records').then(res => res.json())
  .then(data => {
    console.log(data)
  });
  ```

  - > https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
- `jQuery`
- axios
# 环境变量
- .env.development.local
  - > https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables