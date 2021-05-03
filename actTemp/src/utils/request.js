//引入axios
import axios from 'axios';
import Vue from "vue";

import {ToastPlugin} from 'vux';

Vue.use(ToastPlugin);

let vm = new Vue({});

let cancel, promiseArr = {};
const CancelToken = axios.CancelToken;
//请求拦截器
axios.interceptors.request.use(config => {
    //发起请求时，取消掉当前正在进行的相同请求
    if (promiseArr[config.url]) {
        promiseArr[config.url]('操作取消');
        promiseArr[config.url] = cancel;
    } else {
        promiseArr[config.url] = cancel;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
    return response;
}, err => {
    if (err && err.response) {
        const errMessage = {
            400: '错误请求',
            401: '未授权，请重新登录',
            403: '拒绝访问',
            404: '请求错误,未找到该资源',
            405: '请求方法未允许',
            408: '请求超时',
            500: '服务器端出错',
            501: '网络未实现',
            502: '网络错误',
            503: '服务不可用',
            504: '网络超时',
            505: 'http版本不支持该请求',
        };
        for (let status in errMessage) {
            if (err.response.status === parseInt(status)) {
                vm.$vux.toast.text(errMessage[status]);
            }
        }
    } else {
        // vm.$vux.toast.text("连接到服务器失败");
        console.log(err);
    }
    // return Promise.resolve(err.response);
});

//设置默认请求头
axios.defaults.headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
};
axios.defaults.timeout = 120000;

let http = {
    /** get 请求
     * @param  {接口地址} url
     * @param  {请求参数} params
     */
    get: function (url, params = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url,
                params,
                cancelToken: new CancelToken(c => {
                    cancel = c;
                }),
            })
                .then((response) => {
                    if (response) {
                        resolve(response.data);
                    }
                })
                .catch((error) => {
                    vm.$vux.toast.text("连接到服务器失败");
                    reject(error);
                });
        });
    },
    /** post 请求
     * @param  {接口地址} url
     * @param  {请求参数} params
     */
    post: function (url, params = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url,
                data: params,
                cancelToken: new CancelToken(c => {
                    cancel = c;
                }),
            })
                .then((response) => {
                    if (response) {
                        resolve(response.data);
                    }
                })
                .catch((error) => {
                    vm.$vux.toast.text("连接到服务器失败");
                    reject(error);
                });
        });
    },
    /** put 请求
     * @param  {接口地址} url
     * @param  {请求参数} params
     */
    put: function (url, params = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'put',
                url,
                params,
                cancelToken: new CancelToken(c => {
                    cancel = c;
                }),
            })
                .then((response) => {
                    if (response) {
                        resolve(response.data);
                    }
                })
                .catch((error) => {
                    vm.$vux.toast.text("连接到服务器失败");
                    reject(error);
                });
        });
    },
    /** delete 请求
     * @param  {接口地址} url
     * @param  {请求参数} params
     */
    delete: function (url, params = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'delete',
                url,
                params,
                cancelToken: new CancelToken(c => {
                    cancel = c;
                }),
            })
                .then((response) => {
                    if (response) {
                        resolve(response.data);
                    }
                })
                .catch((error) => {
                    vm.$vux.toast.text("连接到服务器失败");
                    reject(error);
                });
        });
    },
};

export default http;
