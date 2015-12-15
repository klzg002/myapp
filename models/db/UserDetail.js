/**
 * Created by Administrator on 2015/12/9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserDetailSchema = Schema({
    userid:{type : String},
    account:{type : String},
    phone: {type: Number},
    copyright: {type : String},
    time     : {type : Date, default: Date.now},
});
//# 生成表模型，可作为类使用
var UserDetail = mongoose.model("UserDetail",UserDetailSchema);
module.exports = UserDetail;