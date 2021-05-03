/**
 * 判断是否是 https
 */

const url = document.location;
const isHttps = 'https:' === url.protocol ? true : false;

export default isHttps;