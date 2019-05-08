// 根据环境变量，配置不同的db
const env = process.env.NODE_ENV;

// 配置
let MYSQL_CONFIG;
let REDIS_CONFIG;

// 开发环境
if (env === 'dev') {
    // MySQL
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'myblog'
    };

    // Redis
    REDIS_CONFIG = {
        port: 6379,
        host: '127.0.0.1'
    };
};

// 生产环境，先用本地代替
if (env === 'prd') {
    // MySQL
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'myblog'
    };

    // Redis
    REDIS_CONFIG = {
        port: 6379,
        host: '127.0.0.1'
    };
};

module.exports = {
    MYSQL_CONFIG,
    REDIS_CONFIG
};