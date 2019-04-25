const queryString = require('querystring');
const handleBlogRouter = require('./src/router/blog.js');
const handleUserRouter = require('./src/router/user.js');

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

  // 在处理路由之前，先解析postData
  getPostData(req).then(postData => {
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