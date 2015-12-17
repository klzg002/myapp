/**
 * Created by dora on 2015/4/8.
 */

module.exports = {
	//
	////mysql info
	//dbhost : '172.20.1.50',
	//port  : 3306,
	//user  : 'cloud',
	//password  : 'ucloud',
	//database : 'cloud',
	//maxConnLimit : 1024,
	//charset : 'UTF8_GENERAL_CI',

    //sso

	LOGIN_URL : "http://udn.yyuap.com/sso/admin.php/Home/Authorize/generateCode",
    hostname : "udn.yyuap.com",
    path : "/sso/admin.php/Home/Authorize/generateCode",
    TOKEN_URL : "http://udn.yyuap.com/sso/admin.php/Home/Token/getToken/",
    CLIENT_ID : "49",
    CLIENT_SECRET : "50C12F46655F467E892F028C0B37276B",
    REDIRECT_URI : "http://127.0.0.1:3000/index.html",
    GRANT_TYPE : "authorization_code",
    RESPONSE_TYPE : "code",
    CODE : "",
    hostip : "api?",


// mgt info
//	mgt_hostname:"cloudmgt.yyuap.com",
//	mgt_port:"8080",
	mgt_hostname:"123.103.9.193",
	mgt_port:"7024",
	mgt_path: "/api",
	mgt_session:"",

//手工指定管理员
	adminuser:["cuibq@yonyou.com","2004-liqing@163.com"],
};
