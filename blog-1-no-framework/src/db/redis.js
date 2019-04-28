const redis = require('redis');
const { REDIS_CONFIG } = require('../config/db.js');

// 创建客户端
const redisClient = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host);
redisClient.on('error', err => {
    console.error(err);
});

// set数据
function setRedis(key, val) {
    // redis的key和val必须是字符串
    if (typeof val === 'object') {
        val = JSON.stringify(val);
    };
    redisClient.set(key, val, redis.print);
};

// get数据
function getRedis(key) {
    const promise = new Promise((resolve, reject) =>{
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err);
                return;
            };
            // 如果给了一个错误的key
            if (val === null) {
                resolve(null)
                return;
            };
            // 兼容json转换格式
            try {
                resolve(
                    JSON.parse(val)
                );
            } catch (ex) {
                resolve(val)
            };
        });
    });
    return promise;
};

module.exports = {
    setRedis,
    getRedis
};