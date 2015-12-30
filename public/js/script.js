function include(url){
    document.write('<script src="'+url+'"></script>');
    return false ;
}
function includecss(file){
    document.write('<link rel="stylesheet" href="'+file+'">')
    return false ;
}

/* cookie.JS
 ========================================================*/
include('js/jquery.cookie.js');

/* cookie.JS
 ========================================================*/
include('js/TMForm.js');
include('js/modal.js');


/* DEVICE.JS
 ========================================================*/
include('js/device.min.js');

/* Stick up menu
 ========================================================*/
include('js/tmstickup.js');
$(window).load(function() {
    if ($('html').hasClass('desktop')) {
        $('#stuck_container').TMStickUp({
        })
    }
});

/* Easing library
 ========================================================*/
include('js/jquery.easing.1.3.js');


/* ToTop
 ========================================================*/
include('js/jquery.ui.totop.js');
$(function () {
    $().UItoTop({ easingType: 'easeOutQuart' });
});



/* DEVICE.JS AND SMOOTH SCROLLIG
 ========================================================*/
include('js/jquery.mousewheel.min.js');
include('js/jquery.simplr.smoothscroll.min.js');
include('js/jquery.iDialog.js');
includecss('css/iDialog.css');
$(function () {
    if ($('html').hasClass('desktop')) {
        $.srSmoothscroll({
            step:120,
            speed:800
        });
    }
});

/* Superfish menu
 ========================================================*/
include('js/superfish.js');
include('js/jquery.mobilemenu.js');


/* Orientation tablet fix
 ========================================================*/
$(function(){
// IPad/IPhone
    var viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]'),
        ua = navigator.userAgent,

        gestureStart = function () {viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6, initial-scale=1.0";},

        scaleFix = function () {
            if (viewportmeta && /iPhone|iPad/.test(ua) && !/Opera Mini/.test(ua)) {
                viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
                document.addEventListener("gesturestart", gestureStart, false);
            }
        };

    scaleFix();
    // Menu Android
    if(window.orientation!=undefined){
        var regM = /ipod|ipad|iphone/gi,
            result = ua.match(regM)
        if(!result) {
            $('.sf-menu li').each(function(){
                if($(">ul", this)[0]){
                    $(">a", this).toggle(
                        function(){
                            return false;
                        },
                        function(){
                            window.location.href = $(this).attr("href");
                        }
                    );
                }
            })
        }
    }
});
var ua=navigator.userAgent.toLocaleLowerCase(),
    regV = /ipod|ipad|iphone/gi,
    result = ua.match(regV),
    userScale="";
if(!result){
    userScale=",user-scalable=0"
}
document.write('<meta name="viewport" content="width=device-width,initial-scale=1.0'+userScale+'">')

/* custom hover
 ========================================================*/


//SSO
$(document).ready(function(){

    //登录相关代码
    var d = getQueryString("code");
    var s = getQueryString("state");
    var e = getQueryString("errorinfo");
    var cloud = {};
    $('#login_btn').bind("click",handler);
    $('#login_btn').trigger("click",!0);
    $('#reg_btn').bind('click',ssoreg);
    $('#logout_btn').bind('click',ssologout);
    function handler(event,message){
        if(e){
            if(e=="timeout") {
                console.log(e);
                $.dialog({
                    title: '错误提示',
                    width: 400,
                    height: 130,
                    opacity: .5,
                    id: 'auto-hide',
                    time: 3000,
                    lock: true,
                    content: '<div style="text-align: center"><p>登录超时，请重新登录。</p><p><span id="my-time" style="color:#EE4C58">3</span> 秒后自动关闭！</p></div>',
                    show: function () {
                        var index = 3,
                            $time = $('#my-time').html(index),
                            that = this;
                        var interval = setInterval(function () {
                            if (--index < 1) {
                                clearInterval(interval);
                                that.hide();
                            }
                            $time.html(index);
                        }, 1000);
                    }
                });
            }
            setTimeout(function(){
                ssologout();
            },3000)
        }
        if (message && d == null)
        {
            if(!window.localStorage.username ||  window.localStorage.username == null){
                return;
            }else{
                showloginState();
            }
        }else {
            ssoLogin();
        }
    }
    function getapprovenum(){
        $.ajax({
            type: "GET",
            url: "api?command=approvenum&response=json",
            async: false,
            dataType: "json",
            success: function(e) {
                if(e.num && e.num > 0){
                    $('.badge')[0].style.display = "block";
                    $('.badge')[0].innerHTML = e.num;
                }else{
                    $('.badge')[0].style.display = "none";
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);

            }
        });
    }
    function ssoLogin() {
        var recordurl = window.location.href.replace(/(.*)\?(.*)/,"$1");
        recordurl = recordurl.replace(/(.*)\#(.*)/,"$1");
        console.log("recordurl:"+recordurl);
        $.ajax({
            type: "GET",
            url: "api?command=getSSOpara&response=json",
            async: false,
            dataType: "json",
            success: function(e) {
                e && 0 === e.err_no && e.data;
                cloud.LOGIN_URL = e.data.LOGIN_URL;
                cloud.TOKEN_URL = e.data.TOKEN_URL;
                cloud.CLIENT_ID = e.data.CLIENT_ID;
                window.localStorage.clientid = e.data.CLIENT_ID;
                cloud.CLIENT_SECRET = e.data.CLIENT_SECRET;
                cloud.REDIRECT_URI = recordurl;
                cloud.GRANT_TYPE = e.data.GRANT_TYPE;
                cloud.RESPONSE_TYPE = e.data.RESPONSE_TYPE;
                cloud.CODE = e.data.CODE;
                cloud.hostip = e.data.hostip;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);

            }
        });

        var g = (window.localStorage.lang == "zh") ? "zh_cn" : "en-us";
        var state = Math.round(Math.random(0) * 1000) + 1;
        var h = cloud.LOGIN_URL + "?client_id=" + cloud.CLIENT_ID + "&redirect_uri=" + cloud.REDIRECT_URI + "&response_type=code&state=" + state;
        if(d == null ){
            location.href = h;
        }else{
            $.ajax({
                type: "GET",
                data: "command=login&loginurl=" + cloud.LOGIN_URL + "&tokenurl=" + cloud.TOKEN_URL + "&redirecturi=" + cloud.REDIRECT_URI + "&clientid=" + cloud.CLIENT_ID + "&clientsecret=" + cloud.CLIENT_SECRET +"&granttype="+cloud.GRANT_TYPE+"&langtype=" + g + "&code=" + d + "&response=json",
                url: cloud.hostip,
                async: false,
                dataType: "json",
                success: function (k) {
                    if (k && k.loginresponse) {
                        data = k.loginresponse;
                        writeObj(data);
                        window.localStorage.password = data.password;
                        window.localStorage.domain = data.domain;
                        window.localStorage.login = true;
                        window.localStorage.account = data.account;
                        window.localStorage.accounttype = data.type;
                        window.localStorage.username = data.username;
                        window.localStorage.userid = data.userid;
                        window.localStorage.domainid = data.domainid;
                        window.localStorage.zoneid = data.zoneid;
                        window.localStorage.timezone = data.timezone;
                        window.localStorage.registered = data.registered;
                        window.localStorage.phone = data.phone;
                        window.localStorage.userdetail = data.userdetail;
                        window.localStorage.hconfig = data.hconfig || "";
                        window.localStorage.sessionkey = encodeURIComponent(data.sessionkey);
                        if(data.userdetail){
                            window.location.href = "suppleinfo.html";
                        }else{
                            window.location.href =cloud.REDIRECT_URI;
                        }

                    } else {
                        window.location.href ="error50x.html"
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);
                    window.location.href ="error50x.html"
                }
            });
        }
    }
    function ssologout(){
        $.ajax({
            url:"/api?command=loginout",
            type:"get",
            async:true,
            dataType:"json",
            success:function(data){
                console.log("OK");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);
            }
        });
        var url="http://udn.yonyou.com/sso/admin.php/Home/Public/logout?ajax=true&callbak=?";
        var recordurl = window.location.href.replace(/(.*)\?(.*)/,"$1");
        $.ajax({
            url:url,
            type:"get",
            async:true,
            dataType:"jsonp",
            success:function(data){
                window.localStorage.clear();
                window.sessionStorage.clear();
                if(window.location.href.match(/rechargetoaccount|errorinfo/)){
                    window.location.href = recordurl;
                }else{
                    window.location.reload();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);
            }
        });
    }
    function ssoreg(){
        window.location.href = "http://udn.yyuap.com/member.php?mod=register&redirecturi=http://cloud.yyuap.com";
    }
    function keeplogin (){
        $.ajax({
            url:"/api?command=keepalive&session="+window.localStorage.sessionkey,
            type:"get",
            async:true,
            dataType:"text",
            success:function(data){
                if(data == "success"){
                    $('.balance-num .balance_able')[0].innerHTML = 0;
                    $('.balance-num .balance_uday')[0].innerHTML = 0;
                    $('.someuse')[0].style.display ="block";
                    $('.noneuse')[0].style.display ="none";
                    afertlogin();
                }else{
                    ssologout();
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);
                ssologout();
            }
        });
    }
    function getaccountpay(){
        $.ajax({
            url:"/api?command=listEvents&sessionkey="+window.localStorage.sessionkey+"&response=json&type=ACCOUNT.PAY&account="+window.localStorage.account,
            type:"get",
            async:true,
            dataType:"text",
            success:function(data){
                if( data != "success") {
                    console.log(data);
                    ssologout();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);
            }
        });
    }

    function afertlogin() {
        $("#loginTag")[0].style.display = "block";
        $("#logoutTag")[0].style.display = "none";
        $("#nameSpan")[0].innerHTML = window.localStorage.username;
        if(window.localStorage.accounttype && window.localStorage.accounttype != 0 ){
            $('#appTag')[0].style.display = "block";
            getapprovenum();
            $('#app_btn').attr("href","/admin/"+window.localStorage.sessionkey+"/index");

        }
        if (window.localStorage.getItem("sessionkey") != null) {
            getaccountpay();
            setInterval(function () {
                getaccountpay()
            }, 1000 * 60 * 10)
        }
    }
    function showloginState(){
        if(window.localStorage.accounttype == 1){
            keeplogin();
        }else{
            $.ajax({
                type: "GET",
                url: "api?command=getaccountbalance&response=json&sessionkey="+window.localStorage.sessionkey,
                async: true,
                dataType: "json",
                success: function (data, textStatus) {
                    if(data.errorcode == null) {
                        $('.balance-num .balance_able')[0].innerHTML = data.accountbalance.balance;
                        if(data.accountbalance.dayConsume == 0){
                            $('.someuse')[0].style.display ="none";
                            $('.noneuse')[0].style.display ="block";
                        }else{
                            $('.balance-num .balance_uday')[0].innerHTML = parseInt( data.accountbalance.balance*1000/data.accountbalance.dayConsume*1000 );
                        }
                        afertlogin();
                    }else{
                        console.log("blance select error");
                        ssologout();
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);
                    ssologout();
                }
            });
        }

    }
    var button_toggle = true;
    $(".account_info").hover(function () {
        button_toggle = false;
        $(".dropdown-menu-show")[0].style.display = "block";
    }, function () {
        button_toggle = true;
        hideRightTip();
    });
    $(".dropdown-menu").hover(function () {
        button_toggle = false;
        $(".dropdown-menu-show")[0].style.display = "block";
    }, function () {
        button_toggle = true;
        hideRightTip();
    });
    function hideRightTip() {
        setTimeout(function () {
            if (button_toggle) $(".dropdown-menu-show")[0].style.display = "none";
        }, 500);
    }
    $('.user_detail').hover(function(){
        $(".txt-tip")[0].style.display = "block";
    },function(){
        $(".txt-tip")[0].style.display = "none";
    });

});
function chargecon(){
    if( window.localStorage.username && window.localStorage.username != null){
        if(window.localStorage.userdetail && window.localStorage.userdetail == 1){
            window.location.href = "suppleinfo.html?redirecturi=http://123.103.9.193:7024/index.html?code=udn";
        }else{
            window.location.href="http://123.103.9.193:7024/index.html?code=udn";
        }
        //window.open("http://cloudmgt.yyuap.com:8080/index.html?code=udn");

    }else{
        console.log("need login");
        $('#login_btn').trigger("click",0);
    }
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
function writeObj(obj){
    var description = "";
    for(var i in obj){
        var property=obj[i];
        description+=i+" = "+property+"\n";
    }
    console.log(description);
}

