/**
 * 判断终端数据 或 浏览器语言
 */

const browser = {
    versions: (function() {
        const u = navigator.userAgent;
        let sys = {};
        const judge = {
            trident: () => {
                sys.trident = u.indexOf("Trident") > -1;
            }, //IE内核
            presto: () => {
                sys.presto = u.indexOf("Presto") > -1;
            }, //opera内核
            webKit: () => {
                sys.webKit = u.indexOf("AppleWebKit") > -1;
            }, //苹果、谷歌内核
            gecko: () => {
                sys.gecko = u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1;
            }, //火狐内核
            mobile: () => {
                sys.mobile = !!u.match(/AppleWebKit.*Mobile.*/);
            }, //是否为移动终端
            ios: () => {
                sys.ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            }, //ios终端
            android: () => {
                sys.android =
                    u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
            }, //android终端
            iPhone: () => {
                sys.iPhone = u.indexOf("iPhone") > -1;
            }, //是否为iPhone或者QQHD浏览器
            iPad: () => {
                sys.iPad = u.indexOf("iPad") > -1;
            }, //是否iPad
            webApp: () => {
                sys.webApp = u.indexOf("Safari") == -1;
            }, //是否web应该程序，没有头部与底部
            weixin: () => {
                sys.weixin = u.indexOf("MicroMessenger") > -1;
            }, //是否微信 （2015-01-22新增）
            qq: () => {
                sys.qq = u.match(/\sQQ/i) == " qq";
            }, //是否QQ
            mgtv: () => {
                sys.mgtv =
                    u.indexOf("ImgoTV-aphone") > -1 ||
                    u.indexOf("ImgoTV-aphone") > -1;
            } // 是否芒果tvAPP
        };
        return function(sysName) {
            if (sys[sysName] === undefined) {
                judge[sysName]();
                return sys[sysName];
            } else return sys[sysName];
        };
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

export default browser;
