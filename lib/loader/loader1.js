module.exports = function(source) {

    //console.log("source",source);
    return source.replace(/console.log\(.*\);?/ig,'哇哇哇') + "//文件的最后"




}
//实现一个简单的loader，功能是替换console.log、去除换行符、在文件结尾处增加一行自定义内容
