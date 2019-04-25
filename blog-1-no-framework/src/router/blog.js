const { 
    getBlogList, 
    getBlogDetail, 
    newBlog, 
    updateBlog, 
    delBlog } = require('../controller/blog.js');
const { SuccessModel, ErrorModel } = require('../model/resModel.js');

const handleBlogRouter = (req,res) => {
    const method = req.method; // GET POST
    const id = req.query.id; // 获取请求里的id字段

    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
        // const listData = getBlogList(author, keyword);
        // return new SuccessModel(listData);

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
        const blogData = req.body;
        // // 当前返回的data就是新建博客的id
        // const data = newBlog(blogData);
        // return new SuccessModel(data);

        // 因为登陆后才有author，所以先使用假数据
        blogData.author = 'zhangsan';
        const result = newBlog(blogData);
        return result.then(data => {
            return new SuccessModel(data);
        });
    };

    // 更新一篇博客
    if (method === 'POST' && req.path === '/api/blog/update') {
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
        // 删除博客时id和author要对上，先使用假数据
        const author = 'zhangsan';
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