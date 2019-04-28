const { 
    getBlogList, 
    getBlogDetail, 
    newBlog, 
    updateBlog, 
    delBlog } = require('../controller/blog.js');
const { SuccessModel, ErrorModel } = require('../model/resModel.js');

// 统一登录验证
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录～！')
        );
    }
}


const handleBlogRouter = (req,res) => {
    const method = req.method; // GET POST
    const id = req.query.id; // 获取请求里的id字段

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        let author = req.query.author || '';
        const keyword = req.query.keyword || '';
        // const listData = getBlogList(author, keyword);
        // return new SuccessModel(listData);

        if (req.query.isadmin) {
            //管理员界面
            const loginCheckResult = loginCheck(req);
            if (loginCheckResult) {
                // 未登录
                return loginCheckResult
            };
            // 强制查询自己的博客
            author = req.session.username;
        };

        // getBlogList返回对是个promise对象
        const result = getBlogList(author, keyword);
        return result.then(listData => {
            return new SuccessModel(listData);  
        });
    };

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        // const blogDetailData = getBlogDetail(id);
        // return new SuccessModel(blogDetailData);
        const result = getBlogDetail(id);
        return result.then(blogDetailData => {
            return new SuccessModel(blogDetailData);
        });
    };

    // 新建一篇博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        // 登录验证
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult;
        };

        const blogData = req.body;
        // // 当前返回的data就是新建博客的id
        // const data = newBlog(blogData);
        // return new SuccessModel(data);

        blogData.author = req.session.username;
        const result = newBlog(blogData);
        return result.then(data => {
            return new SuccessModel(data);
        });
    };

    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        // 登录验证
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult;
        };

        const blogData = req.body;
        const result = updateBlog(id, blogData);
        return result.then(val => {
            if (val) {
                return new SuccessModel('博客更新成功～！');
            } else {
                return new ErrorModel('更新博客失败～！');
            }
        });
    };

    // 删除一篇博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        // 登录验证
        const loginCheckResult = loginCheck(req);
        if (loginCheckResult) {
            // 未登录
            return loginCheckResult;
        };

        // 删除博客时id和author要对上，先使用假数据
        const author = req.session.username;
        const result = delBlog(id, author);
        return result.then(val => {
            if (val) {
                return new SuccessModel('博客删除成功～！');
            } else {
                return new ErrorModel('删除博客失败～！');
            }
        });
    };
};

module.exports = handleBlogRouter;