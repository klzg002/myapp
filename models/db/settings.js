/**
 * Created by dora on 2015/4/8.
 */

module.exports = {

	// debug Ϊ true
	debug: false,
	session_secret: 'doracms_secret', //
	auth_cookie_name: 'doracms',
	encrypt_key : 'dora',

	//mysql info
	dbhost : '172.20.1.50',
	port  : 3306,
	user  : 'cloud',
	password  : 'ucloud',
	database : 'cloud',
	maxConnLimit : 1024,
	charset : 'UTF8_GENERAL_CI',

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

//   mongodb
	URL: 'mongodb://127.0.0.1:27017/doracms',
	DB: 'doracms',
	HOST: '',
	PORT: 27017,
	USERNAME: '',
	PASSWORD: '',


//  redis config
	redis_host: '127.0.0.1',
	redis_port: 6379,
	redis_psd : '',
	redis_db: 0,

//    email
	site_email : 'xx@163.com',
	site_email_psd : 'xxx',
	email_findPsd : 'findPsd',
	email_reg_active : 'reg_active',
	email_notice_contentMsg : 'notice_contentMsg',
	email_notice_contentBug : 'notice_contentBug',
	email_notice_user_contentMsg : 'notice_user_contentMsg',

};
