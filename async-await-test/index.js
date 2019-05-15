const fs = require('fs');
const path = require('path');

// async-await是基于promise的，相当于promise的语法糖

// 使用promise获取文件内容，避免遇到callback-hell
function getFileContent(fileName) {
    const promise = new Promise((resolve, reject) => {
        const fullFileName = path.resolve(__dirname, 'files', fileName);
        fs.readFile(fullFileName, (err, data) => {
            if (err) {
                console.error(err);
                return;
            };
            resolve(
                JSON.parse(data.toString())
            );
        });
    });
    return promise;
};

// // test promise
// getFileContent('a.json').then(aData => {
//     console.log('a data', aData);
//     return getFileContent(aData.next);
// }).then(bData => {
//     console.log('b data', bData);
//     return getFileContent(bData.next);
// }).then(cData => {
//     console.log('c data', cData);
// })

// await一定要用async函数包裹起来
async function readFileData() {
    // try-catch 截获 promise 中 reject 的值
    try {
        // getFileContent 返回的是 promise
        // await promise 返回的是该 promise 里面的 resolve 内容
        // 虽然 promise 是异步的，到那时 await 看起来已经是同步的写法了
        // 执行 async 函数返回的也是 promise 函数
        const aData = await getFileContent('a.json');
        console.log('aData ... ', aData);
        const bData = await getFileContent(aData.next);
        console.log('bData ... ', bData);
        const cData = await getFileContent(bData.next);
        console.log('cData ... ', cData);
    } catch (err) {
        console.error(err);
    };
};

readFileData();