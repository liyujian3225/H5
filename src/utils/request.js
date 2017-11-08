/**
 * Created by StupidBoy on 2017/3/11.
 */
import { browserHistory } from 'react-router';
import { apis } from '../api/baseAPI';
import { doWechatLogin, loginCodeStatus } from './auth';
import { loginType, getBrowserType, getCookie, clearCookie, removeStorageItem, isDev} from './util';

import AppAction from '../actions/AppAction';

const Promise = require('promise-polyfill');

const successCodes = ['200', '201', '2000', '1201'];  //合法code  1201暂时合法

const lianlianQuickPay = 'https://wap.lianlianpay.com/payment.htm';
const lianLianAuthPay = 'https://wap.lianlianpay.com/authpay.htm';

/*
 * @param hideLoading - 不用出现全局的loading cover，默认关闭
 * @param showAlert - 显示alert框，默认不显示
 *
 * */
const ajaxXML = (method, url, data, hideLoading, showAlert)=> {
    var request = new XMLHttpRequest();
    return new Promise(function (resolve, reject) {
        if(!hideLoading) {
            AppAction['startLoading'](url);
        }
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if(!hideLoading) {
                    AppAction['endLoading'](url);
                }
                if (request.status === 200) {
                    let response = JSON.parse(request.responseText);
                    if(successCodes.indexOf(response.code)>=0) {
                        if(response.data){
                            resolve(response.data);
                        } else {
                            resolve(null);
                        }
                    } else {
                        checkLoginCode(url, response.code);
                        if(showAlert) {
                            alert(codeMessages(response.code)?codeMessages(response.code):'请刷新重试！');
                        }
                        if (response.default){
                            reject({code:response.code, msg:response.message});
                        }else{

                            reject({code:response.code, msg:codeMessages(response.code,response.message)});
                        }
                    }
                } else {
                    if(showAlert) {
                        let response = JSON.parse(request.responseText);
                        alert(codeMessages(response.code)?codeMessages(response.code):'请刷新重试！');
                    }
                    reject(request.status);
                }
            }
        };
        if(method == "get" ||method == "GET"){
            let url1 = "?";
            for (var i in data){
                url1 += `${i}=${data[i]}&`;
            }
            request.open(method, url+url1.substr(0,url1.length-1));
        }else{
            request.open(method, url);
        }
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(data));
    });
};

let checkLoginCode = (url, statusCode)=>{
    if(statusCode === '401') {
        if(getCookie('_MCH_AT')) {
            clearCookie('_MCH_AT');
        }
        let browser = getBrowserType();
        switch(browser) {
            case 'wechat':
                if(loginCodeStatus.urls.length === 0) {
                    loginCodeStatus.urls.push(url);
                    doWechatLogin();
                }
                break;
            case 'mobile':
            case 'pc':
                let uri = '/phone_auth';
                let cL = browserHistory.getCurrentLocation();
                if(cL.pathname === uri) {
                    return;
                } else {
                    if (cL.pathname === '/') {
                        browserHistory.push(uri);
                    } else {
                        uri = uri + '?redirect=' + encodeURIComponent(cL.pathname+cL.search);
                    }
                    browserHistory.push(uri);
                }
                break;
        }
    }
};

const codeMessages = (code,msg)=>{
    let message ='网络异常';
    if (msg == "请先认证代理人"){
        return msg;
    }
    switch (code) {
        case "400":
            message = "网络异常";
            break;
        case "401":
            message = "账户信息有误，登录失败！";
            break;
        case "403":
            message = "禁止访问";
            break;
        case "404":
            message = "部分请求的资源已经不存在或者被下架";
            break;
        case "408":
            message = "请不要重复提交!";
            break;
        case "409":
            message = "用户已存在";
            break;
        case "500":
        case "502":
        case "504":
            message = "系统出现异常，请刷新重试！";
            break;
        case "501":
            message = "非法参数";
            break;
        case "1000":
            message = "请求无法处理，原因可能是：1）资源不存在，2）状态已改变。建议重新加载后重试。";
            break;
        case "1001":
            message = "初始化数据，禁止删改";
            break;
        case "1100":
            message = "创建用户失败.";
            break;
        case "1101":
            message = "更新用户信息失败.";
            break;
        case "1102":
            message = "获取用户信息失败。";
            break;
        case "1103":
            message = "删除用户失败。";
            break;
        case "1104":
            message = "重复的用户。";
            break;
        case "1150":
            message = "更新密码失败";
            break;
        case "1151":
            message = "旧密码输入有误";
            break;
        case "1200":
            message = "手机验证码错误";
            break;
        case "1201":
            message = "手机验证码发送失败";
            break;
        case "1202":
            message = "创意已经发布过";
            break;
        case "1203":
            message = "标签分类名称不能重复";
            break;
        case "1207":
            message = "抱歉，银行卡号校验不一致";
            break;
        case "2010":
            message = "支付失败";
            break;
        case "2022":
            message = "账户优币不足";
            break;
        case "2024":
            message = "已经是代理人!";
            break;
        //case "201":
        //    message = "已创建";
        //    break;
        //case "2000":
        //    message = "支付成功";
        //    break;
        default :
            message = msg || '网络异常';
    }
    return message;
};

//连连支付post
let lianLianFormPost = (URL, result)=> {
    var temp_form = document.createElement("form");
    temp_form.action = URL;
    // temp_form.target = "_blank";
    temp_form.method = "post";
    temp_form.id = 'postForm';
    temp_form.style.display = "none";

    let opt = document.createElement("input");
    opt.name = 'req_data';
    opt.value = JSON.stringify(result);
    temp_form.appendChild(opt);

    document.body.appendChild(temp_form);
    temp_form.submit();
    if(document.getElementById('postFrom')) {
        document.body.removeChild(document.getElementById('postFrom'));
    }
};

let lianLianOnlinePay = (data, clearStorage, isQuickPay)=>{
    let postData = data;
    postData['paymod'] = '1'; //paymod为1就是认证支付，2就是二维码, 3就是快捷
    let payLink = lianLianAuthPay;
    if(isQuickPay) {
        postData['paymod'] = '3';
        payLink = lianlianQuickPay;
    }
    return new Promise(function (resolve, reject) {
        Req.lianLianOnlineReq(postData).then(function(payResult){
            if(payResult) {
                if(clearStorage) {
                    removeStorageItem('packageInfo');
                }
                AppAction['startLoading']('default');
                AppAction['endLoading']('default');
                lianLianFormPost(payLink, payResult);
            } else {
                reject('failed');
            }
        }.bind(this)).catch(function(code) {
            reject('failed');
        }.bind(this));
    });
};

let lianLianOfflinePay = (data, clearStorage, hideLoading)=>{
    let postData = data;
    postData['paymod'] = '2';
    return new Promise(function (resolve, reject) {
        Req.lianLianOfflineReq(postData, hideLoading).then(function(payResult){
            if(payResult) {
                if(clearStorage) {
                    removeStorageItem('packageInfo');
                }
                AppAction['startLoading']('default');
                AppAction['endLoading']('default');
                resolve(payResult);
            } else {
                reject('failed');
            }
        }.bind(this)).catch(function(code) {
            reject('failed');
        }.bind(this));
    });
};

let Req = {};

Req.userLogin = (type, data)=>{
    switch (type) {
        case loginType.wechat:
            return ajaxXML('POST', apis.wechatLogin, data);
            break;
        case loginType.normal:
            //TODO: 暂时不用
            break;
    }
};

Req.userInfo = ()=>{
    return ajaxXML('GET', apis.info, null);
};
Req.premisesSearch = (data)=>{

    return ajaxXML('GET', apis.premisesSearch, data,(data.offset&&data.offset > 0));
};
Req.premisesCity = (data)=>{
    return ajaxXML('GET', apis.premisesCity, data);
};
Req.interiorSearch = (data)=>{
    return ajaxXML('GET', apis.interiorSearch+"/"+data.premisesId,{},(data && data.offset && data.offset > 0));
};
Req.interiorAparment = (data)=>{
    return ajaxXML('GET', apis.interiorAparment,data);
};
Req.area = (data)=>{
    return ajaxXML('GET', apis.area, data);
};
Req.productDetail = (data)=>{
    return ajaxXML('GET', apis.productDetail+"/"+data);
};
Req.aipDetail = (data)=>{
    return ajaxXML('GET', apis.aipDetail+'/'+data);
};
Req.switchAparmentDetail = (data)=>{
    return ajaxXML('GET', apis.switchAparmentDetail,data);
};
Req.customerAddress = (data)=>{
    return ajaxXML('GET', apis.customerAddress);
};
Req.addRess = (data)=>{
    return ajaxXML('POST', apis.customerAddress,data);
};
Req.revampAddress = (data)=>{
    return ajaxXML('PUT', apis.customerAddress+"/"+data.addressId,data);
};
Req.revampAddress = (data)=>{
    return ajaxXML('PUT', apis.customerAddress+"/"+data.addressId,data);
};
Req.premisesAddress = (data)=>{
    return ajaxXML('GET', apis.premisesAddress+"/"+data);
};
Req.saleOrderSmart = (data)=>{
    return ajaxXML('POST', apis.saleOrderSmart,data);
};
Req.saleOrderList = (data)=>{
    return ajaxXML('GET', apis.saleOrderList,data,(data && data.offset && data.offset > 0));
};
Req.saleOrderDetail = (data, hideLoading)=>{
    return ajaxXML('GET', apis.saleOrderDetail+"/"+data, undefined, hideLoading);
};
Req.saleOrderIdStatus = (data)=>{
    return ajaxXML('PUT', apis.saleOrderIdStatus.replace('{saleOrderId}',data[0]||""),data[1]||[]);
};
Req.picCode = (data)=>{
    return apis.phoneCode+'/'+data;
};
Req.phoneCode = (data)=>{
    return ajaxXML('POST', apis.phoneCode, data, true);
};
Req.login = (data)=>{
    return ajaxXML('POST', apis.login, data);
};
Req.MAgenter = (data)=>{
    return ajaxXML('POST', apis.MAgenter, data);
};
Req.MAgenterInviters = (data)=>{
    return ajaxXML('GET', apis.MAgenterInviters, data,true,(data && data.offset && data.offset > 0));
};
Req.MAgenterCashReward = (data)=>{
    return ajaxXML('GET', apis.MAgenterCashReward, data,true,(data && data.offset && data.offset > 0));
};
Req.pointFlow = (data)=>{
    return ajaxXML('GET', apis.pointFlow, data,(data && data.offset && data.offset > 0));
};
Req.MPoint = (data)=>{
    return ajaxXML('GET', apis.MPoint, data);
};
Req.MPointConvert = (data)=>{
    return ajaxXML('GET', apis.MPointConvert, data,(data && data.offset && data.offset > 0));
};
Req.MCash = (data)=>{
    return ajaxXML('GET', apis.MCash, data);
};
Req.MCashFlow = (data)=>{
    return ajaxXML('GET', apis.MCashFlow, data,(data && data.offset && data.offset > 0));
};
Req.MWealth = (data)=>{
    return ajaxXML('GET', apis.MWealth, data,true);
};
Req.MBankCard = (data)=>{
    return ajaxXML('GET', apis.MBankCard, data);
};
Req.MWithdrawsCash = (data)=>{
    return ajaxXML('POST', apis.MWithdrawsCash, data);
};
Req.ADDMBankCard = (data)=>{
    return ajaxXML('POST', apis.MBankCard, data);
};
Req.MCoupon = (data)=>{
    return ajaxXML('GET', apis.MCoupon, data,(data && data.offset && data.offset > 0));
};
Req.MCouponRulePoint = (data)=>{
    return ajaxXML('GET', apis.MCouponRulePoint, data);
};
Req.MCouponRuleCash = (data)=>{
    return ajaxXML('GET', apis.MCouponRuleCash, data);
};
Req.MCouponExchange = (data)=>{
    return ajaxXML('POST', apis.MCouponExchange, data);
};
Req.lianLianOnlineReq = (data)=>{
    return ajaxXML('POST', apis.lianLianOnlinePay, data);
};
Req.lianLianOfflineReq = (data, hideLoading)=>{
    return ajaxXML('POST', apis.lianLianOfflinePay, data, hideLoading);
};
Req.lianLianOnlinePay = (data, clearStorage)=>{
    return lianLianOnlinePay(data, clearStorage);
};
Req.lianLianOfflinePay = (data, clearStorage, hideLoading)=>{
    return lianLianOfflinePay(data, clearStorage, hideLoading);
};
Req.orderDetailByCode = (code)=>{
    return ajaxXML('GET', apis.orderDetail+'/'+code);
};
Req.modifyPhone=(data, hideLoading)=> {
    return ajaxXML('PUT', apis.modifyPhone, data, hideLoading);
};
Req.bindPhone=(data, hideLoading)=>{
    return ajaxXML('PUT', apis.modifyPhone, data, hideLoading);
};

export {Req,codeMessages};
