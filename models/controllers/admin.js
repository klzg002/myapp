/**
 * Created by Administrator on 2015/12/15.
 */
//公共部分
var url = require('url');
//lib库
var lib_com = require("../lib/CommonPub");
var settings = require("../db/settings");

//用户账单实体类
var UserFee = require("../db/UserFee");
//数据库操作对象
var DbOpt = require("../db/Dbopt");

exports.index = function (req, res, next) {
    if(req.params.account && settings.adminuser.indexOf(req.params.account)>= 0) {
        //默认排序查询条件
        UserFee.find({"feestatus": true}).sort({"recordtime": -1}).exec(function (err, feelist) {
            if (err) {
                console.log(err)
            } else {
                res.render('index.html', {"feelist": feelist});
            }
        });
    }else{
        console.log(req.params.account)
        console.log(settings.adminuser.indexOf(req.params.account))
        res.redirect("/");
    }

};

exports.approve = function (req, res, next) {
    var args = url.parse(req.url,true).query;
    var _id = args._id;
    //默认排序查询条件
    UserFee.findByIdAndUpdate(_id,{$set:{feestatus:false}},function(err,userfee){
        if(err){
            res.end(err.toString());
        }else {
            if(userfee){
                res.end('success');
            }else{
                res.end('update num'+userfee+'error num please check');
            }
        }
    });

};