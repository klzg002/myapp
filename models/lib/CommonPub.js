/**
 * Created by Administrator on 2015/10/18.
 */
var http = require('http');
var BufferHelper = require("./BufferHelper");

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
exports.httprequest = function(options,callback){

    var httpreq = http.request(options,function(httpres){
        httpres.setEncoding('utf8');
        var bufferHelper = new BufferHelper();
        httpres.on('data',function(chunk){
            bufferHelper.concat(chunk);
        }).on('error',function(e){
            console.log("RESPONSE ERROR"+e.message);
            httpreq.end();
        }).on("end", function () {
            try{
                var subresult= bufferHelper.toBuffer().toString();
                try{
                    var result = JSON.parse(subresult);
                }catch(e){
                    console.log("~~~~~~~"+e);
                }
                //var result = eval('('+subresult2+')');
                //var result = JSON.parse(bufferHelper.toBuffer().toString());
                httpreq.end();
                callback(result);
            }catch (e) {
                httpreq.end();
            }
        });
    });
    httpreq.on('error', function(err){
        console.log('REQUEST ERROR: ' + err);
    });
    httpreq.end();
}