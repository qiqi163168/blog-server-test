const queryString = require('querystring');
const handleBlogRouter = require('./src/router/blog.js');
const handleUserRouter = require('./src/router/user.js');
const { setRedis, getRedis } = require('./src/db/redis.js');

// 获取cookie过期时间
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  // console.log('d.toGMTString() is ... ',d.toGMTString());
  return d.toGMTString();
};

// // 全局的session数据
// const SESSION_DATA = {};

// 用于处理post data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    // 如果不是post请求，就传入一个空
    if (req.method !== 'POST') {
      resolve({});
      return;
    };
    // 如果不是post里面传过来的数据不是json格式的话，就传入一个空
    // 因为没有框架，所以不是json的格式，暂时忽略
    // 此处content-type必须lowercase否则取不到post data
    if (req.headers['content-type'] !== 'application/json') {
      resolve({});
      return;
    };
    // 当post请求传了json数据来时
    let postData = '';
    req.on('data', chunk => {
      postData += chunk.toString();
    });
    req.on('end', () => {
      if (!postData) {
        resolve({});
        return;
      };
      resolve(
        JSON.parse(postData)
      );
    });
  });
  return promise;
};

// 路由命中
// 所有的http请求都会经过serverHandle
const serverHandle = (req,res) => {
  // 设置返回格式 - JSON
  res.setHeader('Content-type', 'application/json');

  // 获取path
  const url = req.url;
  req.path = url.split('?')[0];

  // 解析query
  req.query = queryString.parse(url.split('?')[1]);

  // 解析cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || ''; // k1=v1;k2=v2...
  // console.log(cookieStr);
  cookieStr.split(';').forEach(item => {
    if (!item) {
      return;
    };
    const arr = item.split('=');
    // cookie拼接的时候,分号后面有空格,用trim()去掉空格
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
    // console.log('req.cookie is ...', req.cookie);
  });
  // console.log('req.cookie is ...', req.cookie);


  // // 解析session
  // // 如果cookie中没有userid，需要写上
  // let needSetCookie = false;
  // let userId = req.cookie.userid;
  // if (userId) {
  //   if (!SESSION_DATA[userId]) {
  //     SESSION_DATA[userId] = {};
  //   };
  // } else {
  //   needSetCookie = true;
  //   // 没有userId时，先赋值一个时间戳+随机数，保证不重复即可
  //   // 实际上userId是加密算法计算出来的
  //   userId = `${Date.now()}_${Math.random()}`;
  //   SESSION_DATA[userId] = {};
  // };
  // req.session = SESSION_DATA[userId];

  // redis解析session
  let needSetCookie = false;
  let userId = req.cookie.userid;
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    // 初始化session （redis没有key=userid=时间戳+随机数）
    setRedis(userId, {});
  };
  // 获取session，返回的是个promise对象
  req.sessionId = userId;
  getRedis(req.sessionId).then(sessionData => {
    if (sessionData == null) {
      // 初始化session（redis有key，但是val=null）
      setRedis(req.sessionId, {});
      req.session = {};
    } else {
      req.session = sessionData;
    };
    // console.log('req.session... ', req.session);
    
    // 在处理路由之前，先解析postData
    // 因为命中user路由的时候，必须要有req.sessionId和req.session
    return getPostData(req);
  }).then(postData => {
    req.body = postData;

    // 处理blog路由
    // const blogData = handleBlogRouter(req,res);
    // if (blogData) {
    //   res.end(
    //     JSON.stringify(blogData)
    //   );
    //   return;
    // };

    const blogResult = handleBlogRouter(req,res);
    if (blogResult) {
      blogResult.then(blogData => {
        // 如果没有userid，需要设置cookie的话
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}'`)
        };

        res.end(
          JSON.stringify(blogData)
        );
      })
      return;
    };

    // 处理user路由
    // const userData = handleUserRouter(req,res);
    // if (userData) {
    //   res.end(
    //     JSON.stringify(userData)
    //   );
    //   return;
    // };

    const userResult = handleUserRouter(req,res);
    if (userResult) {
      userResult.then(userData => {
        // 如果没有userid，需要设置cookie的话
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}'`)
        };

        res.end(
          JSON.stringify(userData)
        );
      })
      return;
    };

    // 未命中路由，返回404
    res.writeHead(404, {"Content-type": 'text/plain'});
    res.write("404 Not Found\n");
    res.end();
  });
};

module.exports = serverHandle;