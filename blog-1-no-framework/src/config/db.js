// 根据环境变量，配置不同的db
const env = process.env.NODE_ENV;

// 配置
let MYSQL_CONFIG;

// 开发环境，本地db
if (env === 'dev') {
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'myblog'
    };
};

if (env === 'production') {
    // 线上服务器地址，先用本地代替
    MYSQL_CONFIG = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'myblog' 
    };
};

module.exports = {
    MYSQL_CONFIG
};