/**
 * Created by Administrator on 2015/4/18.
 */
//站点配置
var lib_com = require("../models/lib/CommonPub");
var settings = require("../models/db/settings");
var dbh = require("../models/db/MysqlPub").dbh;
var siteRest = require("../models/siteRest");
//时间格式化
//var moment = require('moment');
//mongoose.connect('mongodb://'+settings.USERNAME+':'+settings.PASSWORD+'@'+settings.HOST+':'+settings.PORT+'/'+settings.DB+'');

//信息删除操作

var siteFunc = {
    getuuid : function(username,res){
        var get_result = function(callback) {
            var connection = dbh.dbhandle();
            if (connection !== undefined) {
                connection.connect(function (err) {
                    if (err) {
                        callback ({"ret":-1,"message":"connection error"});
                    }
                    console.log('connected as id ' + connection.threadId);
                });
                var querysql = "select uuid from account where account_name =?";
                var params = [username];
                connection.query(querysql, params, function (err, rows, fields) {
                    if (err) {
                        console.log('[query] - :' + err);
                        callback({"ret": -1, "message": err});
                    }
                    if (lib_com.isEmptyObject(rows)) {
                        callback({"ret": -1, "message": "result empty"});
                    }
                    var uuid = rows[0].uuid;
                    console.log('query success:');
                    console.log("rows:" + uuid);
                    callback({"ret": 0, "id": uuid});
                });
                dbh.release(connection);
            }else{
                callback ({"ret":-1,"message":"creat handle error"});
            }
        }
        get_result(function(data){
            console.log("result:"+ JSON.stringify(data));
            return  siteRest.getbalance(data.id,res);
        });
    },
    getSSOpara : function(res){
        var data = {
            LOGIN_URL : settings.LOGIN_URL,
            TOKEN_URL : settings.TOKEN_URL,
            CLIENT_ID : settings.CLIENT_ID,
            CLIENT_SECRET : settings.CLIENT_SECRET,
            REDIRECT_URI : settings.REDIRECT_URI,
            GRANT_TYPE : settings.GRANT_TYPE,
            RESPONSE_TYPE : settings.RESPONSE_TYPE,
            CODE : settings.CODE,
            hostip : settings.hostip,
        };
        if(data){
            res.send({err_no:0,"data":data});
        }else{
            res.send({err_no:-1});
        }
        res.end();
    }

};


module.exports = siteFunc;