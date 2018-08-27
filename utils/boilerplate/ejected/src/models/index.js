// 此处约定 modal 文件名与 namespace 同名
const context = require.context('./', false, /\.js$/)
const rootModal = {}
context
  .keys()
  .filter(item => item !== './index.js')
  .map(key => {
    const k = key.split('/')[1].split('.')[0]
    rootModal[k] = context(key).default
  })

export default rootModal
