var express = require('express');
var router = express.Router();
const { 
    getBlogList, 
    getBlogDetail, 
    newBlog, 
    updateBlog, 
    delBlog } = require('../controller/blog.js');
const { SuccessModel, ErrorModel } = require('../model/resModel.js');
const loginCheck = require('../middleware/loginCheck.js');

// 获取博客列表
router.get('/list', function(req, res, next) {
    // test
    // 直接返回json格式数据
    // res.json(xx) = res.end(JSON.stringify(xx)) + 返回header：content-type设置;
    // res.json({
    //     errNo: 0,
    //     data: [1,2,3,5]
    // });

    let author = req.query.author || '';
    const keyword = req.query.keyword || '';

    if (req.query.isadmin) {
        //管理员界面
        if (req.session.username == null) {
            // 未登录
            res.json(
                new ErrorModel('未登录!!')
            );
            return;
        };

        // 强制查询自己的博客
        author = req.session.username;
    };

    // getBlogList返回对是个promise对象
    const result = getBlogList(author, keyword);
    return result.then(listData => {
        res.json(
            new SuccessModel(listData)
        );  
    });
});

// 获取博客详情
router.get('/detail', function(req, res, next) {
    const result = getBlogDetail(req.query.id);
    return result.then(blogDetailData => {
        res.json(
            new SuccessModel(blogDetailData)
        );
    });
});

// 新建一篇博客
router.post('/new', loginCheck, function(req, res, next) {
    // // 登录验证
    // const loginCheckResult = loginCheck(req);
    // if (loginCheckResult) {
    //     // 未登录
    //     return loginCheckResult;
    // };
    // 它会自动执行loginCheck中间件，替代以上登录验证代码

    const blogData = req.body;
    blogData.author = req.session.username;
    const result = newBlog(blogData);
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        );
    });
});

// 更新一篇博客
router.post('/update', loginCheck, function(req, res, next) {
    // // 登录验证
    // const loginCheckResult = loginCheck(req);
    // if (loginCheckResult) {
    //     // 未登录
    //     return loginCheckResult;
    // };

    const blogData = req.body;
    const result = updateBlog(req.query.id, blogData);
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel('博客更新成功～！')
            );
        } else {
            res.json(
                new ErrorModel('更新博客失败～！')
            );
        }
    });
});

// 删除一篇博客
router.post('/del', loginCheck, function(req, res, next) {
    // // 登录验证
    // const loginCheckResult = loginCheck(req);
    // if (loginCheckResult) {
    //     // 未登录
    //     return loginCheckResult;
    // };

    // 删除博客时id和author要对上，先使用假数据
    const author = req.session.username;
    const result = delBlog(req.query.id, author);
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel('博客删除成功～！')
            );
        } else {
            res.json(
                new ErrorModel('删除博客失败～！')
            );
        }
    });
});


module.exports = router;