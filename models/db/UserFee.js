/**
 * Created by Administrator on 2015/12/9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserFeeSchema = Schema({
    account :{type : String},
    feenum : {type : Number},
    feestatus : {type : Boolean},
    feetype:{type:String},
    feehead : {type : String},
    feeaddress: {type : String},
    feeuser: {type : String},
    feephone: {type : String},
    recordtime    : {type : Date, default: Date.now},

});
//# 生成表模型，可作为类使用
var UserFee = mongoose.model("UserFee",UserFeeSchema);
module.exports = UserFee;