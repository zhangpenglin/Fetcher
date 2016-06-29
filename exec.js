var exec = require('child_process').exec,
    last = exec('ConsoleApplication1 -m 1 -r 2');

last.stdout.on('data', function (data) {
    console.log('标准输出：' + data);
});

last.on('exit', function (code) {
    console.log('子进程已关闭，代码：' + code);
});