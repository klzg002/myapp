/**
 * Created by Administrator on 2015/12/3.
 */
/**
 * 初始化全局方法
 * @author YJ
 * @require jQuery 1.7+
 */

$(document).ready(function() {

    /**
        *************************************************

    **/
    //var ani_flag = true;
    //$(".r-button3").on("click", function() {
    //    if(ani_flag){
    //        ani_flag = false;
    //        $("#partner-container").animate({marginLeft : "-880px"}, 'slow','swing',function(){ani_flag = true;});
    //    }
    //});
    //$(".l-button3").on("click", function() {
    //    if(ani_flag){
    //        ani_flag = false;
    //        $("#partner-container").animate({marginLeft : "15px"}, 'slow','swing',function(){ani_flag = true;});
    //    }
    //});
    $("#tech-icon li").on("mouseenter",function(){
        var $icon_list=$("#tech-icon li");
        var $detail_list=$(".tech-detail");
        var index=$icon_list.index($(this));
        $("#tech-icon li").removeClass("active");
        $("#tech-icon li").find("b").removeClass("active");
        $(this).find("b").addClass("active");
        $(this).addClass("active");
        $detail_list.removeClass("active");
        $detail_list.find(".t-title,.font-normal").fadeOut(200);
        $detail_list.eq(index).find("img").css("margin-top","240px");
        $detail_list.eq(index).addClass("active").find(".t-title").fadeIn(200).addClass("active");//addClass("active");
        $detail_list.eq(index).find("img").show().animate({opacity:"1",marginTop:"0px"},1000);
        setTimeout(function(){},1000);
        $detail_list.eq(index).find(".font-normal").fadeIn(1500);
    });

    //鼠标移动改变背景图片
    $(".section ul li .rsp").hide();
    $(".section ul li").hover(function(){
        $(this).find(".rsp").stop().fadeTo(500,0.5)
        $(this).find(".text").stop().animate({left:'0'}, {duration: 500})
    },function(){
        $(this).find(".rsp").stop().fadeTo(500,0)
        $(this).find(".text").stop().animate({left:'370'}, {duration: 500})
        $(this).find(".text").animate({left:'-370'}, {duration: 0})
    });
});









