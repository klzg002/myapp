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
                                username: result.loginresponse.username,
                                account: result.loginresponse.account,
                                type:result.loginresponse.type,
                            }
                            DbOpt.addOne(User,obj, res,1)
                        }
                        checkdetail();
                    });
                    function checkdetail(){
                        console.log("check UserDetail");
                        var query= UserDetail.find({'account' : result.loginresponse.account});
                        query.exec(function(err,user){
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
                res.end("error");
            }).on("end", function () {
                var result = bufferHelper.toBuffer();
                result = JSON.parse(result);
                if( result.listzonesresponse.errorcode && result.listzonesresponse.errorcode == 401){
                    console.log("RSA error");
                    res.end("error");
                }else{
                    console.log("RSA success");
                    res.send("success");
                    res.end();
                }
            });
        });
        httpreq.on('error', function(err){
            console.log('REQUEST ERROR: ' + err);
            res.end("error");
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
                var billsum = 0,useraccount;
                if(result.listeventsresponse.event){
                    result.listeventsresponse.event.reverse().forEach(function(e) {
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
        var account = params.account;
        var query = UserBill.findOne({'account' : account});
        query.exec(function(err,userbill){
            if(userbill && userbill._id){
                var queryfee=UserFee.find({'account' : account});
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
    },
    getapprovenum : function(req,res){
        UserFee.find({"feestatus": true}).count().exec(function (err, result) {
            if (err) {
                console.log(err)
            } else {
                res.send({"num":result});
                res.end();
            }
        });
    },
    getuserinfo : function(req,res){
        var params = url.parse(req.url,true).query;
        var account = params.account;
        var query = UserDetail.findOne({'account' : account});
        var result = {};
        query.exec(function(err,userdetaill){
            if(userdetaill && userdetaill._id){
                result = userdetaill;
                res.send({"ret":0,"info":result});
                res.end();
            }else{
                res.send({"ret": -1,"info":result});
                res.end();
            }
        });
    },
    moduserinfo : function(req,res){
        var params = url.parse(req.url,true).query;
        DbOpt.updateOneByID(UserDetail,params, res);
    },
    serverloginrsa : function(sessionkey,res,callback){
        var date = (new Date()).getTime();
        var path = "/api?command=listZones&networktype=Advanced&page=1&pagesize=1&response=json&sessionkey="+sessionkey+ "&_=" + date;
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
        var httpreq = http.request(options,function(httpres){
            httpres.setEncoding('utf8');
            var bufferHelper = new BufferHelper();
            httpres.on('data',function(chunk){
                bufferHelper.concat(chunk);
            }).on('error',function(e){
                console.log("RESPONSE ERROR"+e.message);
                res.redirect("/");
            }).on("end", function () {
                var result = bufferHelper.toBuffer();
                result = JSON.parse(result);
                if( result.listzonesresponse.errorcode && result.listzonesresponse.errorcode == 401){
                    res.redirect("/");
                    res.end();
                    callback(0);
                }else{
                    callback(1);
                }
            });
        });
        httpreq.on('error', function(err){
            console.log('REQUEST ERROR: ' + err);
            res.redirect("/");
        });
        httpreq.end();
    },
    serverkeeplogin:function(sessionkey){
        var date = (new Date()).getTime();
        var path = "/api?command=listZones&networktype=Advanced&page=1&pagesize=1&response=json&sessionkey="+sessionkey+ "&_=" + date;
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
        var httpreq = http.request(options,function(httpres){
            httpres.setEncoding('utf8');
            var bufferHelper = new BufferHelper();
            httpres.on('data',function(chunk){
                bufferHelper.concat(chunk);
            }).on('error',function(e){
                console.log("RESPONSE ERROR"+e.message);
            }).on("end", function () {
                var result = bufferHelper.toBuffer();
                result = JSON.parse(result);
                if( result.listzonesresponse.errorcode && result.listzonesresponse.errorcode == 401){
                    console.log("login error");
                }else{
                    console.log("login success");
                }
            });
        });
        httpreq.on('error', function(err){
            console.log('REQUEST ERROR: ' + err);
            res.redirect("/");
        });
        httpreq.end();
    },
    getuserList:function(sessionkey,callback) {
        var priceInfos = {}, runningVmsUsageByAcc = {}, totalUsagesByAcc = {};
        var accountCapacities = new Array;

        var options = {
            hostname: settings.mgt_hostname,
            port: settings.mgt_port,
            path: "/api?command=listresourceprices&listall=true&response=json&sessionkey=" + sessionkey,
            method: 'GET',
            headers: {
                "Cookie": settings.mgt_session,
            },
        };

        lib_com.httprequest(options, function (json) {
            var prices = json.listresourcepricesresponse.resourceprice || [];
            for (var i in prices) {
                priceInfos[prices[i].resourcename] = prices[i];
            }
            var options = {
                hostname: settings.mgt_hostname,
                port: settings.mgt_port,
                path: "/api?command=listRunningVmsUsage&listall=true&response=json&sessionkey=" + sessionkey,
                method: 'GET',
                headers: {
                    "Cookie": settings.mgt_session,
                },
            };
            lib_com.httprequest(options, function (json) {
                var runningVmsUsages = json.listrunningvmsusageresponse.runningvmsusage || [];
                for (var i in runningVmsUsages) {
                    if (!runningVmsUsageByAcc[runningVmsUsages[i].accountid]) {
                        runningVmsUsageByAcc[runningVmsUsages[i].accountid] = runningVmsUsages[i];
                    }
                }
                var options = {
                    hostname: settings.mgt_hostname,
                    port: settings.mgt_port,
                    path: "/api?command=listtotalusage&listall=true&response=json&sessionkey=" + sessionkey,
                    method: 'GET',
                    headers: {
                        "Cookie": settings.mgt_session,
                    },
                };
                lib_com.httprequest(options, function (json) {
                    var totalUsages = json.listtotalusageresponse.allusage || [];

                    for (var i in totalUsages) {
                        if (!totalUsagesByAcc[totalUsages[i].accountid]) {
                            totalUsagesByAcc[totalUsages[i].accountid] = {};
                        }
                        if (totalUsages[i].type == "cpu") {
                            totalUsagesByAcc[totalUsages[i].accountid]["cpu"] = totalUsages[i].allusage;
                        } else if (totalUsages[i].type == "memory") {
                            totalUsagesByAcc[totalUsages[i].accountid]["memory"] = totalUsages[i].allusage;
                        } else if (totalUsages[i].type == "disk") {
                            totalUsagesByAcc[totalUsages[i].accountid]["disk"] = totalUsages[i].allusage;
                        }
                    }
                    var options = {
                        hostname: settings.mgt_hostname,
                        port: settings.mgt_port,
                        path: "/api?command=listAccounts&listall=true&page=1&pagesize=60&response=json&sessionkey=" + sessionkey,
                        method: 'GET',
                        headers: {
                            "Cookie": settings.mgt_session,
                        },
                    };
                    lib_com.httprequest(options, function (json) {
                        var allAccount = json.listaccountsresponse.account || [];
                        allAccount.forEach(function (account) {
                            account.cputotal = account.cputotal.toFixed(2);
                            account.memorytotal = (account.memorytotal / 1024).toFixed(2);
                            account.runningvmsmemorytotal = (runningVmsUsageByAcc[account.id].memory / 1024).toFixed(2);
                            account.runningvmscputotal = runningVmsUsageByAcc[account.id].cpunumber;
                            if (!account.vmrunning)
                                account.vmrunning = 0;
                            if (!account.vmstopped)
                                account.vmstopped = 0;

                            account.cpuUsed = (parseInt(totalUsagesByAcc[account.id].cpu) / (60 * 60)).toFixed(3);
                            account.memoryUsed = (parseInt(totalUsagesByAcc[account.id].memory) / (1024 * 60 * 60)).toFixed(3);
                            account.diskUsed = (parseInt(totalUsagesByAcc[account.id].disk) / (1024 * 1024 * 1024 * 60 * 60)).toFixed(3);

                            account.billing = (account.cpuUsed * priceInfos["cpu"].price + account.memoryUsed * priceInfos["memory"].price + account.diskUsed * priceInfos["disk"].price).toFixed(3);

                            accountCapacities.push(account);
                        });
                        callback(accountCapacities);
                    });

                });
            });
        });
    }
};
module.exports = siteRest;