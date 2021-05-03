/**
 * 盲盒活动分享封装
 * 区分调用分享时的当前环境
 */

const CHECKSYS = function() {
    var result = '';
    // 开启模拟移动终端时 这里识别的是false
    var isPC = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? false : true;
    var paramsH5 = window.isH5;
    var cantShare = 
        (paramsH5 === "isH5" || paramsH5 === "client") || isPC;

    if (cantShare) {
        // H5
        result = 'cantShare';

    } else if (!paramsH5) {
        // APP
        result = 'appShare';

    } else {
        // 小程序
        result = 'miniShare';
    }
    
    // 抛出类型 APP分享 浏览器环境分享 小程序分享
    return result;
};

export default CHECKSYS;