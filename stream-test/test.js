// // demo1 - 标准输入输出
// process.stdin.pipe(process.stdout);


// // demo2 - 通过POST传一个数据，传完之后立马返回
// const http = require('http');
// const server = http.createServer((req, res) => {
//   if (req.method === 'POST') {
//     // 最主要的就是这句
//     req.pipe(res);
//   };
// });
// server.listen(8889);


// // demo3 - 复制文件
// var fs = require('fs');
// var path = require('path');
// // 两个文件名
// var fileName1 = path.resolve(__dirname, 'data.log');
// var fileName2 = path.resolve(__dirname, 'data-bak.log');
// // 读取文件的stream对象
// var readStream = fs.createReadStream(fileName1);
// // 写入文件的stream对象
// var writeStream = fs.createWriteStream(fileName2);
// // 执行拷贝，通过pipe
// readStream.pipe(writeStream);
// // 打印chunk，观察每次读取的内容
// // readStream不同于readFile的一次性读取，它是一点点读取的
// readStream.on('data', chunk => {
//   console.log(chunk.toString());
// });
// // 数据读取完成，即拷贝完成
// readStream.on('end', function() {
//   console.log('拷贝完成');
// });

// demo4 - GET请求读取文件内容
var http = require('http');
var fs = require('fs');
var path = require('path');

var server = http.createServer(function(req, res) {
  var method = req.method; //获取请求方法
  if (method === 'GET') {
    var fileName = path.resolve(__dirname, 'data.log');
    var stream = fs.createReadStream(fileName);
    stream.pipe(res); // 将res作为stream的dest
  }
});
server.listen(8000);