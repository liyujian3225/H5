import React from 'react';
import QRCode from 'qrcode.react';
import { Link, browserHistory } from 'react-router';
import setWXTitle from '../../WXTitle';
import {
    Tab, TabBody
} from 'react-weui';
import {Req} from '../../../utils/request';

import "../../../styles/order.scss";
export default class OfflinePayments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            qrCode: null,
            orderCode: null,
            orderTotal: null,
        };
        this.orderId = null; //订单内部编号
        this.paymentCode = props.params.paymentCode;

        this.getQrCode = this.getQrCode.bind(this);
        this.doPollingCheck = this.doPollingCheck.bind(this);
        this.successPay = this.successPay.bind(this);
    }

    componentDidMount() {
        setWXTitle("线下支付");
        this.getQrCode();
    }

    componentWillUnmount() {
        if(this.timer) {
            clearInterval(this.timer);
        }
    }

    getQrCode(hideLoading) {
        let state = {};
        if(this.state.qrCode === 'none') {
            state = {
                qrCode: null,
                orderCode: null,
                orderTotal: null,
            };
        }
        this.setState(state,()=>{
            let data = {'paymentCode':this.paymentCode};
            let failState = {
                qrCode: 'none',
                orderCode: null,
                orderTotal: null,
            };
            Req.lianLianOfflinePay(data, true, hideLoading).then(function (result) {
                if(result) {
                    this.setState({
                        qrCode: result['dimension_url'], //二维码路径
                        orderCode: result['no_order'], //订单编码
                        orderTotal: result['money_order'], //价格
                    },()=>{
                        this.orderId = result['info_order']; //orderID
                        this.doPollingCheck();
                    });
                } else {
                    this.setState(failState);
                }
            }.bind(this)).catch(function(){
                this.setState(failState);
            }.bind(this));
        });
    }

    doPollingCheck() {
        this.timer = setInterval(function () {
            //获取信息
            Req.saleOrderDetail(this.orderId, true).then(function (result) {
                if(result&&result.saleOrderStatus
                    &&[3016, 3020,3021].indexOf(result.saleOrderStatus.code)>=0) {
                    this.successPay();
                }
            }.bind(this)).catch(function (code) {
            }.bind(this));
        }.bind(this), 5000);
    }

    successPay() {
        if(this.timer) {
            clearInterval(this.timer);
        }
        browserHistory.push('/order_list/');
    }

    render() {
        return (
            <Tab>
                <TabBody className="offlinePay">
                    <div className="offlinePay_content">
                        <div className="c-top">
                            <div className="title">
                                POS机支付
                            </div>
                            <div className="orderNum">
                                {
                                    this.state.orderCode
                                        ? '订单编号：'+ this.state.orderCode
                                        : null
                                }
                            </div>
                        </div>
                        <div className="content">
                            <div className="total">
                                {
                                    this.state.orderTotal
                                        ? '￥'+ this.state.orderTotal
                                        : null
                                }
                            </div>
                            <div className="qcode">
                                {
                                    !this.state.qrCode
                                        ? '正在生成支付二维码...'
                                        : this.state.qrCode === 'none'
                                        ? <div className='fail-code'>
                                        <div className='msg'>获取二维码失败</div>
                                        <button className='btn-clear fail-btn'
                                                onClick={this.getQrCode.bind(this, true)}>
                                            重新获取二维码
                                        </button>
                                    </div>
                                        : <div className='success-code'>
                                        <QRCode value={this.state.qrCode} size={220}/>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="c-footer" />
                        <div className="return" onClick={this.successPay}>
                            <i className="ic-aeeow-32-white"></i>
                        </div>
                    </div>
                </TabBody>
            </Tab>
        )
    }
}
