const router = require('koa-router')()

const { 
    getBlogList, 
    getBlogDetail, 
    newBlog, 
    updateBlog, 
    delBlog } = require('../controller/blog.js')
const { SuccessModel, ErrorModel } = require('../model/resModel.js')
const loginCheck = require('../middleware/loginCheck.js')

router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
    let author = ctx.query.author || ''
    const keyword = ctx.query.keyword || ''

    if (ctx.query.isadmin) {
        if (ctx.session.username == null) {
            ctx.body = new ErrorModel('未登录')
            return
        }
        author = ctx.session.username
    }

    const listData = await getBlogList(author, keyword)
    ctx.body = new SuccessModel(listData)
})

router.get('/detail', async function (ctx, next) {
    const blogDetailData = await getBlogDetail(ctx.query.id)
    ctx.body = new SuccessModel(blogDetailData)
})

router.post('/new', loginCheck, async function (ctx, next) {
    const blogData = ctx.request.body
    blogData.author = ctx.session.username

    const data = await newBlog(blogData)
    ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async function (ctx, next) {
    const blogData = ctx.request.body
    const val = await updateBlog(ctx.query.id, blogData)
    if (val) {
        ctx.body = new SuccessModel('博客更新成功～！')
    } else {
        ctx.body = new ErrorModel('更新博客失败～！')
    }
})

router.post('/del', loginCheck, async function (ctx, next) {
    const author = ctx.session.username
    const val = await delBlog(ctx.query.id, author)
    if (val) {
        ctx.body = new SuccessModel('博客删除成功～！')
    } else {
        ctx.body = new ErrorModel('删除博客失败～！')
    }
})

module.exports = router
