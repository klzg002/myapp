/**
 * Created by Administrator on 2015/12/9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    userid:{type : String},
    username: {type : String},
    account: {type : String},
    type:{type:Number},
    time     : {type : Date, default: Date.now},
});
//# 生成表模型，可作为类使用
var User = mongoose.model("User",UserSchema);
module.exports = User;
