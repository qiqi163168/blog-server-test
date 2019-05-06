const { sqlExec, escape } = require('../db/mysql.js');
const { genPassword } = require('../utils/cryp.js');

const login = (username, password) => {
    username = escape(username);

    // 生成加密密码
    password = genPassword(password);
    password = escape(password);

    // 先使用假数据
    // if (username === 'zhangsan' && password === '123') {
    //     return true;
    // };
    // return false;

    const sql = `
        select username, realname from users where username=${username} and password=${password}
    `;

    console.log('sql is ... ', sql);

    return sqlExec(sql).then(rows => {
        return rows[0] || {};
    });
}

module.exports = login;