/**
 * 获取URL中的参数
 * 例： getQueryString('name')
 */

const getQueryString  = (name) => {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    let context = "";
    if (r != null)
    context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : decodeURI(context);
};

export default getQueryString;