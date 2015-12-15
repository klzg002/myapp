var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var siteFunc = require("./models/siteFunc")
    ,siteRest = require("./models/siteRest");
var routes = require('./routes/index');
var url = require('url');
//站点配置


var fs = require('fs');
var app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*指定路由控制*/
app.get('/api?*',function(req, res) {
  var params = url.parse(req.url,true);
  switch(params.query.command){
    case "getaccountbalance":
      siteRest.getbalance(req,res);
      return;
    case "getfeebalance":
      siteRest.getfeebalance(req,res);
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
    case "postfeeinfo":
      siteRest.postfeeinfo(req,res);
      return;
    default :
      console.log("error command");
      return;
  }
});
routes.setRequestUrl(app);


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
