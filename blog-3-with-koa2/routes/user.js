const router = require('koa-router')()

const login = require('../controller/user.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')

router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  
  const data = await login(username, password)
  if (data.username) {
    // 设置session
    ctx.session.username = data.username;
    ctx.session.realname = data.realname;
    ctx.body  = new SuccessModel('登录成功～~！')
    return;
  };
  ctx.body = new ErrorModel('登录失败～~！')
})

// // session-test
// // 要启动redis-server
// router.get('/session-test', async function (ctx, next) {
//     const session = ctx.session
//     // 浏览次数
//     if (session.viewNum == null) {
//         session.viewNum = 0 
//     }
//     session.viewNum ++

//     ctx.body = {
//         viewNum: session.viewNum
//     }
// })

module.exports = router
