const fs = require('fs');
const path = require('path');

const fileName = path.resolve(__dirname, 'data.log');

// 读取文件内容
// problem: data有可能是个非常大的文件，非常占用内存
fs.readFile(fileName, (err, data) => {
    if (err) {
        console.error(err);
        return;
    };
    // data原生是个buffer二进制类型，需要转换为字符串
    console.log(data.toString());
});

// 写入文件
// problem: 频繁调用写入或者写入很大的内容，也很耗费内存
const content = '这是新写入的内容\n';
const opt = {
    flag: 'a' //追加写入覆。盖用 'w'
};
fs.writeFile(fileName, content, opt, (err)=>{
    if (err) {
        console.error(err);
    };
});

// 判断文件是否存在
fs.exists(fileName, (exists) => {
    console.log('exists... ', exists);
});

