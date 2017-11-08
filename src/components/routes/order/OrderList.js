/**
 * Created by StupidBoy on 2017/4/2.
 */
import React from 'react';
import {Link, browserHistory} from 'react-router';
import {
    Tab, TabBody ,InfiniteLoader
} from 'react-weui';
import {Req} from '../../../utils/request';
import {fullImage} from '../../../utils/util';
import "../../../styles/order.scss";
import setWXTitle from '../../WXTitle';
import {FootLoaderIcon} from '../../public';

export default class OfflinePayments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            onloadDate: false,
            offset: 0,
            limit: 10,
            total: 0,
        }
    }

    getList(resolve) {
        const {offset, limit} = this.state;
        let params = {offset, limit,groupByParent:true};
        Req.saleOrderList(params).then(function (result) {
            const list = this.state.list.concat(result.items)
            this.setState({
                list,
                offset: offset + limit,
                total: result.total,
                onloadDate:true
            })
            resolve && resolve()
        }.bind(this)).catch(function (code) {
            console.log(code);
            this.setState({
                onloadDate: true
            })
        }.bind(this));
    }

    getOrderDetail(saleOrderId) {
        //获取订单详情
        Req.saleOrderDetail(saleOrderId).then(function (result) {
            let params = result;
            let list  = this.state.list.concat();
            list.filter((item)=>{return item.saleOrderId === saleOrderId}).map((item)=>{
                item.saleOrderStatus = params.saleOrderStatus;
                // return item;
            })
            this.setState({list})
        }.bind(this)).catch(function (code) {
            console.log(code);
            if (code == 508) {
                alert("订单发生变化，请刷新订单列表");
            }
        }.bind(this));
    }

    componentDidMount() {
        this.getList();
        setWXTitle("我的订单");
    }

    saleOrderIdStatus(saleOrderId) {

        /*console.log("saleOrderId",saleOrderId)
        console.log(this.state.list.concat({}))
        this.state.list.concat({}).filter((item)=>{return item.saleOrderId === saleOrderId}).map((item)=>{
            //item.saleOrderStatus = params.saleOrderStatus;
            console.log( item);
            // this.setState({list:item})
        })
        return*/
        Req.saleOrderIdStatus([saleOrderId, {
            "saleOrderStatus": "CANCELLED",
            "note": "取消订单"
        }]).then(function (result) {
            this.getOrderDetail(saleOrderId)
        }.bind(this))
    }

    render() {
        const {list, onloadDate, offset, total} = this.state;
        const orderType = {
            3010: "未支付",
            3015: "支付异常",
            3016: "已付定金",
            3017: "订单违约",
            3020: "已支付",
            // 3021: "已拆分",
            3021: "已支付",
            3070: "已取消",
            3075: "申请退款",
            3090: "已发货",
            3110: "已退款",
            3900: "已完成"
        };
        const items = list.map((item, index) => {
            return (
                <div className="item" key={index}>
                    <div className="hd f--hlc">
                        <div>订单号：{item.saleOrderCode}</div>
                        <div>{orderType[item.saleOrderStatus.code]}</div>
                    </div>
                    <div className="bd f--hlt" onClick={() => {
                        browserHistory.push("/order_detail/" + item.saleOrderId);
                    }}>
                        <div className="img"><img src={fullImage(item.interior.interiorImage)} alt=""/></div>
                        <div className="name">
                            <p>
                                {item.interior.interiorName}
                            </p>
                            <p>
                                ¥ {item.saleAmount / 10000}
                            </p>
                        </div>
                    </div>
                    {(item.saleOrderStatus.code == "3010" ) &&
                    <div className="ft f--h">
                        <div></div>
                        <div className="cancel" onClick={(e) => {
                            this.saleOrderIdStatus(item.saleOrderId);
                            //e.target.parentNode.parentNode.remove();
                        }}>
                            取消订单
                        </div>
                        <div className="payment" onClick={() => {
                            browserHistory.push("/order_detail/" + item.saleOrderId);
                        }}>
                            去付款
                        </div>
                    </div>
                    }
                    {(item.saleOrderStatus.code == "3016" ) &&
                    <div className="ft f--h">
                        <div></div>
                        <div className="payment" onClick={() => {
                            browserHistory.push("/order_detail/" + item.saleOrderId);
                        }}>
                            支付余额
                        </div>
                    </div>
                    }
                </div>
            )
        })
        return (
            <Tab>
                <TabBody className="order_list">
                    <InfiniteLoader loaderDefaultIcon={FootLoaderIcon}
                                    onLoadMore={ (resolve, finish) => {
                                        if (offset > total) {
                                            finish()
                                            //resolve();
                                        } else {
                                            this.getList(resolve, finish)
                                        }
                                    }}>
                        <div className="list">
                            {items}
                        </div>

                        <div className="return" onClick={() => {
                            browserHistory.push("/user_center")
                        }}>
                            <i className="ic-aeeow-32-white"></i>
                        </div>
                        {(items.length == 0 && onloadDate) &&
                        <div className="noData">
                            <p><i className="ic-noorder"></i></p>
                            <p>还没有相关订单</p>
                        </div>
                        }
                    </InfiniteLoader>
                </TabBody>
            </Tab>
        )
    }
}
