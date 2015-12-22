/**
 * Created by Administrator on 2015/12/9.
 */
var mongoose = require('mongoose')
var url = require('url');
var lib_com = require("../lib/CommonPub")
/* 确定数据库的初始化设置
 连接blogs集合 */
var db = mongoose.connect('localhost', 'myapp')
//定义数据结构
var DbOpt = {
    addOne : function(obj,req,res,flag){
        if(!flag){
            var params = url.parse(req.url,true).query;
            lib_com.writeObj(params);
            var newObj = new obj(params);
            newObj.save(function(err){
                if(err){
                    res.end(err.toString());
                }else{
                    res.end("success");
                }
            });
        }else{
            lib_com.writeObj(req);
            var newObj = new obj(req);
            newObj.save();
        }

    },
    updateOneByID : function(obj,info,res){
        lib_com.writeObj(info);
        var conditions = {account : info.account};
        var update     = {$set :info};
        var options    = {"upsert" : true};
        obj.update(conditions, update, options, function(err,result){
            if(err) {
                console.log(err);
                res.end(err.toString());
            } else {
                console.log("update success!");
                res.end('success');
            }
        });
    },
}
module.exports = DbOpt;