/**
 * 跳转链接转换成小程序、app
 */

const getQueryString = name => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null) context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ?
        "" :
        decodeURI(context);
};

const jumpLinkInit = jumpUrl => {
    var pageJumpUrl     = "",
        pageJumpType    = "navigateTo";

    if (jumpUrl.indexOf("app://") > -1) {
        // 客户端跳转小程序
        if (jumpUrl.indexOf("app://miniApp") > -1) {
            var miniAppArr1 = jumpUrl.split("app://miniApp?path=");
            var miniAppArr2 = miniAppArr1[1].split("?");
            
            pageJumpUrl = miniAppArr1[1];
            pageJumpType = 
                switchTabs.indexOf(miniAppArr2[0]) !== -1 ? "switchTab": pageJumpType;

        // app的配置形式跳转
        } else {
            var splitUrlArr = jumpUrl.split("?");
            pageJumpType = 
                switchTabs.indexOf(appLinkBase[splitUrlArr[0]]) !== -1 ? "switchTab": pageJumpType;

            if (appLinkBase[splitUrlArr[0]]) {
                pageJumpUrl = 
                    splitUrlArr[1] ? 
                        appLinkBase[splitUrlArr[0]] + "?" + splitUrlArr[1] : appLinkBase[splitUrlArr[0]];

            } else {
                // 映射表不存在则跳去首页
                pageJumpUrl = "/pages/home/main";
                pageJumpType = "switchTab";
            }
        }

    // 外部链接
    } else if (jumpUrl.indexOf("http") > -1) {
        if (jumpUrl.indexOf("?") > -1) {
            var dataRes = jumpUrl.split("?");
            pageJumpUrl = 
                `/pages/webView/main?url=${ dataRes[0] }&${ dataRes[1] }&downfrom=${ downfromVal }&isH5=${ window.isH5 }`;

        } else {
            pageJumpUrl = 
                `/pages/webView/main?url=${ jumpUrl }&downfrom=${ downfromVal }&isH5=${ window.isH5 }`;
        }
        if (minAppSid) pageJumpUrl += ("&minAppSid=" + minAppSid);
    }

    return {
        pageJumpUrl,
        pageJumpType,
    };
};

// 小程序/芒果
var appLinkBase = {
    "app://boxPage": "/pages/home/main", 									
};
var switchTabs = [
    "/pages/home/main",
];

// console.log('--------------- window.isH5: ', window.isH5)

var downfromVal = getQueryString("downfrom") || "blindbox.h5";
var minAppSid = getQueryString("minAppSid");

// 新增芒果h5版本，链接存在差异，都要兼容，isOnlyH5代表纯碎的h5
var isOnlyH5 = window.isH5 === "isH5" && downfromVal !== "h5@10346";
// 旧的h5版本
if (isOnlyH5) {
    appLinkBase = {
        "app://boxPage": "/pages/home/main",                // 盲盒首页
    };
    switchTabs = [
        "/pages/home/main",
    ];
}

// 传入app链接
const hrefTo = appAddr => {
    let params = "";
    if (appAddr.indexOf("?") > -1) {
        params = appAddr.slice(appAddr.indexOf("?"));
        appAddr = appAddr.slice(0, appAddr.indexOf("?"));
    }
    let value = appAddr + params;

    // app打开
    if (!window.isH5) {
        window.location.href = value;
        return;
    
    // 统一处理 uni跳转
    } else {
        var newLinkObj = jumpLinkInit(value);
        
        if (!uni) {  // eslint-disable-line
            console.error('-------- convertHref.js为引入uniapp SDK');
            return;
        }

        uni[newLinkObj.pageJumpType]({  // eslint-disable-line
            url: newLinkObj.pageJumpUrl,
        });
    }
};

export default hrefTo;