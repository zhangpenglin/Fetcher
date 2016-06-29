// const qs = require('querystring')
// const str={
//     msg:"[ 蔚县人民检察院新建办案用房和专业技术用房建设项目监理 |http://hebeibidding.com.cn/tender/details.aspx?id=930ce653f87d16ea] [ 蔚县人民检察院新建办案用房和专业技术用房建设项目施工 |http://hebeibidding.com.cn/tender/details.aspx?id=052163322dee9dce]",
//     receiver:"123"
// }
// const result=qs.stringify(str,null,null,{ encodeURIComponent: escape })
// console.log(result)
const request = require('request')
var ICVL = require('iconv-lite');

function encodeURIComponent_GBK(str) {
    // if(str==null || typeof(str)=='undefined' || str=='')
    //     return '';
    //
    // var a = str.toString().split('');
    //
    // for(var i=0; i<a.length; i++) {
    //     var ai = a[i];
    //     if( (ai>='0' && ai<='9') || (ai>='A' && ai<='Z') || (ai>='a' && ai<='z') || ai==='.' || ai==='-' || ai==='_') continue;
    //     var b = ICVL.encode(ai, 'gbk');
    //     var e = ['']; // 注意先放个空字符串，最保证前面有一个%
    //     for(var j = 0; j<b.length; j++)
    //         e.push( b.toString('hex', j, j+1).toUpperCase() );
    //     a[i] = e.join('%');
    // }
    // return a.join('');
    return str
}
// request({
//     uri: "http://127.0.0.1:3333/sendnotify",
//     qs: {
//         msg: "[ "+toUnicode("蔚县人民检察院新建办案用房和专业技术用房建设项目施工")+" |http://hebeibidding.com.cn/tender/details.aspx?id=930ce653f87d16ea] [ 蔚县人民检察院新建办案用房和专业技术用房建设项目施工 |http://hebeibidding.com.cn/tender/details.aspx?id=052163322dee9dce]",
//         receiver: "zhangxuehui",
//
//     },
//     qsStringifyOptions:{sep:';', eq:':', options:{
//         encodeURIComponent:function(str){return str}
//     }},
//     proxy: "http://127.0.0.1:8888"
//
// })
request({
    uri: "http://127.0.0.1:3333/sendnotify.cgi?msg=[ 123 |http://hebeibidding.com.cn/tender/details.aspx?id=930ce653f87d16ea] [ 蔚县人民检察院新建办案用房和专业技术用房建设项目施工 |http://hebeibidding.com.cn/tender/details.aspx?id=052163322dee9dce]&receiver=zhangxuehui",
    proxy: "http://127.0.0.1:8888"

})
function toUnicode(theString) {
    var unicodeString = '';
    for (var i=0; i < theString.length; i++) {
        var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
        while (theUnicode.length < 4) {
            theUnicode = '0' + theUnicode;
        }
        theUnicode = '\\u' + theUnicode;
        unicodeString += theUnicode;
    }
    return unicodeString;
} 
// const a=toUnicode("我们")
// console.log(a)