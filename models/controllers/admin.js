/**
 * Created by Administrator on 2015/12/15.
 */
var lib_com = require("../lib/CommonPub");
var BufferHelper = require("../lib/BufferHelper");
var settings = require("../db/settings");
//用户账单实体类
var UserBill = require("../db/UserBill");
//数据库操作对象
var DbOpt = require("../db/Dbopt");

exports.index = function (req, res, next) {
    res.render('index.html',"");
};