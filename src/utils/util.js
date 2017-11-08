import {browserHistory} from 'react-router';

const isDev = true;  //是否处于开发模式

const webAddress = isDev ? 'http://m.uxuanjia.cn' : 'https://m.uxuanjia.cn';

let loginType = {
    wechat: 1,  //微信登录
    normal: 2,  //普通登录
};

const encodeCookiesName = ['nickname']; //需加密的CookiesName

// cookies
let getCookie = (name) => {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        let value = arr[2];
        if (encodeCookiesName.indexOf(name) >= 0) {
            value = unescape(value);
        }
        return value;
    }
    return null;
};

let setCookie = (name, value, expireDays) => {
    let postfix = ';';
    if (expireDays !== undefined) {
        var exp = new Date();
        exp.setTime(exp.getTime() + expireDays * 24 * 60 * 60 * 1000);
        postfix += 'expires=' + exp.toGMTString();
    }
    let finalValue = value;
    if (encodeCookiesName.indexOf(name) >= 0) {
        finalValue = escape(value);
    }
    document.cookie = name + "=" + finalValue + postfix;
};

let clearCookie = (name) => {
    if (name === undefined) {
        return;
    }
    setCookie(name, '', -1);
};

let clearCookies = ()=>{
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
    }
};

let removeStorageItem = (name) => {
    if (!window.localStorage) {
        alert("请升级浏览器");
    } else {
        const storage = window.localStorage;
        storage.removeItem(name);
    }
};

let getReturnUrl = () => {
    //获取返回的uri
    let cL = browserHistory.getCurrentLocation();
    let url = '/';
    if (cL.search && cL.search.substr(0, 10) === '?redirect=') {
        let temp = cL.search.substr(10);
        if (temp && temp !== '') {
            url = decodeURIComponent(temp);
        }
    }
    return url;
};

//gen uuid
let genUuid = (len, radix) => {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data. At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
};

//browser
let browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端 //|| !!u.match(/AppleWebKit/)
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone
            mac: u.indexOf('Mac') > -1, //是否为mac
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

let isMobile = () => {
    let versions = browser.versions;
    return versions.mobile || versions.android || versions.ios;
};

let isWechat = () => {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
};

let getBrowserType = () => {
    if (isWechat()) {
        return 'wechat';
    } else if (isMobile()) {
        return 'mobile';
    } else {
        return 'pc';
    }
};

//image
let fullImage = (image, width, height) => {
    if (image && !(image.substr(0, 5) == 'data:' || image.substr(0, 4) == 'http' || image.substr(0, 5) == 'https')) {
        if (width !== undefined && height !== undefined) {
            return '/platform/image' + image + width + 'x' + height;
        } else {
            return '/platform/image' + image;
        }
    }
    return image;
};
let isRegExp = (name, value) => {
    let arrReg = {
        'phone': /^1[34578]\d{9}$/,
        'phoneCode': /^\d{4,8}$/,
        'picCode': /^[a-zA-Z_0-9]{4}$/,
        'name': /^[\u0391-\uFFE5a-z0-9_-]{2,8}$/,
        'CardNo': /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    };
    return arrReg[name].test(value);
}

export {
    isDev, loginType, setCookie, getCookie, clearCookie, clearCookies,
    fullImage, webAddress, getBrowserType, getReturnUrl, genUuid,
    removeStorageItem, isRegExp
};

