exports.setRequestUrl=function(app){
  var siteFunc = require("../models/siteFunc")
      ,siteRest = require("../models/siteRest")
      ,admin = require("../models/controllers/admin");

  //var user = require('./Controllers/user')
  //    ,indexObj = require('./controllers/index')
  //    ,fileObj = require('./controllers/fileSystem')
  //    ,mongoObj = require('./controllers/mongoManagement')
  //    ,articleObj = require('./controllers/article');
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
  app.get('/admin',admin.index);

  //app.get('/', user.login);
  //app.post('/onLogin', user.onLogin);
  //app.get('/userList', user.userList);
  //app.get('/user/addUser', user.addUser);
  //app.get('/user/userManager', user.userManager);
  //
  //app.post('/index/newContent', indexObj.newContent);
  //app.get('/index', indexObj.index);
  //app.get('/index/:id', indexObj.viewContect);
  //app.get('/index/:id/edit', indexObj.editContect);
  //app.post('/index/:id/edit', indexObj.saveContect);
  //app.get('/index/:id/delete', indexObj.deleteContectById);
  //
  //app.all("/mongo/index",mongoObj.index);
  //
  //app.get("/file/*",fileObj.initFileInfo)
  //app.get("/fileBrowser/pdf/*",fileObj.initPdf)
  //
  //
  ////  app.get("/article/articleManager",articleObj.initManager);
  //app.get("/article/articleManager/:articleId?",articleObj.initManager);
  //app.get("/article/articleDetail/:articleId?",articleObj.articleDetail);
  //app.get("/article/articleItem",articleObj.articleItem);
  //app.all("/article/search",articleObj.search)
  //
  //app.post("/article/saveArticleType",articleObj.saveArticleType);
  //app.post("/article/saveArticleDetail",articleObj.saveArticleDetail);
  //app.get("/article/listContext",articleObj.listContextPage);
  //app.get("/article/articleTypeAll",articleObj.articleTypeAll);
}