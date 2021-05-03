import Vue from "vue";
import FastClick from "fastclick";
import Tpl from "./template.vue";
import promise from "es6-promise";
// 兼容 Promise
promise.polyfill();
FastClick.attach(document.body);
Vue.config.productionTip = false;
if (process.env.env === "prod") {
    if (location.host == "weixin.cmop.mgtv.com") {
        window.baseurl = "/lewei/";
    } else {
        window.baseurl = "/";
    }
} else {
    window.baseurl = "https://bbmt.loovee.com/";
}

new Vue({
    render: h => h(Tpl),
}).$mount("#app");
