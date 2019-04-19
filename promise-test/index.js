// fs是nodejs里面文件操作的原生模块
const fs = require('fs');
// path是nodejs里面关于文件路径的原生模块
const path = require('path');

// const fullFileName = path.resolve(__dirname, 'files', 'a.json');
// fs.readFile(fullFileName, (err, data) => {
//     if (err) {
//         console.error(err);
//         return;
//     };
//     console.log(data.toString());
// });

// // callback 方式获取一个文件的内容
// function getFileContent(fileName, callback) {
//     const fullFileName = path.resolve(__dirname, 'files', fileName);
//     fs.readFile(fullFileName, (err, data) => {
//         if (err) {
//             console.error(err);
//             return;
//         };
//         callback(
//             JSON.parse(data.toString())
//         );
//     });
// };

// // test callback-hell
// getFileContent('a.json', aData => {
//     console.log('a data', aData);
//     getFileContent(aData.next, bData => {
//         console.log('b data', bData);
//         getFileContent(bData.next, cData => {
//             console.log('c data', cData);
//         });
//     });
// });

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
// test promise
getFileContent('a.json').then(aData => {
    console.log('a data', aData);
    return getFileContent(aData.next);
}).then(bData => {
    console.log('b data', bData);
    return getFileContent(bData.next);
}).then(cData => {
    console.log('c data', cData);
})

// async await 更方便，koa2原生支持