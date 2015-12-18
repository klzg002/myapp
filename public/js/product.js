window.ucloud = window.ucloud || {};

! function() {
    window.ucloud.util = window.ucloud.util || {};
    var hash = ucloud.util.hash = {
        data: function(name) {
            var hash = location.hash || '';
            var data = "";
            var $div = $('<div/>');
            hash.replace(/([^#&?=]+)/g, function($, $1) {
                $div.text(decodeURIComponent($1));
                data = $div.html();
            });
            return data;
        }
    };
    var curHash = location.hash;

    function checkHashChange(e) {
        if (location.hash != curHash) {
            curHash = location.hash;
            hash.onHashChange && hash.onHashChange();
        }
    }
    if (('onhashchange' in window) && ((typeof document.documentMode === 'undefined') || document.documentMode >= 8)) {
        window.onhashchange = function() {
            hash.onHashChange && hash.onHashChange();
        };
    } else {
        setInterval(checkHashChange, 128);
    }
}();
! function() {
    window.ucloud.product = window.ucloud.product || {};
    var isIE=!!window.ActiveXObject;
    var propstr ;
    if(isIE){
        propstr = "0px";
    }else{
        propstr = "80px";
    }
    var product = ucloud.product;
    var lastItem = '';
    var modPosMap = [];
    $.extend(product, {
        showProduct: function(item, mod) {
            $('#mod_nav div.title.current').removeClass('current');
            $('#mod_nav dd.nav-selected').removeClass('nav-selected');
            $('#mod_nav dd[item=' + item + ']').addClass('nav-selected');
            var tabs = $('div.main-content div.tab-title');
            mod = mod || tabs.find('li:first').attr('mod');
            //tabs.find('li.current').removeClass('current');
            //tabs.find('li[mod=' + mod + ']').addClass('current');
            //if (item != lastItem) {
            //    $('body,html').scrollTop(0);
            //    lastItem = item;
            //}
        },
        bind: function() {
            ucloud.util.hash.onHashChange = function() {
                var hash = ucloud.util.hash.data();
                var item = location.pathname.match('([^\/]+)\.html');
                if (item && item.length > 1) {
                    item = item[1];
                } else {
                    item = 'ECS';
                }
                product.showProduct(item, hash);
            };
            //$(window).scroll(function(e) {
            //    var posTop = $(this).scrollTop();
            //    var tabContainer = $('.tab-title');
            //    var y = modPosMap[0]['y'];
            //    if (posTop > y) {
            //        tabContainer.addClass('tab-title-fixed').css({
            //            width: tabContainer.parent().width(),
            //            top: propstr
            //        });
            //    } else {
            //        tabContainer.removeClass('tab-title-fixed').css({
            //            width: "auto"
            //        });
            //    }
            //    for (var i = 0; i < modPosMap.length; i++) {
            //        if (modPosMap[i]['y'] <= posTop) {
            //            var tabs = $('div.tab-title');
            //            var mod = modPosMap[i]['id'];
            //            tabs.find('li.current').removeClass('current');
            //            tabs.find('li[mod=' + mod + ']').addClass('current');
            //        } else {
            //            break;
            //        }
            //    }
            //});
            //$('div.main-content div.tab-title ul li a').click(function() {
            //    $('.tab-title').addClass('tab-title-fixed')
            //});
        },
        init: function() {
            this.bind();
            ucloud.util.hash.onHashChange();
            calModPosition();
            resetAnchorMargin();
            initVersionList();
        }
    });

    function initVersionList() {
        var containerWidth = 0,
            maskWidth = Math.ceil($('.timeline-mask').width());
        if (!maskWidth) return;
        $('.version-list li.version-item').each(function() {
            var width = Math.ceil($(this).outerWidth()) || 0;
            containerWidth += width;
        });
        $('.version-list').css({
            'width': containerWidth + 'px',
            'right': 0
        });
        if (containerWidth - 100 > maskWidth) {
            bindVersionLeft();
            bindVersionRight();
        }
    }

    function bindVersionRight() {
        $('.mod-timeline .arrow-right').click(function() {
            if ($(this).hasClass('disable')) return;
            var list = $('.version-list'),
                pos = parseInt(list.css('right')) || 0,
                scrollWidth = Math.ceil($('.timeline-mask').width()),
                containerWidth = list.width();
            if (scrollWidth + pos >= 0) {
                list.animate({
                    right: 0
                }, function() {
                    $('.mod-timeline .arrow-right').addClass('disable');
                })
            } else {
                list.animate({
                    right: pos + scrollWidth
                });
            }
            $('.mod-timeline .arrow-left').removeClass('disable');
        });
    }

    function bindVersionLeft() {
        $('.mod-timeline .arrow-left').removeClass('disable').click(function() {
            if ($(this).hasClass('disable')) return;
            var list = $('.version-list'),
                pos = parseInt(list.css('right')) || 0,
                scrollWidth = Math.ceil($('.timeline-mask').width()),
                containerWidth = list.width();
            if (containerWidth + pos - scrollWidth <= scrollWidth) {
                list.animate({
                    right: -(containerWidth - scrollWidth)
                }, function() {
                    $('.mod-timeline .arrow-left').addClass('disable');
                })
            } else {
                list.animate({
                    right: pos - scrollWidth
                }, function() {
                    if (containerWidth + pos - 2 * scrollWidth <= 100) {
                        $('.mod-timeline .arrow-left').addClass('disable');
                    }
                });
            }
            $('.mod-timeline .arrow-right').removeClass('disable');
        });
    }

    function resetAnchorMargin() {
        $('.anchor').css({
            top: '-48px'
        });
    }

    function calModPosition() {
        modPosMap = [];
        var mod = $('.tab-content');
        mod.each(function() {
            var top = parseInt(getModPositionY($(this))) - parseInt($('.tab-title').height());
            modPosMap.push({
                id: $(this).attr('mod'),
                y: top
            });
        });
    }

    function getModPositionY(ele) {
        if (!ele) {
            ele = $('.tab-content:first');
        }
        var toolHeight = parseInt($('.head-tool').height()) || 0;
        var menuHeight = parseInt($('.head-menu').height()) || 0;
        var y = toolHeight + menuHeight;
        var tabContainer = $('.tab-title');
        if (!tabContainer.hasClass('tab-title-fixed')) {
            y -= parseInt(tabContainer.height()) || 0;
        }
        y += ele.position().top || 0;
        return y;
    }
}();
ucloud.product.init(); /*  */
