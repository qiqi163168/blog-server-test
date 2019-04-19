const loginCheck = require('../controller/user.js');
const { SuccessModel, ErrorModel } = require('../model/resModel.js');

const handleUserRouter = (req,res) => {
    const method = req.method; // GET POST
    // 用户登陆
    if (method === 'POST' && req.path === '/api/user/login') {
        const username = req.body.username;
        const password = req.body.password;
        const result = loginCheck(username, password);
        if (result) {
            return new SuccessModel('登陆成功～！');
        } else {
            return new ErrorModel('登陆失败～！');
        }
    };
};

module.exports = handleUserRouter;