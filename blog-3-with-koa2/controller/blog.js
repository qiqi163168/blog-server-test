const xss = require('xss')
const { sqlExec } = require('../db/mysql.js')

const getBlogList = async (author, keyword) => {
    let sql = 'select * from blogs where 1=1 '
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc`

    // sqlExec返回promise
    return  await sqlExec(sql)
}

const getBlogDetail = async (id) => {
    let sql = `select * from blogs where id='${id}'`
    const rows = await sqlExec(sql)
    return rows[0]
}

const newBlog = async (blogData = {}) => {
    // blogData是一个博客对象，包含title content author属性
    // console.log('newBlog blogData...', blogData)
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const author = blogData.author
    const createTime = Date.now()

    let sql = `
        insert into blogs (title,content,author,createtime)
        values ('${title}','${content}','${author}','${createTime}')
    `
    
    const insertData = await sqlExec(sql)
    return {
        id: insertData.insertId
    }
}

const updateBlog = async (id, blogData = {}) => {
    // console.log('upadte blog...', id, blogData)
    const title = blogData.title
    const content = blogData.content

    let sql =  `
        update blogs set title='${title}', content='${content}' where id='${id}'
    `

    const updateData = await sqlExec(sql)
    if (updateData.affectedRows > 0) {
        return true
    } else {
        return false
    }
}

const delBlog = async (id, author) => {
    // console.log('delete blog...', id)
    // return true

    let sql =  `
        delete from blogs where id='${id}' and author='${author}'
    `

    const deleteData = await sqlExec(sql);
    if (deleteData.affectedRows > 0) {
        return true
    } else {
        return false
    }
}

module.exports = {
    getBlogList,
    getBlogDetail,
    newBlog,
    updateBlog,
    delBlog
}