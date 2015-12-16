/**
 * Created by Administrator on 2015/12/9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserFeeSchema = Schema({
    account :{type : String}, //账户
    feenum : {type : Number}, //发票金额
    feestatus : {type : Boolean},//发票状态
    feetype:{type:String}, //发票类型
    feehead : {type : String},//发票抬头
    feeaddress: {type : String},//发票地址
    feeuser: {type : String},//收件人
    feephone: {type : String},//收件人电话
    recordtime    : {type : Date, default: Date.now},//申请时间

});
//# 生成表模型，可作为类使用
var UserFee = mongoose.model("UserFee",UserFeeSchema);
module.exports = UserFee;