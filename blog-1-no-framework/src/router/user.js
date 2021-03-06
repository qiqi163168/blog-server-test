const login = require('../controller/user.js');
const { SuccessModel, ErrorModel } = require('../model/resModel.js');
const { setRedis } = require('../db/redis.js');

// 获取cookie过期时间
// const getCookieExpires = () => {
//     const d = new Date();
//     d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
//     // console.log('d.toGMTString() is ... ',d.toGMTString());
//     return d.toGMTString();
// };

const handleUserRouter = (req,res) => {
    const method = req.method; // GET POST

    // POST用户登陆,可以防止跨域问题
    // if (method === 'POST' && req.path === '/api/user/login') {
    //     const username = req.body.username;
    //     const password = req.body.password;
    //     const result = login(username, password);
    //     return result.then(data => {
    //         if (data.username) {
    //             return new SuccessModel('登陆成功～！');
    //         } else {
    //             return new ErrorModel('登陆失败～！');
    //         }
    //     })
    // };

    // GET用户登陆,无法使用req.body,但是可以使用req.query取值
    // 使用session以后,改为POST请求，可以使用req.body里的数据了
    if (method === 'POST' && req.path === '/api/user/login') {
        // const username = req.query.username;
        // const password = req.query.password;

        const username = req.body.username;
        const password = req.body.password;

        // 请求数据库
        const result = login(username, password);
        return result.then(data => {
            if (data.username) {
                // 设置session，req.session是app.js解析后生成的
                req.session.username = data.username;
                req.session.realname = data.realname;
                // 同步到redis，req.sessionId, req.session都是从app.js里传过来的
                setRedis(req.sessionId, req.session);
                
                // console.log('req.session is ... ', req.session);

                // 操作cookie,路由改成根路由,保证在这个网站都有效
                // res.setHeader('Set-Cookie',`username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`)

                return new SuccessModel('登陆成功～！');
            } else {
                return new ErrorModel('登陆失败～！');
            }
        })
    };

    // // 登录验证的测试
    // if (method === 'GET' && req.path === '/api/user/login-test') {
    //     if (req.session.username) {
    //         return Promise.resolve(new SuccessModel ({
    //             session: req.session
    //         }));
    //     } else {
    //         return Promise.resolve(new ErrorModel ('尚未登录～！'));
    //     }
    // };
};

module.exports = handleUserRouter;