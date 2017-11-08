import { Req } from './request';
import { getCookie, webAddress, setCookie } from './util';

const Promise = require('promise-polyfill');

let authStatus = { success: false, type: null };  //登录信息
let loginCodeStatus = {urls: []}; //记录返回401的url列表,为了避免微信登录多刷页面

//wx app相关资料
let appInfo = {
    wxAppID: 'wx03d450c73ba55b14',
    wxRedirectAddress: webAddress+'/wechat_auth', //重定向的页面（获取code作登录处理等）
    wxScope: 'snsapi_userinfo',
};

let wxLink = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
    'appid='+ appInfo.wxAppID + '&redirect_uri='+ encodeURIComponent(appInfo.wxRedirectAddress) +
    '&response_type=code' + '&scope='+ appInfo.wxScope + '&state='+ (new Date()).getUTCMilliseconds() + '#wechat_redirect';

let doWechatLogin = ()=>{
    window.location.href = wxLink;
};

//检测是否微信授权登录
let isWechatAuth = ()=>{
    return new Promise(function (resolve, reject) {
        if(!authStatus.success) {
            Req.userInfo().then(function (result) {
                //能获取信息
                authStatus = {success: true, type: 'wechat'};
                saveLocalUserInfo(result);
                resolve();
            }.bind(this)).catch(function () {
                //登录不成功
                reject();
            }.bind(this));
        } else {
            //授权成功的
            resolve();
        }
    });
};

let saveLoginInfo = (result, isThirdParty)=>{
    saveToken(result, isThirdParty);
    saveLocalUserInfo(result);
};

let saveToken = (result, isThirdParty)=>{
    //设置token的时候证明token有效清空status
    setCookie('_MCH_AT', result['authToken']);
    if(isThirdParty) {
        loginCodeStatus.urls = [];
        authStatus = {success: true, type: 'wechat'};
        setCookie('tp', true);
    } else {
        authStatus = {success: true, type: 'normal'};
        setCookie('tp', false);
    }
};

let saveLocalUserInfo = (result)=>{
    setCookie('photo', result['photo']);
    setCookie('nickname', result['nickname']);
    setCookie('userId', result['userId']);
    setCookie('phone', result['phone']);
    setCookie('userType', result['userType'].name);
};

let getLocalUserInfo = ()=>{
    let info = {};
    info.photo = getCookie('photo');
    info.nickname = getCookie('nickname');
    info.userId = getCookie('userId');
    info.phone = getCookie('phone');
    info.userType = getCookie('userType');

    return info;
};

export {doWechatLogin, isWechatAuth, saveLoginInfo, saveLocalUserInfo, getLocalUserInfo, loginCodeStatus};

