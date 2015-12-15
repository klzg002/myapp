/**
 * Created by Administrator on 2015/10/18.
 */

exports.isEmptyObject = function (obj){
    for(var n in obj){return false}
    return true;
}
exports.writeObj = function (obj){
    var description = "";
    for(var i in obj){
        var property=obj[i];
        description+=i+" = "+property+"\n";
    }
    console.log(description);
}