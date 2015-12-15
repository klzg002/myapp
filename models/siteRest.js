/**
 * Created by Administrator on 2015/4/18.
 */
//站点配置
var lib_com = require("../models/lib/CommonPub");
var BufferHelper = require("../models/lib/BufferHelper");
var settings = require("../models/db/settings");
var http = require('http');
var url = require('url');
//用户实体类
var User = require("../models/db/User");
//用户详情实体类
var UserDetail = require("../models/db/UserDetail");
//用户账单实体类
var UserBill = require("../models/db/UserBill");
//用户发票实体类
var UserFee = require("../models/db/UserFee");
//数据库操作对象
var DbOpt = require("../models/db/Dbopt");
//时间格式化
//var moment = require('moment');
//mongoose.connect('mongodb://'+settings.USERNAME+':'+settings.PASSWORD+'@'+settings.HOST+':'+settings.PORT+'/'+settings.DB+'');

//信息删除操作

var siteRest = {
    login : function(req,res){
        var path = url.parse(req.url).query;
        //console.log("path:"+path);
        var options = {
            hostname: settings.mgt_hostname,
            port: settings.mgt_port,
            path: '/api?'+path,
            method: 'GET',
            headers: {
            },
        };

        var sendresult = {};
        var httpreq = http.request(options,function(httpres){
            settings.mgt_session = httpres.headers["set-cookie"][0].split(";")[0];
            httpres.setEncoding('utf8');
            var bufferHelper = new BufferHelper();
            httpres.on('data',function(chunk){
                bufferHelper.concat(chunk);
            }).on('error',function(e){
                console.log("RESPONSE ERROR"+e.message);
            }).on("end", function () {
                try{
                    var result = bufferHelper.toBuffer();
                    result = JSON.parse(result);
                    sendresult.loginresponse = result.loginresponse;
                    //用户是否已记录
                    var query=User.find({'userid' : result.loginresponse.userid});
                    query.exec(function(err,user){
                        if(user.length <= 0){
                            var obj = {
                                userid:result.loginresponse.userid,
                                username: result.loginresponse.username.replace(/\@.*/,''),
                                account: result.loginresponse.account,
                            }
                            DbOpt.addOne(User,obj, res,1)
                        }
                        checkdetail();
                    });
                    function checkdetail(){
                        console.log("check UserDetail");
                        var query= UserDetail.find({'userid' : result.loginresponse.userid});
                        query.exec(function(err,user,checkdetail){
                            if(user.length <= 0){
                                sendresult.loginresponse.userdetail = 1;
                            }else{
                                sendresult.loginresponse.userdetail = 0;
                            }
                            res.send(sendresult);
                            res.end();
                        });
                    }

                }catch (e) {
                    console.error(result,e);
                    httpreq.end();
                    res.end();
                }
            });
        });
        httpreq.on('error', function(err){
            console.log('REQUEST ERROR: ' + err);
        });
        httpreq.end();
    },
    keepalive : function(req,res){
        var args = url.parse(req.url,true).query;
        var date = (new Date()).getTime();
        var path = "/api?command=listZones&networktype=Advanced&page=1&pagesize=1&response=json&sessionkey="+args.session+ "&_=" + date;
        console.log("get session:"+settings.mgt_session);
        var options = {
            hostname: settings.mgt_hostname,
            port: settings.mgt_port,
            path: path,
            method: 'GET',
            headers: {
                "Cookie" : settings.mgt_session,
            },
        };
        var sendresult = {};
        var httpreq = http.request(options,function(httpres){
            httpres.setEncoding('utf8');
            var bufferHelper = new BufferHelper();
            httpres.on('data',function(chunk){
                bufferHelper.concat(chunk);
            }).on('error',function(e){
                console.log("RESPONSE ERROR"+e.message);
            }).on("end", function () {
                var result = bufferHelper.toBuffer();
                res.send(sendresult);
                res.end();
            });
        });
        httpreq.on('error', function(err){
            console.log('REQUEST ERROR: ' + err);
        });
        httpreq.end();

    },
    listEvents: function(req,res){
        var urlpath = url.parse(req.url).query;
        var params = url.parse(req.url,true).query;
        var options = {
            hostname: settings.mgt_hostname,
            port: settings.mgt_port,
            path: '/api?'+urlpath,
            method: 'POST',
            headers: {
                "Cookie" :settings.mgt_session,
            },
        };

        var httpreq = http.request(options, function (httpres) {
            httpres.setEncoding('utf8');
            var bufferHelper = new BufferHelper();
            httpres.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            }).on('error', function (e) {
                console.log("RESPONSE ERROR" + e.message);
                res.end(e.message);
            }).on("end", function () {
                var result = bufferHelper.toBuffer();
                result = JSON.parse(result);
                lib_com.writeObj(result);
                var billsum = 0,useraccount;
                if(result.listeventsresponse.event){
                    result.listeventsresponse.event.reverse().forEach(function(e,checkbillnum) {
                        //lib_com.writeObj(e);
                        useraccount = e.account;
                        if (e.state == "Completed") {
                            var userbillnum = e.description.replace(/.*pay:\s+(\d+).*/, "$1");
                            billsum += +userbillnum;
                        }
                    });
                }


                var obj = {
                    account: useraccount||params.account,
                    billnum: billsum,
                }
                lib_com.writeObj(obj);
                DbOpt.updateOneByID(UserBill,obj, res)
                res.end("success");
            });
        });
        httpreq.on('error', function (err) {
            console.log('REQUEST ERROR: ' + err);
        });
        httpreq.end();

    },
    getbalance:function(req,res){
        var urlpath = url.parse(req.url).query;
        var options = {
            hostname: settings.mgt_hostname,
            port: settings.mgt_port,
            path: '/api?'+urlpath,
            method: 'GET',
            headers: {
                "Cookie" :settings.mgt_session,
            },
        };
        var sendresult = {};
        var httpreq = http.request(options, function (httpres) {
            httpres.setEncoding('utf8');
            var bufferHelper = new BufferHelper();
            httpres.on('data', function (chunk) {
                bufferHelper.concat(chunk);
            }).on('error', function (e) {
                console.log("RESPONSE ERROR" + e.message);
            }).on("end", function () {
                var result = bufferHelper.toBuffer().toString();
                console.log("result :"+result)
                result = JSON.parse(result);
                //lib_com.writeObj(result);
                sendresult = result.getaccountbalanceresponse;
                //lib_com.writeObj(sendresult);
                res.send(sendresult);
                res.end();
            });
        });
        httpreq.on('error', function (err) {
            console.log('REQUEST ERROR: ' + err);
        });
        httpreq.end();
    },
    getfeebalance:function(req,res){
        var params = url.parse(req.url,true).query;
        lib_com.writeObj(params);
        var account = params.account;
        var query = UserBill.findOne({'account' : account});
        query.exec(function(err,userbill){
            console.log(err);
            if(userbill && userbill._id){
                var queryfee=UserFee.findone({'account' : account});
                queryfee.exec(function(err,userfee){
                    var result = userbill.billnum;
                    if(userfee.length > 0){
                        userfee.forEach(function(e){
                            result -= e.feenum;
                        });
                    }
                    res.send({"data":result});
                    res.end();
                });
            }else{
                res.send({"data":0});
                res.end();
            }
        });
    },
    loginout:function(req,res){
        settings.mgt_session = "";
        res.send({"ret":"ok"});
        res.end();
    },
    postuserinfo:function(req,res){
        var params = url.parse(req.url,true).query;
        lib_com.writeObj(params);
        var account = params.account;
        //用户ID必须唯一
        var query=UserDetail.find({'account' : account});
        query.exec(function(err,user){
            if(user.length > 0){
                errors = "用户信息已存在";
                res.end(errors);
            }else{
                DbOpt.addOne(UserDetail,req, res)
            }
        });
    },
    postfeeinfo:function(req,res){
        DbOpt.addOne(UserFee,req, res)
    }

};
module.exports = siteRest;