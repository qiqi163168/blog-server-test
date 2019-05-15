const Koa = require('koa');
const app = new Koa();

// 执行顺序
// 注册3个use中间件，1个listen
// 执行 11/12行 - 20/21/22行 - 30/31/32行
// 执行 23/24/25行 - 13/14/15行

// logger
app.use(async (ctx, next) => {
  console.log('第一层洋葱开始')
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  console.log('第一层洋葱结束')
});

// x-response-time
app.use(async (ctx, next) => {
  console.log('第二层洋葱开始')
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log('第二层洋葱结束')
});

// response
app.use(async ctx => {
  console.log('第三层洋葱开始')
  ctx.body = 'Hello World';
  console.log('第三层洋葱结束')
});

app.listen(8555);
