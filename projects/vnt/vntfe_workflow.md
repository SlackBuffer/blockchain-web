# imported modules
- `react`
    - [getDerivedStateFromProps](https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops)
        - invoked right before calling the render method, both on the initial mount and on subsequent updates
        - return an object to update the state, or null to update nothing
        - for rare use cases where the state depends on changes in props over time
- `react-flags-select`
    - `showSelectedLabel` 指示是否显示国家名称
- `redux-actions`
    - `{ handleActions }`
- `history/createBrowserHistory`
    - `createHistory`
- `react-router-redux`
    - `ConnectedRouter`, `routerMiddleware`
- `react-router`
    - `{ withRouter }`
- `react-router-dom`
    - `{ Route, Redirect }`
- `@material-ui`
    - `CssBaseline`, `{ MuiThemeProvider }`, `{ withStyles }`, `AppBar`, `Toolbar`, `Button`, `MButton`, `ButtonBase`, `IconButton`, `SwipeableDrawer`, `List`, `ListItem`, `ListItemIcon`, `ListItemText`
- `antd`
    - { Dropdown, Menu, Row, Col, Modal, Checkbox, Button } 
- `js-sha256`
    - `{ sha256 }`
- `mobile-detect`
# mobile
# pc
## structure
- `npm start`，`npm build` 决定 `process.env.NODE_ENV`
- global.js: `prefix`, `host`
- 检测到是手机客户端重定向到 `m.vnt.link`，保留 pathname 和 parameters 部分
## 状态管理
- toRegister
    - 注册登录界面里点击切换 true 和 false
    - App.jsx 里用未验证用户访问活动页面会重定向到 /start 路由，toRegister 设为 true
    - Home.jsx 界面未登录的用户点击按钮切换 true 和 false
    - 注册成功后 toRegister 被设置为 false
### App.jsx
- 定义 /，/start（注册登录），/pwdreset，/main（用户中心，带校验）路由
- 若路由带 `/main/*` 的，被设置成 `redirectTo` 的值
    - 自动填充邀请码会用到，不要覆盖 `redirectTo` 的值
- /main（candybox） 校验 token
    1. localStorage 存有 token
        1. 校验成功，呈现请求的页面
        1. 验证失败，若请求的路径包含 main/events，则将 toRegister 设为 true，跳转到 /start 页面（注册）
    2. 未存 token，同 1.2 的处理逻辑
### Home.jsx (`/`)
- 组件加载完成后，若 localStorage 存有 token，派发 user/getUserByJWT 动作，请求后端 /user 路由
    1. 成功，派发 user/setUser 动作，获取到 state.user 信息，渲染页面
    2. 失败，提示错误信息，跳转到 /start 页面
### LoginAndRegister.jsx (`/start`)
- 检测到是手机访问，showVeirfy 设为 false，state.login 的 verified 设为 true，即用户无需进行滑块验证操作
- login/getUserCount 返回 User 表里用户的总数，给界面上“领取人数用”
- login/setToRegister 用于设置决定显示注册还是登录页面的字段
- [ ] 用户输入的 input 设置 value 何用 - React 非受控组件？
- [ ] CommonInput: icon
#### 注册
- register
    - validation.phone，validation.password，validation.code 三个字段分别用于存储手机号、密码、验证码有问题时的错误提示信息
    - phone，password，code 用于存储用户输入的用户名、密码、验证码
- register/setValidation 用于设置错误提示信息
- 用户输入手机号时每隔 300ms 实时向服务器请求验证用户手机号是否已被注册
- 发送注册验证码
    - phone 和 password 两栏都没有错误提示时才会触发发送验证码动作（register/sendVerifyCode）
    - 发送验证码后，若发送成功，执行 startCountDown 回调，进入倒计时；发送失败则提示错误
    - [ ] 发送验证码后端逻辑
- 注册按钮
    - phone，password，code 都没有错误提示时才会触发注册（register/doRegister）
        - 同时要确保上述几栏都不为空，应对用户不点击输入框直接点击注册按钮的情况，此种情况不应触发注册动作
    - 注册失败提示对应错误信息
    - 注册成功
        - toRegister 设为 false，state 变化，注册/登录组件重新渲染，显示的是登录页面
        - 自动填充用户注册的手机号（login/setFieldValue）
        - register-showSuccess 被设置为 true，显示注册成功的 Modal，点击 Model 后清空本次注册保存在 state 里的信息（register/reset）
#### 登录
- login
    - validation.phone，validation.password，validation.verification 三个字段分别用于存储手机号、密码、有问题时的错误提示信息
    - fieldValue，password 用于存储用户输入的用户名、密码，fieldType 由 fieldValue 计算得到（getFieldType），verified 用于指示拖动验证是否成功
### PasswordRest.jsx (`/pwdret`)
### Candybox.jsx (`/main`)
- CandyBox（带校验）
    - UserMainPage
    - UserSetting
    - InviteEvent
- candybox/setLoading