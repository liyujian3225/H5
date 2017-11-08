/**
 * Created by Brian on 15/04/2017.
 */
import React from 'react';
import { browserHistory } from 'react-router';
import {Req} from '../../../utils/request';
import "../../../styles/payment.scss";
import setWXTitle from '../../WXTitle';

export default class OrderPaySuccess extends React.Component {
    constructor(props) {
        super(props);
        this.code = props.location.query.code;
        this.state = {
            title: '正在获取支付结果...',
            hasResult: false,
            hasCode: this.code !== undefined,
            time: 0,
        };
        this.onReturnOrderList = this.onReturnOrderList.bind(this);

        this.successPay = this.successPay.bind(this);
        this.failPay = this.failPay.bind(this);
        this.notFoundPay = this.notFoundPay.bind(this);
    }

    componentDidMount() {
        //获取订单详情的信息
        if(this.code !== undefined) {
            //获取信息
            Req.saleOrderDetail(this.code).then(function (result) {
                if(result&&result.saleOrderStatus
                    &&[3016, 3020, 3021].indexOf(result.saleOrderStatus.code)>=0) {
                    this.successPay();
                } else {
                    this.failPay();
                }
            }.bind(this)).catch(function (code) {
                this.notFoundPay();
            }.bind(this));
        } else {
            this.notFoundPay();
        }
    }

    componentWillUnmount() {
        if(this.timer) {
            clearInterval(this.timer);
        }
    }

    failPay() {
        this.setState({
            title: ' 支付失败',
            hasResult: true
        }, ()=>{
            this.startTimer();
        })
    }

    notFoundPay() {
        this.setState({
            title: '无法获取订单信息',
            hasResult: true
        }, ()=>{
            this.startTimer();
        })
    }

    successPay() {
        this.setState({
            title: '支付成功',
            hasResult: true
        }, ()=>{
            this.startTimer();
        })
    }

    startTimer() {
        setWXTitle(this.state.title);
        let second = 5;
        this.setState({
            time: second
        },()=>{
            this.timer = setInterval(function () {
                second--;
                if(second === 0) {
                    clearInterval(this.timer);
                    this.onReturnOrderList();
                } else {
                    this.setState({
                        time: second
                    })
                }
            }.bind(this), 1000);
        });
    }

    onReturnOrderList() {
        browserHistory.push('/order_list/');
    }

    render() {
        return <div className='payment-result'>
            <div className='title'>
                {
                    this.state.title
                }
            </div>
            {
                this.state.hasResult
                    ? <div className='count-down'>{this.state.time}秒后返回订单列表...</div>
                    : null
            }
            <div className='return-btn-div'>
                <button className='btn-clear return-btn' onClick={this.onReturnOrderList}>
                    返回订单列表
                </button>
            </div>
        </div>
    }
}
