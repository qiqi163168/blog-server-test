// 错误页提示
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
// cookie解析
var cookieParser = require('cookie-parser');
// 日志生成，需要配置
var logger = require('morgan');
const session = require('express-session');
// RedisStore本质是一个函数，直接把session传进去
const RedisStore = require('connect-redis')(session);


// 路由处理
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

// 本次实例
var app = express();

// 视图设置，因为本次是纯后端开发，所以先注释
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// 环境变量、日志文件
const ENV = process.env.NODE_ENV;
if (ENV !== 'prd') {
  // 开发环境
  // morgan直接只用steam的dev的预定义日志格式
  app.use(logger('dev', {
    stream: process.stdout // 如果不设置，默认此参数，并把日志打印在控制台上
  }));
} else {
  // 线上环境，把日志写入文件
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  });
  app.use(logger('combined', {
    stream: writeStream
  }));
};

// 使用这一句，只要获得数据，可以直接在req.body內访问到，不需要自己写getPostData(req)
// 获取的是json数据
app.use(express.json());
// 获取x-www-form-urlencoded表单提交的数据
app.use(express.urlencoded({ extended: false }));
// cookie解析
app.use(cookieParser());

// redis要在session之前
const redisClient = require('./db/redis');
const sessionStore = new RedisStore({
  client: redisClient
});

// session要在路由之前
app.use(session({
  // session密匙
  secret: 'aPdfI_8qejadf#',
  // cookie配置，前端不可更改，失效时间
  cookie: {
    // path: '/', //默认配置
    // httpOnly: true, //默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}));

// 注册静态文件返回，此次不涉及前端开发，先注释
// 所以可以删除public和views的文件夹
// app.use(express.static(path.join(__dirname, 'public')));

// 父路径、路由注册
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
