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
    "app://boxPage": "/pages/home/main", 															// 盲盒首页
    "app://openBox": "/pages/buyBlindBox/main", 													// 打开指定系列盲盒游戏页面
    "app://mall": "/pages/mallHome/main", 															// 商城
    "app://goodsBuy": "/pages/mallDetail/main",	 													// 商品购买页面
    "app://liveRoom": "plugin-private://ywx2b03c6e691cd7370/pages/live-player-plugin",  			// 跳转去直播间
    "app://freeLottery": "/actPackage/pages/freeDraw/main", 										// 0元抽奖
    "app://fineLottery": "/actPackage/pages/fineLottery/main",	 									// 精品抽选页面
    "app://fineLotteryDetail": "/actPackage/pages/fineLotteryDetail/main",	 						// 精品抽选详情页面
    "app://myBargain": "/actPackage/pages/blindHistory/main", 										// 跳转砍价列表
    "app://bargainDetails": "/actPackage/pages/blindBargainDetails/main", 							// 砍价详情
    "app://signPage": "/actPackage/pages/signIn/main", 												// 签到
    "app://myBoxDetail": "/personalInfoPackage/pages/openedBoxDetail/main",						 	// 盒柜详情
    "app://myBoxes": "/personalInfoPackage/pages/boxArk/main", 										// 我的盒柜
    "app://box_order": "/personalInfoPackage/pages/myOrder/main", 									// 我的订单
    "app://couponPage": "/personalInfoPackage/pages/coupons/main", 									// 优惠券
    "app://boxHouse": "/personalInfoPackage/pages/blindBoxHall/main", 								// 盲盒馆
    "app://doll_order": "/personalInfoPackage/pages/myOrder/main", 									// 我的订单
    "app://boxType": "/otherPackage/pages/boxType/main", 											// 盲盒分类
    "app://systemMsgPage": "/otherPackage/pages/systemMes/main", 									// 系统消息页面
    "app://specialTopic": "/otherPackage/pages/themeDetail/main",  									// 专题页面// 单独分类页面
    "app://groupActivity": "/actPackage/pages/groupBuy/main",										// 拼团活动
    "app://groupOrderDetails": "/actPackage/pages/groupBuyOrderDetail/main",						// 拼团订单详情
    "app://exhibitionActivity": "/actPackage/pages/showList/main",									// 线下扫码活动
};
var switchTabs = [
    "/pages/home/main",
    "/pages/information/main",
    "/pages/me/main",
    "/pages/mallHome/main",      
];

// console.log('--------------- window.isH5: ', window.isH5)

var downfromVal = getQueryString("downfrom") || "blindbox.h5";
var minAppSid = getQueryString("minAppSid");

// 新增芒果h5版本，链接存在差异，都要兼容，isOnlyH5代表纯碎的h5
var isOnlyH5 = window.isH5 === "isH5" && downfromVal !== "h5@10346";
// 旧的h5版本
if (isOnlyH5) {
    appLinkBase = {
        "app://myBoxes": "/pages/myBoxArk/main",            // 我的盒柜
        "app://box_order": "/pages/myOrder/main",           // 我的订单
        "app://boxPage": "/pages/home/main",                // 盲盒首页
        "app://openBox": "/pages/buyBlindBox/main",         // 打开指定系列盲盒游戏页面
        "app://couponPage": "/pages/coupons/main",          // 优惠券
        "app://boxType": "/pages/boxType/main",             // 单独分类页面
        "app://freeLottery": "/pages/freeDraw/main",        // 0元抽奖
        "app://boxHouse": "/pages/blindBoxHall/main",       // 盲盒馆
        "app://mall": "/pages/mallHome/main",               // 商城
        "app://signPage": "/pages/signIn/main",             // 签到
        "app://doll_order": "/pages/myOrder/main",          // 我的订单 
        "app://systemMsgPage": "/pages/systemMes/main",     // 系统消息页面
        "app://specialTopic": "/pages/themeDetail/main",    // 专题页面
        "app://goodsBuy": "/pages/mallDetail/main",	        // 商品购买页面
    };
    switchTabs = [
        "/pages/home/main",
        "/pages/boxArk/main",
        "/pages/me/main",
        "/pages/mallHome/main",      
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