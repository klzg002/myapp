$(document).ready(function () {

    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase(),
    };

    var ismobile = browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.iPhone || browser.versions.iPad ? true : false;
    var source_cpu = 0.04;
    var source_mem = 0.06;
    var source_vol = 0.001;
    initPrice();
    var base_cpu = 28.8;
    var base_mem = 43.2;
    var base_vol = 0.72;
    var base_price = 50;
    inits1Price();
    $(".images .image-item").bind("click", function () {
        $('.images .image-item.selected').removeClass('selected');
        $(this).addClass('selected');
        initPrice();

    });
    $(".cpu-memory .cpu-item").bind("click", function () {
        $(".cpu-memory .cpu-item.selected").removeClass('selected');
        $(this).addClass('selected');
        chargeDismem();
        initPrice();

    });
    $(".memory .memory-item").bind("click", function () {
        if ($(this).hasClass('disable')) {
            return false
        }
        $(".memory .memory-item.selected").removeClass('selected');
        $(this).addClass('selected');
        initPrice();
    });
    $(".volumes .volume-item").bind("click", function () {
        if ($(this).hasClass('disable')) {
            return false
        }
        $(".volumes .volume-item.selected").removeClass('selected');
        $(this).addClass('selected');
        initPrice();
    });
    function initPrice() {
        modhostPrice();
        modvolPrice();
        modtotalPrice();
    }

    function chargeDismem(type) {
        var prfix = arguments.length == 1 ? 's1-' : '';
        var selectedcpu = $("." + prfix + "cpu-memory .cpu-item.selected").find('a')[0].innerText.match(/(\d+)/)[0];
        $("." + prfix + "memory .memory-item").each(function () {
            $(this).removeClass('disable');
            $(this).removeClass('selected');
            switch (selectedcpu) {
                case "1":
                    if ($(this).find('a')[0].innerText.match(/(\d+)/)[0] > 4) {
                        $(this).addClass('disable');
                    }
                    if ($(this).find('a')[0].innerText.match(/(\d+)/)[0] == 1) {
                        $(this).addClass('selected');
                    }
                    return;
                case "2":
                    if ($(this).find('a')[0].innerText.match(/(\d+)/)[0] > 8) {
                        $(this).addClass('disable');
                    }
                    if ($(this).find('a')[0].innerText.match(/(\d+)/)[0] == 1) {
                        $(this).addClass('selected');
                    }
                    return;
                case "4":
                    if ($(this).find('a')[0].innerText.match(/(\d+)/)[0] < 2 || $(this).find('a')[0].innerText.match(/(\d+)/)[0] > 16) {
                        $(this).addClass('disable');
                    }
                    if ($(this).find('a')[0].innerText.match(/(\d+)/)[0] == 2) {
                        $(this).addClass('selected');
                    }
                    return;
                case "8":
                    if ($(this).find('a')[0].innerText.match(/(\d+)/)[0] < 4 || $(this).find('a')[0].innerText.match(/(\d+)/)[0] > 32) {
                        $(this).addClass('disable');
                    }
                    if ($(this).find('a')[0].innerText.match(/(\d+)/)[0] == 4) {
                        $(this).addClass('selected');
                    }
                    return;
                case "16":
                    if ($(this).find('a')[0].innerText.match(/(\d+)/)[0] < 12 || $(this).find('a')[0].innerText.match(/(\d+)/)[0] > 32) {
                        $(this).addClass('disable');
                    }
                    if ($(this).find('a')[0].innerText.match(/(\d+)/)[0] == 12) {
                        $(this).addClass('selected');
                    }
                    return;
                default:
                    if ($(this).find('a')[0].innerText.match(/(\d+)/)[0] > 4) {
                        $(this).addClass('disable');
                    }
                    if ($(this).find('a')[0].innerText.match(/(\d+)/)[0] == 1) {
                        $(this).addClass('selected');
                    }
            }
        });
    }

    function modhostPrice() {
        var mprice;
        if ($('.images .image-item.selected').find('a')[0].innerText == 'Windows') {
            var cpunum = $(".cpu-memory .cpu-item.selected").find('a')[0].innerText.match(/(\d+)/)[0];
            var memnum = $(".memory .memory-item.selected").find('a')[0].innerText.match(/(\d+)/)[0];
            if ($(".memory .memory-item.selected").hasClass('disable')) {
                memnum = 0
            }
            var hprice = source_cpu * cpunum + source_mem * memnum;
            $('.price.host .price-number')[0].innerText = hprice.toFixed(2);
            mprice = hprice * 24 * 30;
            $('.price.host .none')[0].innerText = "（≈ ¥ " + mprice.toFixed(2) + " / 月）";
            $(".sum_instance .res_price .number")[0].innerText = (mprice * ($('.sum_instance .res_num').val())).toFixed(2);
        } else {
            var cpunum = $(".cpu-memory .cpu-item.selected").find('a')[0].innerText.match(/(\d+)/)[0];
            var memnum = $(".memory .memory-item.selected").find('a')[0].innerText.match(/(\d+)/)[0];
            if ($(".memory .memory-item.selected").hasClass('disable')) {
                memnum = 0
            }
            var hprice = source_cpu * cpunum + source_mem * memnum;
            $('.price.host .price-number')[0].innerText = hprice.toFixed(2);
            mprice = hprice * 24 * 30;
            $('.price.host .none')[0].innerText = "（≈ ¥ " + mprice.toFixed(2) + " / 月）";
            $(".sum_instance .res_price .number")[0].innerText = (mprice * ($('.sum_instance .res_num').val())).toFixed(2);
        }
    }

    function modvolPrice() {
        // source_vol = 0.002;
        // var volnum = $('#title')[0].innerText.match(/(\d+)/)[0];
        var volnum = $('#title').val();
        var hprice = volnum * source_vol;
        $('.price.vol .price-number')[0].innerText = hprice.toFixed(2);
        var mprice = hprice * 24 * 30;
        $('.price.vol .none')[0].innerText = "（≈ ¥ " + mprice.toFixed(2) + " / 月）";
        if (volnum > 0 && $('.sum_volume .res_num').val() == 0) {
            $('.sum_volume .res_num').val(1);
        }
        $(".sum_volume .res_price .number")[0].innerText = (mprice * (parseInt($('.sum_volume .res_num').val()))).toFixed(2);
    }

    function modtotalPrice() {
        var instance_price = $(".sum_instance .res_price .number")[0].innerText.match(/(\d+)/)[0];
        var volume_price = $(".sum_volume .res_price .number")[0].innerText.match(/(\d+)/)[0];
        var total_price = parseInt(volume_price) + parseInt(instance_price);
        $('.total .number')[0].innerText = total_price.toFixed(2);
    }

    //控制购买数量
    $(".sum_instance .res_count .minus").bind("click", function () {
        var n = $('.sum_instance .res_num').val();
        var num = parseInt(n) - 1;
        if (num <= 1) {
            num = 1
        }
        $(".sum_instance .res_num").val(num);

        initPrice();
    });
    $(".sum_instance .res_count .plus").bind("click", function () {
        var n = $('.sum_instance .res_num').val();
        var num = parseInt(n) + 1;
        if (num > 99) {
            num = 99
        }
        $(".sum_instance .res_num").val(num);
        initPrice();
    });
    $(".sum_volume .res_count .minus").bind("click", function () {
        var n = $('.sum_volume .res_num').val();
        var num = parseInt(n) - 1;
        if (num < 0) {
            num = 0
        }
        $(".sum_volume .res_num").val(num);
        initPrice();

    });
    $(".sum_volume .res_count .plus").bind("click", function () {
        var n = $('.sum_volume .res_num').val();
        var num = parseInt(n) + 1;
        if (num > 99) {
            num = 99
        }
        $(".sum_volume .res_num").val(num);
        initPrice();
    });

    //滑块修改价格
    scale = function (btn, bar, title, prop) {
        this.btn = document.getElementById(btn);
        this.bar = document.getElementById(bar);
        this.title = document.getElementById(title);
        this.prop = document.getElementById(prop);
        this.step = this.bar.getElementsByTagName("DIV")[0];
        this.init();

    };
    scale.prototype = {
        init: function () {
            var f = this, g = document, b = window, m = Math;
            if (ismobile) {
                f.btn.ontouchstart = function (e) {
                    var x = (e || b.event).clientX;
                    f.stopDefault(e);
                    var l = this.offsetLeft;
                    var max = f.bar.offsetWidth - this.offsetWidth;
                    g.ontouchmove = function (e) {
                        var thisX = (e || b.event).clientX;
                        var to = m.min(max, m.max(-2, l + (thisX - x)));
                        f.btn.style.left = to + 'px';
                        f.ondrag(m.round(m.max(0, to / max) * 100), to);
                        b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
                    };
                    g.ontouchend = new Function('this.ontouchmove=null');
                };
            } else {
                f.btn.onmousedown = function (e) {
                    var x = (e || b.event).clientX;
                    var l = this.offsetLeft;
                    var max = f.bar.offsetWidth - this.offsetWidth;
                    g.onmousemove = function (e) {
                        var thisX = (e || b.event).clientX;
                        var to = m.min(max, m.max(-2, l + (thisX - x)));
                        f.btn.style.left = to + 'px';
                        f.ondrag(m.round(m.max(0, to / max) * 100), to);
                        b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
                    };
                    g.onmouseup = new Function('this.onmousemove=null');
                };
            }


            f.title.onkeypress = function () {
                number();
            };
            f.title.onkeyup = function () {
                filterInput();
            };
            f.title.onblur = function () {

                this.value = this.value.replace(/^0+(\d+)/, "$1");
                var m = parseInt(this.value);
                if (isNaN(m)) {
                    m = 0;
                    this.value = m;
                } else if (m > 5000) {
                    m = 5000;
                    this.value = m;
                }
                f.onvaluedrag(m);
                if (f.btn.id == 'btn') {
                    initPrice();
                } else if (f.btn.id == 's1-btn') {
                    inits1Price();
                }
            };
            f.title.onbeforepaste = function () {
                filterPaste();
                var m = parseInt(this.value);
                if (isNaN(m)) {
                    m = 0;
                    this.value = m;
                } else if (m > 5000) {
                    m = 5000;
                    this.value = m;
                }
                f.onvaluedrag(m);
                if (f.btn.id == 'btn') {
                    initPrice();
                } else if (f.btn.id == 's1-btn') {
                    inits1Price();
                }
            };

        },

        ondrag: function (pos, x) {
            var value = this.prop.innerText.match(/(\d+)/)[0];
            this.step.style.width = Math.max(0, x) + 'px';
            var selectnum = pos / 100 * value;
            this.title.value = selectnum.toFixed(0);
            +'';
            if (this.btn.id == 'btn') {
                initPrice();
            } else if (this.btn.id == 's1-btn') {
                inits1Price();
            }
        },
        onvaluedrag: function (value) {
            var max = this.bar.offsetWidth - this.btn.offsetWidth;
            var to = value / 5000 * max;
            this.step.style.width = Math.max(0, to) + 'px';
            this.btn.style.left = to + 'px';

        },
        stopDefault: function (e) {
            var e = e || window.event;
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        }
    };
    new scale('btn', 'bar', 'title', 'prop');
    new scale('s1-btn', 's1-bar', 's1-title', 's1-prop');

    //按照服务所在位置修改价格
    $('.locale-switcher').bind("click", function () {
        var X = $(this).attr('id');
        if (X == 1) {
            $(".zone-switcher-select").hide();
            $(this).attr('id', '0');
        } else {
            $(".zone-switcher-select").show();
            $(this).attr('id', '1');
        }
    });

    $(".locale-switcher").mouseup(function () {
        return false
    });
    $(".zone-switcher-select").mouseup(function () {
        return false
    });
    $(document).mouseup(function () {
        $(".zone-switcher-select").hide();
        $(".locale-switcher").attr('id', '');
    });
    $('.zone-switcher-select li a').bind("click", function () {
        var areaname;
        if ($(this).attr("data-value") == 'pek2') {
            areaname = $('.zone-switcher-select .area.bj')[0].innerText;
            source_cpu = 0.04;
            source_mem = 0.06;
            source_vol = 0.001;
        } else if ($(this).attr("data-value") == 'gd1') {
            areaname = $('.zone-switcher-select .area.bjlt')[0].innerText;
            source_cpu = 0.4;
            source_mem = 0.6;
            source_vol = 0.01;
        } else if ($(this).attr("data-value") == 'ap1') {
            areaname = $('.zone-switcher-select .area.bjlt1')[0].innerText;
            source_cpu = 4;
            source_mem = 6;
            source_vol = 1;
        }
        initPrice();
        $('#selected_area')[0].innerText = areaname;
    });
    $('.zone-switcher-select li a').mouseup(function () {
        return false
    });


    //包年包月

    $('.s1-locale-switcher').bind("click", function () {
        var X = $(this).attr('id');
        if (X == 3) {
            $(".s1-zone-switcher-select").hide();
            $(this).attr('id', '2');
        } else {
            $(".s1-zone-switcher-select").show();
            $(this).attr('id', '3');
        }
    });
    $(".s1-locale-switcher").mouseup(function () {
        return false
    });
    $(".s1-zone-switcher-select").mouseup(function () {
        return false
    });
    $(document).mouseup(function () {
        $(".s1-zone-switcher-select").hide();
        $(".s1-locale-switcher").attr('id', '2');
    });
    $('.s1-zone-switcher-select li a').bind("click", function () {
        var areaname;
        if ($(this).attr("data-value") == 'pek2') {
            areaname = $('.s1-zone-switcher-select .area.bj')[0].innerText;
            base_cpu = 28.8;
            base_mem = 43.2;
            base_vol = 0.72;

        } else if ($(this).attr("data-value") == 'gd1') {
            areaname = $('.s1-zone-switcher-select .area.bjlt')[0].innerText;
            base_cpu = 2.88;
            base_mem = 4.32;
            base_vol = 0.072;

        } else if ($(this).attr("data-value") == 'ap1') {
            areaname = $('.s1-zone-switcher-select .area.bjlt1')[0].innerText;
            base_cpu = 0.288;
            base_mem = 0.432;
            base_vol = 0.0072;

        }
        inits1Price();
        $('#s1-selected_area')[0].innerText = areaname;
    });
    $('.s1-zone-switcher-select li a').mouseup(function () {
        return false
    });


    // cals1price();
    $(".s1-images .image-item").bind("click", function () {
        $('.s1-images .image-item.selected').removeClass('selected');
        $(this).addClass('selected');
        inits1Price();
    });
    $(".s1-cpu-memory .cpu-item").bind("click", function () {
        $(".s1-cpu-memory .cpu-item.selected").removeClass('selected');
        $(this).addClass('selected');
        chargeDismem('s1');
        inits1Price();
    });
    $(".s1-memory .memory-item").bind("click", function () {
        if ($(this).hasClass('disable')) {
            return false
        }
        $(".s1-memory .memory-item.selected").removeClass('selected');
        $(this).addClass('selected');
        inits1Price();
    });
    $(".s1-volumes .volume-item").bind("click", function () {
        $(".s1-volumes .volume-item.selected").removeClass('selected');
        $(this).addClass('selected');
        inits1Price();
    });

    $(".s1-sum_instance .res_count .minus").bind("click", function () {
        var n = $('.s1-sum_instance .res_num').val();
        var num = parseInt(n) - 1;
        if (num <= 0) {
            num = 0
        }
        $(".s1-sum_instance .res_num").val(num);
        $(".s1-sum_instance .res_price .number")[0].innerText = num.toFixed(2);
        inits1Price();
    });
    $(".s1-sum_instance .res_count .plus").bind("click", function () {
        var n = $('.s1-sum_instance .res_num').val();
        var num = parseInt(n) + 1;
        if (num > 99) {
            num = 99
        }
        $(".s1-sum_instance .res_num").val(num);
        $(".s1-sum_instance .res_price .number")[0].innerText = num.toFixed(2);
        inits1Price();
    });


    function inits1Price() {
        var hprice, cpunum, memnum;
        if ($('.s1-images .image-item.selected').find('a')[0].innerText != 'Windows') {
            cpunum = $(".s1-cpu-memory .cpu-item.selected").find('a')[0].innerText.match(/(\d+)/)[0];
            memnum = $(".s1-memory .memory-item.selected").find('a')[0].innerText.match(/(\d+)/)[0];
            if ($(".s1-memory .memory-item.selected").hasClass('disable')) {
                memnum = 0
            }
            hprice = base_cpu * cpunum + base_cpu * memnum;
        } else {
            cpunum = $(".s1-cpu-memory .cpu-item.selected").find('a')[0].innerText.match(/(\d+)/)[0];
            memnum = $(".s1-memory .memory-item.selected").find('a')[0].innerText.match(/(\d+)/)[0];
            if ($(".s1-memory .memory-item.selected").hasClass('disable')) {
                memnum = 0
            }
            hprice = base_cpu * cpunum + base_mem * memnum;
        }

        // var volnum = $('#s1-title')[0].innerText.match(/(\d+)/)[0];
        var volnum = $('#s1-title').val();
        var vprice = volnum * base_vol;

        var selectnum = $(".s1-sum_instance .res_price .number")[0].innerText.match(/(\d+)/)[0];
        var selecttime, sub_selecttime;
        if ($('.Menubox .hover')[0].innerText == '按月付费') {
            sub_selecttime = $('#con_menu_1 .input').val();
            selecttime = sub_selecttime;
        } else {
            sub_selecttime = $('#con_menu_2 .input').val();
            selecttime = sub_selecttime * 11;
        }

        var total_price = (hprice + vprice) * selectnum * selecttime;
        if (cpunum == 1 && memnum == 1 && selecttime == 1 && volnum == 0) {
            total_price = base_price;
        }
        $('.s1-total .number')[0].innerText = total_price.toFixed(2);
    }

    $('.Contentbox .input').bind('keypress', function () {
        number();
    }).bind('keyup', function () {
        filterInput();
    }).bind('change', function () {
        this.value = this.value.replace(/^0+(\d+)/, "$1");
        var m = parseInt($(this).val());
        if (isNaN(m)) {
            m = 0;
            $(this).val(m);
        }else if (m >= 1000000) {
            m = 1000000;
            $(this).val(m);
        }
        inits1Price();
    }).bind('beforepaste  propertychange', function () {
        filterPaste();
        inits1Price();
    }).bind('paste', function () {
        return false;
    });


    $('.s1-sum_instance .res_num').bind('keypress', function () {
        number();
    }).bind('keyup change', function () {
        filterInput();
        this.value = this.value.replace(/^0+(\d+)/, "$1");
        var m = parseInt($('.s1-sum_instance .res_num').val());
        if (isNaN(m)) {
            m = 0;
            $('.s1-sum_instance .res_num').val(m);
        } else if (m > 99) {
            m = 99;
            $('.s1-sum_instance .res_num').val(m);
        }
        $(".s1-sum_instance .res_price .number")[0].innerText = m.toFixed(2);
        inits1Price();
    }).bind('beforepaste  propertychange', function () {
        filterPaste();
        var m = parseInt($('.s1-sum_instance .res_num').val());
        if (isNaN(m)) {
            m = 0;
            $('.s1-sum_instance .res_num').val(m);
        }
        $(".s1-sum_instance .res_price .number")[0].innerText = m.toFixed(2);
        inits1Price();
    }).bind('paste', function () {
        return false;
    });

    $('.sum_instance .res_num').bind('keypress', function () {
        number();
    }).bind('keyup change', function () {
        filterInput();
        this.value = this.value.replace(/^0+(\d+)/, "$1");
        var m = parseInt($('.sum_instance .res_num').val());
        if (isNaN(m)) {
            m = 0;
            $('.sum_instance .res_num').val(m);
        } else if (m > 99) {
            m = 99;
            $('.sum_instance .res_num').val(m);
        }
        initPrice();
    }).bind('beforepaste  propertychange', function () {
        filterPaste();
        var m = parseInt($('.sum_instance .res_num').val());
        if (isNaN(m)) {
            m = 0;
            $('.sum_instance .res_num').val(m);
        }
        initPrice();
    }).bind('paste', function () {
        return false;
    });
    $('.sum_volume .res_num').bind('keypress', function () {
        number();
    }).bind('keyup change', function () {
        filterInput();
        this.value = this.value.replace(/^0+(\d+)/, "$1");
        var m = parseInt($('.sum_volume .res_num').val());
        if (isNaN(m)) {
            m = 0;
            $('.sum_volume .res_num').val(m);
        } else if (m > 99) {
            m = 99;
            $('.sum_volume .res_num').val(m);
        }
        initPrice();
    }).bind('beforepaste  propertychange', function () {
        filterPaste();
        var m = parseInt($('.sum_volume .res_num').val());
        if (isNaN(m)) {
            m = 0;
            $('.sum_volume .res_num').val(m);
        }
        initPrice();
    }).bind('paste', function () {
        return false;
    });

    function number(price) {
        var char = String.fromCharCode(event.keyCode);
        var re = price ? /[0-9\.]/g: /[0-9]/g;
        event.returnValue = char.match(re) != null ? true : false
    }

    function filterInput() {
        event.srcElement.value = event.srcElement.value.replace(/[^0-9\.]/g, "");

    }

    function filterPaste() {
        var oTR = this.document.selection.createRange();
        var text = window.clipboardData.getData("text");
        oTR.text = text.replace(/[^0-9]/g, "")
    }

    function isMobil(s)
    {
        var patrn = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
        if (!patrn.exec(s)){
            return false;
        }
        return true;
    }

    $('#menu1').bind('click', function () {
        setTab('menu', 1, 2);
        inits1Price();
    });
    $('#menu2').bind('click', function () {
        setTab('menu', 2, 2);
        inits1Price();
    });

    $('#Menu1').bind('click', function () {
        return false;
        setTab('Menu', 1, 2);
    });
    $('#Menu2').bind('click', function () {
        setTab('Menu', 2, 2);
    });
    $('#Menu1').hover(function(){
        $(".price-tip")[0].style.display = "block";
    },function(){
        $(".price-tip")[0].style.display = "none";
    });
    $('#menu_show1').bind('click', function () {
        setTab('menu_show', 1, 2);
    });
    $('#menu_show2').bind('click', function () {
        setTab('menu_show', 2, 2);
    });

    function setTab(name, cursel, n) {
        for (i = 1; i <= n; i++) {
            var menu = document.getElementById(name + i);
            var con = document.getElementById("con_" + name + "_" + i);
            menu.className = i == cursel ? "hover" : "";
            con.style.display = i == cursel ? "block" : "none";
        }
    }
    writeObj = function (obj){
        var description = "";
        for(var i in obj){
            var property=obj[i];
            description+=i+" = "+property+"\n";
        }
        console.log(description);
    }

    //充值购买页面
    Date.prototype.format = function(format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "mi+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }
    var userdata = {
        username : window.localStorage.username,
        account: window.localStorage.account,
        clientid :  window.localStorage.clientid,
        userid  : window.localStorage.userid,
        sessionkey  :   window.localStorage.sessionkey,
    };
    var d = getQueryString("code");
    var s = getQueryString("state");
    var cloud = {};
    $('#payBox').css({
        "left": $(window).width() / 2 - 715 / 2 + 'px',
        "top": $(window).height() / 2 - 616 / 2 + 'px'
    });

    //报年包月支付
    $('#buy_btn').on('click', function () {
        if ($('#logoutTag')[0].style.display === "none") {
            $("body").append("<div id='mask'></div>");
            $("#mask").addClass("mask").fadeIn("slow");
            $("#payBox").fadeIn("slow");
            $('.cashier-header .fr-wrap .text')[0].innerText = userdata.username;
            $('.book-names-wrap .system')[0].innerText = $('.s1-images .image-item.selected').find('a')[0].innerText;
            $('.book-names-wrap .volume')[0].innerText = $('#s1-title').val() + "GB";
            $('.book-names-wrap .system-num')[0].innerText = $(".s1-sum_instance .res_price .number")[0].innerText.match(/(\d+)/)[0] + "台";
            $('.book-names-wrap .system-cpu')[0].innerText = $(".s1-cpu-memory .cpu-item.selected").find('a')[0].innerText;
            $('.book-names-wrap .system-mem')[0].innerText = $(".s1-memory .memory-item.selected").find('a')[0].innerText;
            if ($('.Menubox .hover')[0].innerText == '按月付费') {
                $('.book-names-wrap .pay-time')[0].innerText = $('#con_menu_1 .input').val() + "月";
            } else {
                $('.book-names-wrap .pay-time')[0].innerText = $('#con_menu_2 .input').val() + "年";
            }
            $('.content-wrap-pay .price-wrap .price-num')[0].innerText = $('.s1-total .number')[0].innerText;

            var userid = (userdata.uid+"").length < 4 ? ("00000"+userdata.uid):userdata.uid;

            var d = new Date();
            var paras = {
                clientid :userdata.clientid,
                service : 'cashier',
                orderId : d.format('yyyyMMddhhmiss')+Math.floor(Math.random()*10),
                satrttime : parseInt(d.getTime()/1000,10),
                endtime : parseInt(d.getTime()/1000+900,10),
                payAmount : ($('.s1-total .number')[0].innerText)*100,
                originalAmount:($('.s1-total .number')[0].innerText)*100,
                returnUrl :"",
                notifyUrl:"",
            };
            writeObj(paras);
            function writeObj(obj){
                var description = "";
                for(var i in obj){
                    var property=obj[i];
                    description+=i+" = "+property+"\n";
                }
                console.log(description);
            }
            var sub_url = "customerId="+paras.clientid+"&service="+paras.service+"&orderCreateTime="+paras.satrttime+"&orderExpireTime="+paras.endtime+"&payAmount="+paras.payAmount+"&originalAmount="+paras.originalAmount+"&returnUrl="+paras.returnUrl+"&notifyUrl="+paras.notifyUrl
            var url = "pay.html?"+sub_url;

            $('#cashier-iframe').attr("src",url);
            $('#cashier-iframe').css({
                'border-bottom-width' : '1px',
                'border-bottom-color':  "rgb(214, 214, 214)",
                'border-bottom-style': "solid",
                'height': "432px",
            });
            $('#cashier-iframe').load(function(){
                var sub_iframe =$(window.frames["cashier-iframe"].document);
                var iframe_channel_pay =  sub_iframe.find("div.channel-pay")[0];
                iframe_channel_pay.setAttribute ("data-payamount",paras.payAmount);
                iframe_channel_pay.setAttribute ("data-customerid",paras.clientid);
                iframe_channel_pay.setAttribute ("data-order",sub_url);
            });

        } else  {
            ssoLoginRef();
        }
    });

    $(".dialog-close").on('click', function () {
        $("#payBox").fadeOut("fast");
        $("#mask").css({display: 'none'});
    });
    //充值页面
    $('#rechargeBox').css({
        "left": $(window).width() / 2 - 715 / 2 + 'px',
        "top": $(window).height() / 2 - 616 / 2 + 'px'
    });
    $(".re-dialog-close").on('click', function () {
        $("#rechargeBox").fadeOut("fast");
        $("#mask").css({display: 'none'});
    });
    $('#pay_btn').on('click', function () {
        if ($('#logoutTag')[0].style.display === "none") {

            $("body").append("<div id='mask'></div>");
            $("#mask").addClass("mask").fadeIn("slow");
            $("#rechargeBox").fadeIn("slow");
            $('.re-cashier-header .re-fr-wrap .re-text')[0].innerText = userdata.username;
            $.ajax({
                type: "GET",
                url: "api?command=getaccountbalance&response=json&sessionkey="+userdata.sessionkey,
                async: true,
                dataType: "json",
                success: function (data, textStatus) {
                    if(data) {
                        $('.price-cnt .price-bla')[0].innerHTML = data.accountbalance.balance;
                    }else{
                        console.log("blance select error");
                        $('.price-cnt .price-bla')[0].innerHTML = 0;
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);
                }
            });
            $.ajax({
                type: "GET",
                url: "api?command=getfeebalance&response=json&account="+userdata.account,
                async: true,
                dataType: "json",
                success: function (ret, textStatus) {
                    if(ret) {
                        writeObj(ret);
                        $('.cur-fee')[0].innerHTML = ret.data;
                        if(ret.data < 1000){
                            $("input[name$='invoice_fee']").attr("disabled",true);
                            $("input[name$='invoice_fee']").attr('placeholder',"可开发票金额小于1000")
                        }
                    }else{
                        console.log("fee select error");
                        $('.cur-fee')[0].innerHTML  = 0;
                        $("input[name$='invoice_fee']").attr("disabled",true);
                        $("input[name$='invoice_fee']").attr('placeholder',"获取可开发票信息错误")
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);
                }
            });

            //$('.price-cnt .input').bind('keypress', function () {
            //    number(true);
            //}).bind('keyup ', function () {
            //    filterInput();
            //    var m = parseInt($(this).val());
            //    if (isNaN(m)) {
            //        m = 0;
            //        $(this).val(m);
            //    }
            //}).bind('change', function () {
            //    loadframe();
            //}).bind('beforepaste  propertychange', function () {
            //    filterPaste();
            //}).bind('paste', function () {
            //    return false;
            //});
            //
            //function loadframe() {
            //    var userid = (userdata.userid+"").length < 4 ? ("0000"+userdata.userid):userdata.userid;
            //    var d = new Date();
            //    var paras = {
            //        clientid :userdata.clientid,
            //        service : 'cashier',
            //        orderId : d.format('yyyyMMddhhmiss')+Math.floor(Math.random()*10)+userid,
            //        satrttime : parseInt(d.getTime()/1000,10),
            //        endtime : parseInt(d.getTime()/1000+900,10),
            //        payAmount : ($('.price-cnt .input').val())*100,
            //        originalAmount:($('.price-cnt .input').val())*100,
            //        returnUrl :"",
            //        notifyUrl:"",
            //    };
            //    var sub_url = "customerId=" + paras.clientid + "&service=" + paras.service + "&orderCreateTime=" + paras.satrttime + "&orderExpireTime=" + paras.endtime + "&payAmount=" + paras.payAmount + "&originalAmount=" + paras.originalAmount + "&returnUrl=" + paras.returnUrl + "&notifyUrl=" + paras.notifyUrl
            //    var url = "pay.html?" + sub_url;
            //
            //    $('#re-cashier-iframe').attr("src", url);
            //    $('#re-cashier-iframe').css({
            //        'border-bottom-width': '1px',
            //        'border-bottom-color': "rgb(214, 214, 214)",
            //        'border-bottom-style': "solid",
            //        'height': "432px",
            //    });
            //    $('#re-cashier-iframe').load(function () {
            //        var sub_iframe = $(window.frames["re-cashier-iframe"].document);
            //        var iframe_channel_pay = sub_iframe.find("div.channel-pay")[0];
            //        iframe_channel_pay.setAttribute("data-payamount", paras.payAmount);
            //        iframe_channel_pay.setAttribute("data-customerid", paras.clientid);
            //        iframe_channel_pay.setAttribute("data-order", sub_url);
            //    });
            //}
            //loadframe();
        } else {
            console.log("need login");
            ssoLoginRef();
        }

    });

    var c = getQueryString("command");
    if(c === "rechargetoaccount"){
        $('#Menu2').trigger('click');
        $('#pay_btn').trigger('click');
    }

    function ssoLoginRef() {
        var j = this;
        var recordurl = window.location.href.replace(/(.*)\?(.*)/,"$1");
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
                writeObj(cloud);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);
            }
        });

        var g = (window.localStorage.lang == "zh") ? "zh_cn" : "en-us";
        var state = Math.round(Math.random(0) * 1000) + 1;
        var h = cloud.LOGIN_URL + "?client_id=" + cloud.CLIENT_ID + "&redirect_uri=" + cloud.REDIRECT_URI + "&response_type=code&state=" + state;
        location.href = h;
    }
    function writeObj(obj){
        var description = "";
        for(var i in obj){
            var property=obj[i];
            description+=i+" = "+property+"\n";
        }
        console.log(description);
    }
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    $("input[name$='invoice_fee']").bind('keypress', function () {
        number();
    }).bind('keyup', function () {
        filterInput();
    }).bind('change', function () {
        var feenum = this.value;
        var curfee = parseInt($('.cur-fee')[0].innerHTML.match(/\d+/)[0]);
        if(feenum <= 1000){
            $(this).val(1000);
        }else if (feenum > curfee ){
            $(this).val(curfee);
        }
    });
    $("input[name$='phone']").bind('keypress', function () {
        number();
    }).bind('keyup', function () {
        filterInput();
    }).bind('change', function () {
        var Mobile= this.value;
        if (!isMobil(Mobile)) {
            $(this).val("");
            $(this).attr('placeholder',"请输入合法的手机号码")
        }
    });

    $('#fee_btn').bind('click',function(){
        var inputs_para = ["invoice_fee","title","address","addressee","phone"];
        var flag = 0 ;
        inputs_para.forEach(function(para){
            if(!$("input[name$="+para+"]")[0].value || $("input[name$="+para+"]")[0].value == ""){
                flag = 1;
                if(para != "title")
                    $("input[name$="+para+"]").attr('placeholder',"请输入相关内容")
            }
        })
        if(flag){
            return false;
        }else{
            var postdata = {
                account :userdata.account,
                feenum : $("input[name$='invoice_fee']")[0].value,
                feetype : $("input[name='invoice_type']:checked").val(),
                feehead : $("input[name$='title']")[0].value,
                feeaddress :$("input[name$='address']")[0].value,
                feeuser :$("input[name$='addressee']")[0].value,
                feephone:$("input[name$='phone']")[0].value,
            }
            writeObj(postdata);
            $.ajax({
                type: "POST",
                url: "api?command=postfeeinfo&account="+postdata.account+"&feenum="+postdata.feenum+"&feestatus=N&feetype="+postdata.feetype+"&feehead="+postdata.feehead+"&feeaddress="+postdata.feeaddress+"&feeuser="+postdata.feeuser+"&feephone="+postdata.feephone,
                async: true,
                dataType: "json",
                dataType:"text",
                success:function(data){
                    console.log(data);
                    if(data == "success"){
                        window.location.href = "price.html";
                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("error occur :\n错误代码 " + XMLHttpRequest.status + "\n处理代码 " + XMLHttpRequest.readyState + "\n错误内容 " + textStatus);
                    window.location.href = "errpr50x.html"
                }
            });
        }

    });


});