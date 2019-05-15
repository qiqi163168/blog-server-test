const http = require('http')

// 组合函数，组合中间件，实现next
function compose(middlewareList) {
    return function (ctx) {
        // 中间件调用的逻辑
        function dispatch(i) {
            const fn = middlewareList[i]
            // try、catch封装，不管什么结构都返回promise
            try {
                return Promise.resolve(
                    // 找出第一个中间件执行，并next第二个
                    fn(ctx, dispatch.bind(null, i+1)) // promise
                )
            } catch (err) {
                return Promise.reject(err)
            }
        }

        return dispatch(0)
    }
}

class LikeKoa2 {
    constructor() {
        this.middlewareList = []
    }
    //通过use方法，把中间件注册到中间件列表中
    use(fn) {
        this.middlewareList.push(fn)
        return this
    }

    createContext(req, res) {
        const ctx = {
            req,
            res
        }
        ctx.query = req.query
        return ctx
    }

    handleRequest(ctx, fn) {
        return fn(ctx)
    }

    callback() {
        const fn = compose(this.middlewareList)

        return (req, res) => {
            const ctx = this.createContext(req, res)
            return this.handleRequest(ctx, fn)
        }
    }
    // 创建http服务，并监听接口
    listen(...arg) {
        const server = http.createServer(this.callback())
        server.listen(...arg)
    }
}

module.exports = LikeKoa2