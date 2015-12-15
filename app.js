var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var url = require('url');
//站点配置
var settings = require("./models/db/settings");
var siteFunc = require("./models/siteFunc");
var siteRest = require("./models/siteRest");

var fs = require('fs');
var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

/*指定路由控制*/

app.use('/', routes);
//配置站点地图和robots抓取
app.get('/api?*',function(req, res) {
    var params = url.parse(req.url,true);
    switch(params.query.command){
        case "getaccountbalance":
            siteRest.getbalance(req,res);
            return;
        case "getSSOpara":
            siteFunc.getSSOpara(res);
            return;
        case "login":
            siteRest.login(req,res);
            return;
        case "keepalive":
            siteRest.keepalive(req,res);
            return;
        case "loginout":
            siteRest.loginout(req,res);
            return;
        case "listEvents":
            siteRest.listEvents(req,res);
            return;
        default :
            console.log("error command");
            return;
    }
});
app.post('/api?*',function(req, res) {
    var params = url.parse(req.url,true);
    switch(params.query.command){
        case "postinfo":
            siteRest.postuserinfo(req,res);
            return;
        default :
            console.log("error command");
            return;
    }
});
//数据格式化
app.locals.myDateFormat = function(date){
    moment.locale('zh-cn');
    return moment(date).startOf('hour').fromNow();
};

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//app.get('/api?*', function (req, res) {
//  res.send('GET request to homepage');
//});

module.exports = app;
