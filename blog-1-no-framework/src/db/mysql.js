// 引用配置，将执行mysql语句，并返回结果
const mysql = require('mysql');
const { MYSQL_CONFIG } = require('../config/db.js');

// 创建连接对象
const con = mysql.createConnection(MYSQL_CONFIG);

// 开始连接
con.connect();

// 统一执行sql的函数
function sqlExec (sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                return;
            };
            resolve(result);
        });
    });
    return promise;
};

module.exports = {
    sqlExec,
    // escape: mysql.escape
};