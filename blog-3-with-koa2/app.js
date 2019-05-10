const Koa = require('koa')
// koa实例
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// post里面的body
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')

const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

// 路由引用
const index = require('./routes/index')
const users = require('./routes/users')
const user = require('./routes/user')
const blog = require('./routes/blog')

const { REDIS_CONFIG } = require('./config/db')
// error handler
// app的错误监测
onerror(app)

// middlewares
// post data处理
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
//日志有关
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 环境变量、日志文件
const ENV = process.env.NODE_ENV;
if (ENV !== 'prd') {
  // 开发环境
  // morgan直接只用steam的dev的预定义日志格式
  app.use(morgan('dev', {
    stream: process.stdout // 如果不设置，默认此参数，并把日志打印在控制台上
  }));
} else {
  // 线上环境，把日志写入文件
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  });
  app.use(morgan('combined', {
    stream: writeStream
  }));
};

// session一定要在注册路由之前写
// session配置
// session密匙
app.keys = ['Ssdklj_fl223A#']
app.use(session({
  // 配置cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置redis
  store: redisStore({
    all: `${REDIS_CONFIG.host}:${REDIS_CONFIG.port}` // 本地redis地址
  })
}))

// routes注册
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
