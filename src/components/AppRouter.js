/**
 * Created by Brian on 4/03/2017.
 */
import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './routes/App';
import HousesList from './routes/HousesList';
import Introduction from './routes/Introduction';
import SoftOutfitPackage from './routes/SoftOutfitPackage';
import CommodityDetail from './routes/CommodityDetail';
import SubmitOrder from './routes/order/SubmitOrder';
import OfflinePay from './routes/order/OfflinePay';
import OrderList from './routes/order/OrderList';
import OrderDetail from './routes/order/OrderDetail';
import AddRess from './routes/order/AddRess';
import OnlinePay from './routes/order/OnlinePay';
import UserCenter from './routes/user/UserCenter';
import UserLogin from './routes/user/UserLogin';
import UserBalance from './routes/user/UserBalance';
import UserMyU from './routes/user/UserMyU';
import UserPhone from './routes/user/UserPhone';
import UMall from './routes/umall/UMall';
import UserMyUDetail from './routes/user/UserMyUDetail';
import UserMyUWithdraw from './routes/user/UserMyUWithdraw';
import UserBalanceDetail from './routes/user/UserBalanceDetail';
import WechatLogin from './routes/wechat/WechatLogin';
import WechatCode from './routes/wechat/WechatCode';
import ProxyRegistration from './routes/proxy/Registration';
import ProxyInfo from './routes/proxy/Info';
import NotFound from './routes/widget/NotFound';
import OrderPayResult from './routes/order/OrderPayResult';

import { getBrowserType, getCookie } from '../utils/util';

class AppRouter extends React.Component {
    render() {
        return (
            <Router history={browserHistory}>
                {/*主目录页面路由*/}
                <Route path="/" component={App}>
                    {/*楼盘列表*/}
                    <IndexRoute component={HousesList}/>
                    {/*软装列表*/}
                    <Route path='introduction/:premisesId' component={Introduction}/>
                    {/*软装详情*/}
                    <Route path='package/:aipId' component={SoftOutfitPackage}/>
                    {/*商品详情*/}
                    <Route path='commodity_detail/:aipId/:productId' component={CommodityDetail}/>
                    {/*提交订单*/}
                    <Route path='submit_order/:aipId/:aparmentId' component={SubmitOrder} onEnter={hasAuthToken}/>
                    {/*添加地址*/}
                    <Route path='add_ress' component={AddRess}/>
                    {/*添加银行卡*/}
                    <Route path='online_pay/:orderId/:paymentCode' component={OnlinePay}/>
                    {/*线下二维码*/}
                    <Route path='offline_pay/:orderId/:paymentCode' component={OfflinePay}/>
                    {/*订单列表*/}
                    <Route path='order_list' component={OrderList}/>
                    {/*订单详情*/}
                    <Route path='order_detail/:saleOrderId' component={OrderDetail}/>
                    {/*个人中心*/}
                    <Route path='user_center' component={UserCenter} onEnter={hasAuthToken}/>
                    {/*代理人注册*/}
                    <Route path='proxy_registration' component={ProxyRegistration} />
                    {/*代理人内容*/}
                    <Route path='proxy_info' component={ProxyInfo} />
                    {/*我的余额*/}
                    <Route path='user_balance' component={UserBalance} />
                    {/*我的余额明细*/}
                    <Route path='user_balance_detail' component={UserBalanceDetail} />
                    {/*我的优币*/}
                    <Route path='user_myu' component={UserMyU} />
                    {/*我的优币明细*/}
                    <Route path='user_myu_detail' component={UserMyUDetail} />
                    {/*我的优币 - 提现额度*/}
                    <Route path='user_myu_withdraw' component={UserMyUWithdraw} />
                    {/*我的手机号码*/}
                    <Route path='user_phone' component={UserPhone} />
                    {/*优币商城*/}
                    <Route path='umall' component={UMall} />
                    <Route path='order_pay/result' component={OrderPayResult} />
                </Route>
                <Route path='/about/wechat_code' component={WechatCode}/>
                {/*手机授权*/}
                <Route path='/phone_auth' component={UserLogin} onEnter={wechatForbidden}/>
                {/*第三方授权后的回调路径*/}
                <Route path='/wechat_auth' component={WechatLogin} onEnter={normalForbidden}/>
                {/*其他路由*/}
                <Route path="*" component={NotFound} />
            </Router>
        )
    }
}

const hasAuthToken = (nextState, replace)=>{
    if(!getCookie('_MCH_AT')) {
        let uri = '/phone_auth';
        let cL = browserHistory.getCurrentLocation();
        if(cL.pathname !== uri) {
            let re = {pathname: uri};
            if (cL.pathname !== '/') {
                re.pathname = uri;
                re.query = {redirect: cL.pathname+cL.search};
            }
            replace(re);
        }
    }
};

const wechatForbidden = (nextState, replace) => {
    if(getBrowserType() === 'wechat') {
        replace({ pathname: '/' })
    }
};
const normalForbidden = (nextState, replace) => {
    if(getBrowserType() !== 'wechat') {
        replace({ pathname: '/' })
    }
};

export default AppRouter;
