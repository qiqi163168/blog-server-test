const { sqlExec } = require('../db/mysql.js');

const getBlogList = (author, keyword) => {
    let sql = 'select * from blogs where 1=1 ';
    if (author) {
        sql += `and author='${author}' `;
    };
    if (keyword) {
        sql += `and title like '%${keyword}%' `;
    };
    sql += `order by createtime desc;`;

    // sqlExec返回promise
    return sqlExec(sql);
};

const getBlogDetail = (id) => {
    let sql = `select * from blogs where id='${id}';`;
    // 执行sql语句
    return sqlExec(sql).then(rows => {
        return rows[0];
    });
    // 先返回假数据（格式是正确的）
    // return [
    //     {
    //         id: 1,
    //         title: '标题A',
    //         content: '内容A',
    //         createTime: 1546610491112,
    //         author: 'zhangsan'
    //     }
    // ];
};

const newBlog = (blogData = {}) => {
    // blogData是一个博客对象，包含title content author属性
    // console.log('newBlog blogData...', blogData);
    const title = blogData.title;
    const content = blogData.content;
    const author = blogData.author;
    const createTime = Date.now();

    let sql = `
        insert into blogs (title,content,author,createtime)
        values ('${title}','${content}','${author}','${createTime}')
    `
    return sqlExec(sql).then(insertData => {
        // console.log('insertData is ... ', insertData);
        return {
            id: insertData.insertId
        };
    });
};

const updateBlog = (id, blogData = {}) => {
    // console.log('upadte blog...', id, blogData);
    const title = blogData.title;
    const content = blogData.content;

    let sql =  `
        update blogs set title='${title}', content='${content}' where id='${id}';
    `;

    return sqlExec(sql).then(updateData => {
        // console.log('updateData is ... ', updateData);
        if (updateData.affectedRows > 0) {
            return true;
        } else {
            return false;
        };
    });
};

const delBlog = (id, author) => {
    // console.log('delete blog...', id);
    // return true;

    let sql =  `
        delete from blogs where id='${id}' and author='${author}';
    `;

    return sqlExec(sql).then(deleteData => {
        // console.log('deleteData is ... ', deleteData);
        if (deleteData.affectedRows > 0) {
            return true;
        } else {
            return false;
        };
    });
};

module.exports = {
    getBlogList,
    getBlogDetail,
    newBlog,
    updateBlog,
    delBlog
};