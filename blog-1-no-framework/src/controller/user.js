const { sqlExec } = require('../db/mysql.js');

const login = (username, password) => {
    // 先使用假数据
    // if (username === 'zhangsan' && password === '123') {
    //     return true;
    // };
    // return false;

    const sql = `
        select username, realname from users where username='${username}' and password='${password}'
    `;

    return sqlExec(sql).then(rows => {
        return rows[0] || {};
    });
}

module.exports = login;