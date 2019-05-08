var express = require('express');
var router = express.Router();
const login = require('../controller/user.js');
const { SuccessModel, ErrorModel } = require('../model/resModel.js');

router.post('/login', function(req, res, next) {
    const { username, password } = req.body;
    const result = login(username, password);
    return result.then(data => {
        if (data.username) {
            // 设置session
            req.session.username = data.username;
            req.session.realname = data.realname;
            
            res.json(
                new SuccessModel('登录成功～~！')
            );
            return;
        };
        res.json(
            new ErrorModel('登录失败～~！')
        );
    });
});

// // 登录验证
// router.get('/login-test', (req, res, next) => {
//     if (req.session.username) {
//         res.json({
//             errNo: 0,
//             msg: '已登录'
//         });
//         return;
//     };
//     res.json({
//         errNo: -1,
//         msg: '未登录'
//     });
// });

// // session-test
// router.get('/session-test', (req, res, next) => {
//     const session = req.session;
//     // 浏览次数
//     if (session.viewNum == null) {
//         session.viewNum = 0; 
//     };
//     session.viewNum ++

//     res.json({
//         viewNum: session.viewNum
//     });
// });

module.exports = router;
