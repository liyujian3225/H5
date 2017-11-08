/**
 * Created by Brian on 18/03/2017.
 */

let genApi = (apis)=>{
    let apiPrefix = '/platform';
    for(let api in apis) {
        apis[api] = apiPrefix+apis[api];
    }
};

let apis = {
    info: '/profile',
    wechatLogin: '/auth/wechat/user/login',
    premisesCity: '/mobile/premises/city',
    //省市区列表
    area:'/area',
    //楼盘列表
    premisesSearch: '/mobile/premises/search',
    //软装方案列表
    interiorSearch: '/mobile/premises',
    //户型列表
    interiorAparment: '/mobile/premises/aparment',
    //商品套餐详情
    aipDetail:'/mobile/premises/aip',
    //户型商品套餐详情
    switchAparmentDetail:'/mobile/premises/switchAparment',
    //商品详情
    productDetail: '/mobile/product',
    //获取地址列表
    customerAddress: '/m/customer/address',
    //获取楼盘地址
    premisesAddress: '/mobile/premises/address',
    //订单提交
    saleOrderSmart: '/m/saleOrder/smart',
    //订单列表
    saleOrderList: '/m/saleOrder/list',
    //订单详情
    saleOrderDetail: '/m/saleOrder',
    //取消订单
    saleOrderIdStatus: '/m/saleOrder/{saleOrderId}/status',
    //获取手机验证code
    phoneCode: '/phoneCode',
    //手机登录
    login: '/auth/phoneCode',
    //代理人注册
    MAgenter: '/m/agenter',
    //代理人信息
    MAgenterInviters: '/m/agenter/inviters',
    //获取代理人奖励明细
    MAgenterCashReward: '/m/agenter/cashReward',
    //优币流水
    pointFlow: '/m/pointFlow',
    //兑换购物券记录
    MCoupon: '/m/coupon',
    //优币信息
    MPoint: '/m/point',
    //优币转余额
    MPointConvert: '/m/pointConvert',
    //余额信息
    MCash: '/m/cash',
    //余额分页
    MCashFlow: '/m/cashFlow',
    //连连在线支付
    lianLianOnlinePay: '/m/lianlianpay/prepay',
    //连连线下支付
    lianLianOfflinePay: '/m/lianlianpay/prepay',
    //获取我的财富
    MWealth: '/m/wealth',
    //获取我的银行卡
    MBankCard: '/m/bankCard',
    //余额提现
    MWithdrawsCash:'/m/withdrawsCash',
    //获取购物券优币兑换规则
    MCouponRulePoint: '/mobile/coupon/rule/point',
    //获取购物券余额兑换规则
    MCouponRuleCash: '/mobile/coupon/rule/cash',
    //兑换购物券
    MCouponExchange: '/m/coupon/exchange',
    //通过saleordercode获取订单信息
    orderDetail: '/m/saleOrder/code', //+ {saleordercode}
    //绑定（修改）手机号码
    modifyPhone: '/profile/phone',
};

genApi(apis);

export { apis };
