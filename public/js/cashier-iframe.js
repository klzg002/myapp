/**
 * Created by Administrator on 2015/10/29.
 */

;(function(e,t){
    "use strict";
    var n = channelMap[CashierOption.lastChannel];
    if(n){
        var r= e(".ca-tabs li[data-target="+n+"]");
        r.length > 0 && !r.hasClass("disabled")&&(CashierOption.lastChannel = n);
        t.bindEvent();

    }

    window.CashierPay = function () {
        this.payField = CashierOption.payField, this.messenger = new r("lbscashierMsgIframe"), this.messenger.addTarget(window.parent, "lbscashierMsgParent")
    }, CashierPay.fn = CashierPay.prototype = {
        init: function () {
            var t = e.Deferred(), r = this, a = CashierOption.disabledChannel;
            return e("#lbscashier-iframe").removeClass("hidden"), e(".cashier-wrapper>.loading").fadeOut("fast"), this.initPromise = n.initPayChannel(), this.initPromise.done(function () {
                r.resize();
                var i = parseInt(e(".channel-pay").data("payamount") || 0, 10);
                n.updatePayChannel(i, a, "init"), r.messenger.send("init", "success"), t.resolve()
            }), t
        }, resize: function () {
            var t = Math.max(e("#lbscashier-iframe").height(), 340), n = parseInt(document.body.style.height);
            t > n ? (this.messenger.send("resize", {height: t + 50}), setTimeout(function () {
                document.body.style.height = t + "px"
            }, 300)) : (document.body.style.height = t + "px", this.messenger.send("resize", {height: t + 50}))
        }, updateOrderInfo: function (r) {
            var a = parseInt(i(r, "payAmount") || 0, 10), s = i(r, "feData"), o = CashierOption.disabledChannel;
            if (s)try {
                s = t.parse(s), o = s && s.disabledChannel, CashierOption.disabledChannel = o
            } catch (c) {
            }
            r = r.replace(/(&feData=).*&$|(&feData=).*/g, ""), isNaN(a) && (a = 0), e(".channel-pay").data("order", r), e(".channel-pay").data("payamount", a), n.updatePayChannel(a, o)
        }, listenMessage: function () {
            var n = this;
            this.messenger.listen(function (r) {
                var a = r.data || "";
                if (r && r.type)if ("updateOrder" === r.type)n.updateOrderInfo(a), n.resize(), n.messenger.send("updateOrder", "success"); else if ("init" === r.type) {
                    if ("string" == typeof r.data) {
                        var i = t.parse(r.data);
                        "object" == typeof i && (e.extend(CashierOption, i), CashierOption.asycSubmit && 0 !== parseInt(CashierOption.asycSubmit, 10) && "false" !== CashierOption.asycSubmit.toLowerCase && (CashierOption.asycSubmit = 1), CashierOption.samePage = parseInt(CashierOption.samePage, 10))
                    }
                    n.init()
                }
            })
        }, bindEvent: function () {
            var t = this;
            t.listenMessage(), e(".channel-pay").on("resize", function () {
                t.resize()
            }).on("pay", function (e, n) {
                t.messenger.send("pay", n)
            }).on("changeTab", function (e, n) {
                t.messenger.send("changeTab", n)
            }), e(".channel-pay").delegate(".fn-submit-btn, #all-bind-card", "click", function (t) {
                if (t.preventDefault(), e(this).hasClass("disabled") || e(this).parent().hasClass("ca-group-loading"))return !1;
                var r = e(this), i = a.MSGCode.pay[101], s = r.attr("id"), o = CashierOption.asycSubmit, c = CashierOption.payCheckUrl;
                "all-bind-card" == s && (i = a.MSGCode.pay[100]), 1 === o && c ? (i = a.MSGCode.pay[103], n.applyOrder({
                    payCheckUrl: c,
                    actionType: i
                })) : e(".fn-submit-btn:visible").hasClass("btn-disable") || n.applyOrder({actionType: i})
            })
        }, bfbActivity: function () {
        }
    }, new CashierPay
})(jQuery,window);





