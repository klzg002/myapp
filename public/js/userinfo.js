/**
 * Created by Administrator on 2015/12/8.
 */



$(document).ready(function(){

    var userdata = {
        username: window.localStorage.username,
        account: window.localStorage.account,
        userid: window.localStorage.userid,
    };

    $.ajax({
        url:"/api?command=getuserinfo&account="+userdata.account+"&response=json",
        type:"get",
        async:false,
        dataType:"json",
        success:function(data){
            writeObj(data.info);
            if(data.ret >= 0){
                userdata.phone = data.info.phone;
                userdata.copyright = data.info.copyright;
            }else{
                writeObj(data.ret);
                window.location.href = "suppleinfo.html";
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);
            status_flag = 3;
            showdialog(status_flag,"服务器内部错误");
        }
    });

    var Info = {
        el: $('html'),
        errorcode: {
            Necessarycode: "请填写必要字段",
            Legitimatecode: "请输入合法手机号",
        },
        initialize: function () {
            $('.lginput.req').val(userdata.username);
            $('.lginput.req')[0].disabled = true;
            $('.lginput.email').val(userdata.account);
            $('.lginput.email')[0].disabled = true;
            $('.lginput.phone').val(userdata.phone);
            $('.lginput.copyright').val(userdata.copyright);
        },
    };
    Info.initialize();

    var status_flag;
    $('.lginput.phone').bind('keypress', function () {
        number();
    }).bind('keyup', function () {
        filterInput();
    }).bind('change', function () {
        var Mobile= this.value;
        if(Mobile == ""){
            status_flag = 1;
        }else if (!isMobil(Mobile)) {
            status_flag = 2;
        }else{
            status_flag = 0;
        }
        showdialog(status_flag);
    });
    $('.lginput.copyright').bind('change', function () {
        var copyright= this.value;
        if(!status_flag){
            if(copyright == ""){
                status_flag = 1;
            }else{
                status_flag = 0;
            }
        }
        showdialog(status_flag);
    });

    function showdialog(status_flag,data){
        switch (status_flag){
            case 1:
                $('.alert-error')[0].style.display = "block";
                $('.alert-error').text(Info.errorcode.Necessarycode);
                return
            case 2:
                $('.alert-error')[0].style.display = "block";
                $('.alert-error').text(Info.errorcode.Legitimatecode);
                return
            case 3:
                $('.alert-error')[0].style.display = "block";
                $('.alert-error').text(data);
                return
            default:
                $('.alert-error')[0].style.display = "none";
                return
        }
    }


    $('#registerBtn').bind('click',function(){
        if( !(!status_flag && $('.lginput.copyright')[0].value && $('.lginput.phone')[0].value)){
            if(!status_flag){
                status_flag = 1;
            }
            showdialog(status_flag);
        }else {
            $.ajax({
                url: "/api?command=moduserinfo&phone=" + $('.lginput.phone')[0].value + "&copyright=" + $('.lginput.copyright')[0].value + "&userid=" + userdata.userid + "&account=" + userdata.account + "&response=json",
                type: "post",
                async: false,
                dataType: "text",
                success: function (data) {
                    console.log(data);
                    if (data == "success") {
                        //window.location.reload();
                        status_flag = 3;
                        showdialog(status_flag, "修改成功");
                    } else {
                        status_flag = 3;
                        showdialog(status_flag, data);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);
                    status_flag = 3;
                    showdialog(status_flag, "服务器内部错误");
                }
            });
        }
    });


    function isMobil(s)
    {
        var patrn = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
        if (!patrn.exec(s)){
            return false;
        }
        return true;
    }
    function number() {
        var char = String.fromCharCode(event.keyCode);
        var re = /[0-9]/g;
        event.returnValue = char.match(re) != null ? true : false
    }
    function filterInput() {
        event.srcElement.value = event.srcElement.value.replace(/[^0-9]/g, "");

    }
});



