const getBlogList = (author, keyword) => {
    // 先返回假数据（格式是正确的）
    return [
        {
            id: 1,
            title: '标题A',
            content: '内容A',
            createTime: 1546610491112,
            author: 'zhangsan'
        },
        {
            id: 2,
            title: '标题B',
            content: '内容B',
            createTime: 1546610524373,
            author: 'lisi'
        }
    ]
};

const getBlogDetail = (id) => {
    // 先返回假数据（格式是正确的）
    return [
        {
            id: 1,
            title: '标题A',
            content: '内容A',
            createTime: 1546610491112,
            author: 'zhangsan'
        }
    ];
};

const newBlog = (blogData = {}) => {
    // blogData是一个博客对象，包含title content属性
    // console.log('newBlog blogData...', blogData);
    return {
        id: 3 // 表示新建博客，插入到数据表里的id
    }
};

const updateBlog = (id, blogData = {}) => {
    // console.log('upadte blog...', id, blogData);
    return true;
};

const delBlog = (id) => {
    console.log('delete blog...', id);
    return true;
};

module.exports = {
    getBlogList,
    getBlogDetail,
    newBlog,
    updateBlog,
    delBlog
};