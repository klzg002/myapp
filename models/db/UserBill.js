/**
 * Created by Administrator on 2015/12/9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserBillSchema = Schema({
    account :{type : String},
    billnum : {type : Number},
    recordtime    : {type : Date, default: Date.now},
});
//# 生成表模型，可作为类使用
var UserBill = mongoose.model("UserBill",UserBillSchema);
module.exports = UserBill;