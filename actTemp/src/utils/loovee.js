/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
    var cache = Object.create(null);
    return (function cachedFn (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str));
    });
}

const u = navigator.userAgent;

/**
 * 判断终端数据 或 浏览器语言
 */
const loovee = {
    // 浏览器类型
    browser: {
        trident:cached(()=>{
            //IE内核
            return u.indexOf('Trident') > -1;
        }),
        presto:cached(()=>{
            //opera内核
            return u.indexOf('Presto') > -1;
        }),
        webKit:cached(()=>{
             //苹果、谷歌内核
            return u.indexOf('AppleWebKit') > -1;
        }),
        gecko:cached(()=>{
            //火狐内核
            return u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1;
        }),
        mobile:cached(()=>{
            //是否为移动终端
            return !!u.match(/AppleWebKit.*Mobile.*/);
        }),
        ios:cached(()=>{
            //ios终端
            return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        }),
        android:cached(()=>{
             //android终端
            return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        }),
        iPhone:cached(()=>{
            //是否为iPhone
            return u.indexOf('iPhone') > -1;
        }),
        iPad:cached(()=>{
            //是否iPad
            return u.indexOf('iPad') > -1;
        }),
        webApp:cached(()=>{
            //是否web应该程序，没有头部与底部
            return u.indexOf('Safari') == -1;
        }),
        weixin:cached(()=>{
            // 是否微信浏览器
            return u.indexOf('MicroMessenger') > -1;
        }),
        qq:cached(()=>{
            // 是否qq浏览器
            return u.match(/\sQQ/i) == " qq";
        }),
        uc:cached(()=>{
            // 是否qq浏览器
            return u.indexOf('UCWEB') > -1;
        }),
        dd:cached(()=>{
            // 是否叮叮app
            return u.indexOf('dingdingwawaji') > -1;
        }),
        ly:cached(()=>{
            // 是否乐园app
            return u.indexOf('dingdingleyuan') > -1;
        }),
        lm:cached(()=>{
            // 是否乐檬app
            return u.indexOf('lemengwawaji') > -1;
        }),
        hj:cached(()=>{
            // 是否欢聚app
            return u.indexOf('huanjuwawaji') > -1;
        }),
        dm:cached(()=>{
            // 是否对面app
            return u.indexOf('MeachSE') > -1;
        }),
        app:cached(()=>{
            // 是否乐唯旗下app
            let data = ['dd','ly','lm','hj','dm'];
            return data.some((name)=>{
                if( loovee.browser[name]() ){
                    return true;
                }
            });
        }),
    },

    // 获取浏览器语言
    lan: (navigator.browserLanguage || navigator.language).toLowerCase(),

    // 获取URL参数
    get:cached((name)=>{
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }),

    // 一些正则表达式
    regExp:{
        isNum:(num) => {
            //是否为 数字！整数，浮点数
            return !isNaN(num);
        }
        , isEmail:(mail) => {
            //# 是否为 邮箱
            return /^([a-z0-9]+[_\-\.]?)*[a-z0-9]+@([a-z0-9]+[_\-\.]?)*[a-z0-9]+\.[a-z]{2,5}$/i.test(mail);
        }
        , isIdCard:(card) => { 
            //# 是否为 身份证
            return /^(\d{14}|\d{17})(\d|[xX])$/.test(card);
        }
        , isMobile:(mobile) => { 
            //# 是否为 手机
            return /^0*1\d{10}$/.test(mobile);
        }
        , isQQ: (qq) => {
            //# 是否为 QQ号码
            return /^[1-9]\d{4,10}$/.test(qq);
        }
        , isTel:(tel) => {
            //# 是否为 电话
            return /^\d{3,4}-\d{7,8}(-\d{1,6})?$/.text(tel);
        }
        , isUrl:(url) => { 
            //# 是否为 URL
            return /https?:\/\/[a-z0-9\.\-]{1,255}\.[0-9a-z\-]{1,255}/i.test(url);
        }
        , isColor:(color) => {
            //# 是否为 16进制颜色
           return /#([\da-f]{3}){1,2}$/i.test(color);
       }
        //浮点数
        , isFloat:(num) => { 
            //# 是否为 浮点数
            return /^(([1-9]\d*)|(\d+\.\d+)|0)$/.test(num);
        }
        , isInt:(num) => { 
            //# 是否为 正整数
            return /^[1-9]\d*$/.test(num);
        }
        , isChinese:(str) => {
            //是否全为汉字
            return /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])+$/gi.test(str);
        }
        ,isZh:(str) => {
            //  是否汉字
            return /[^\u4e00-\u9fa5]/.test(str);        
        }
        ,isEn:(str)=>{
            // 是否英语
            return /[^a-zA-Z]/.test(str);    
        }
        ,https:cached(()=>{
            // 判断是否https
            return  document.location.protocol ? true : false;
        })
        ,bytes:(str)=>{
            // 获取字节数
            if (!str) { 
                str = ""; 
            }
            let a =  0;
            let len = str.length;
            for (let i = 0; i < len; i++ ) {
                if (loovee.regExp.isZh(str.charAt(i))) {
                    a += 2;
                } else { 
                    a++; 
                }
            }
            return a;
        },
    },

    /**
     * 生成UUid
     * @param {*} len  生成长度
     * @param {*} radix 基数 2：二进制 8：八进制 10：十进制 16:16进制
     */
    uuid:function(len, radix){
        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        let uuid = [],i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            let r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8: r];
                }
            }
        }
        return uuid.join('');
    },

     /**
     * 调用客户端分享
     * @param JSON $json
     */
    share:function (json) {
        json = JSON.stringify(json);
		if( typeof(client) !== 'undefined' ) {
            if (typeof(window.client.share) !== 'undefined') {
                window.client.share(json);
                return;
            }
        }
        if( typeof(webkit) !== 'undefined' ){
            if(typeof(window.webkit.messageHandlers) !== 'undefined' ){
                if(typeof(window.webkit.messageHandlers.client_share) !== 'undefined' ){
                    window.webkit.messageHandlers.client_share.postMessage(json);
                    return;
                }
                if(typeof(window.webkit.messageHandlers.share) !== 'undefined' ){
                    window.webkit.messageHandlers.share.postMessage(json);
                    return;
                }
                if(typeof(window.webkit.messageHandlers.goToWebView) !== 'undefined' ){
                    window.webkit.messageHandlers.goToWebView.postMessage(json);
                    return;
                }
            }
        }
        return json;
    },
};

export default loovee;