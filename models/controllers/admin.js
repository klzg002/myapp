/**
 * Created by Administrator on 2015/12/15.
 */
var lib_com = require("../lib/CommonPub");
var settings = require("../db/settings");
//用户账单实体类
var UserFee = require("../db/UserFee");
//数据库操作对象
var DbOpt = require("../db/Dbopt");

exports.index = function (req, res, next) {
    //默认排序查询条件
    UserFee.find({"feestatus":true}).sort({"recordtime":-1}).exec(function(err,feelist){
        if(err){
            console.log(err)
        }else {
            res.render('index.html',{"feelist":feelist});
        }
    });

};