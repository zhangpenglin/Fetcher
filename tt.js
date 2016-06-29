var edge = require('edge');

var helloWorld = edge.func({
    source: function () {/*

     using System;
     using System.Collections.Generic;
     using System.ComponentModel;
     using System.Data;
     using System.Drawing;
     using System.Text;
     using System.Windows.Forms;
     using RTXSAPILib;
     using System.Runtime.InteropServices;


     public class Startup
     {
     public async Task<object> Invoke(object input)
     {
     RTXSAPILib.RTXSAPIRootObj RootObj= new RTXSAPIRootObj();  //声明一个根对象
     RootObj.ServerIP = "127.0.0.1"; //设置服务器IP
     RootObj.ServerPort = Convert.ToInt16("8006"); //设置服务器端口
     RootObj.SendNotify("zhangxuehui" ,null ,null,"[我们|http://www.baidu.com]");
     return "123";
     }
     }

     */
    },
    references: ['APIObject.dll']
});

helloWorld('JavaScript', function (error, result) {
    if (error) throw error;
    console.log(result);
});