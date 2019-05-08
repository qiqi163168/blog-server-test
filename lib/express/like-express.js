// 本js是类似于express中间件的一个文件

const http = require('http');
const slice = Array.prototype.slice;

class LikeExpress {
    constructor() {
        // 存放中间件的列表
        this.routes = {
            all: [], // 通过app.use注册的中间件
            get: [], // 通过app.get注册的中间件
            post:[]  // 通过app.post注册的中间件
            // 其他想扩展的方法....
            // code here...
        };
    };

    // 抽象注册中间件的方法
    register(path) {
        const info = {};
        if (typeof path === 'string') {
            info.path = path;
            // 从第二个参数开始，转换为数组，存入stack
            info.stack = slice.call(arguments, 1);
        } else {
            // 如果第一个参数不是路由，那么就默认根路由
            info.path = '/';
            // 从第一个参数开始，转换为数组，存入stack
            info.stack = slice.call(arguments, 0);
        };
        return info;
    };

    use() {
        // 把当前函数的所有参数都交给register处理
        const info = this.register.apply(this, arguments);
        // 存入all数组
        this.routes.all.push(info);
    };

    get() {
        const info = this.register.apply(this, arguments);
        this.routes.get.push(info);
    };

    post() {
        const info = this.register.apply(this, arguments);
        this.routes.post.push(info);
    };

    match(method, url) {
        let stack = [];
        if (url === '/favicon.ico') {
            return stack;
        };

        // 获取匹配有用的中间件routes
        let curRoutes = [];
        curRoutes = curRoutes.concat(this.routes.all);
        curRoutes = curRoutes.concat(this.routes[method]);
        // 遍历
        curRoutes.forEach(routeInfo => {
            if (url.indexOf(routeInfo.path) === 0) {
                // 以下三种情况符合这个if情况
                // url === '/api/get-cookie' 且 routeInfo === '/'
                // url === '/api/get-cookie' 且 routeInfo === '/api'
                // url === '/api/get-cookie' 且 routeInfo === '/api/get-cookie'
                stack = stack.concat(routeInfo.stack)
            };
        });
        return stack;
    };

    // 核心next机制
    handle(req, res, stack) {
        const next = () => {
            // 拿到第一个匹配的中间件
            const middleware = stack.shift();
            if (middleware) {
                middleware(req, res, next);
            };
        };
        next();
    };

    serverHandle() {
        return (req, res) => {
            // console.log(req);
            // 定义json函数,nodejs本身是没有的
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json');
                res.end(
                    JSON.stringify(data)
                );
            };
            const url = req.url;
            const method = req.method.toLowerCase();
            // 找出需要访问中间件的列表
            const resultList = this.match(method, url);
            this.handle(req, res, resultList);
        };
    };

    listen(...args) {
        const server = http.createServer(this.serverHandle());
        server.listen(...args);
    };
};

// 工厂函数
module.exports = () => {
    return new LikeExpress();
};