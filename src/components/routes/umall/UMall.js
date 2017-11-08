/**
 * Created by Brian on 18/03/2017.
 */
import React from 'react';
import {browserHistory, Link} from 'react-router';
import {Req, codeMessages} from '../../../utils/request';
import PhoneCodeButton from '../widget/PhoneCodeButton';
import WeUI from 'react-weui';
import {getLocalUserInfo} from '../../../utils/auth';
import {isRegExp} from '../../../utils/util';
import setWXTitle from '../../WXTitle';
import "../../../styles/umall.scss";
const {Tab, TabBody, TabBar, Dialog, Toast} = WeUI;

export default class UMall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            money: 50,
            quantity: 50,
            moneyArr: [50, 100, 200, 300, 500, 1000,2000,3000,5000],
            showIOS1: false,
            showIOS2: false,
            phoneCode: "",
            consumablePoint: 0,
            currentPoint: 0,
            currentCash: 0,
            wealthType: "POINT",
            couponType: "JD",
            PointRate: 0,
            CashRate: 0,
            userInfo: {
                phone: ""
            },
            errorTitle: "",
            ErrShowIOS: false,
            errorContent: "",
        };
        this.toastTimer = "";
    }

    componentDidMount() {
        this.getWealth();
        this.getCouponRulePoint();
        this.getCouponRuleCash();
        this.setState({
            userInfo: getLocalUserInfo()
        });
        setWXTitle("积分商城")
    }

    getWealth() {
        Req.MWealth().then(function (record) {
            const {consumablePoint, currentPoint, currentCash} = record;
            this.setState({
                consumablePoint,
                currentPoint,
                currentCash
            })
        }.bind(this));
    }

    setQuantity(money, rate) {
        const {wealthType,PointRate,CashRate} = this.state;
        const oRate = rate > 0 ? rate :(wealthType === "POINT" ?PointRate: CashRate);
        const omoney = money > 0 ? money : this.state.money;
        if (omoney > 0 && oRate > 0) {
            return parseInt(omoney / (oRate / 100));
        }
        return omoney;
    }

    getCouponRulePoint() {
        const {couponType} = this.state;
        Req.MCouponRulePoint({couponType}).then(function (record) {
            const {pointRate} = record;
            this.setState({
                PointRate: pointRate,
                quantity: this.setQuantity(0, pointRate)
            })
        }.bind(this));
    }
    getCouponRuleCash() {
        const {couponType} = this.state;
        Req.MCouponRuleCash({couponType}).then(function (record) {
            const {cashRate} = record;
            this.setState({
                CashRate: cashRate,
                // quantity: this.setQuantity(0, PointRate)
            })
        }.bind(this));
    }

    MCouponExchange() {
        const {userInfo, phoneCode, couponType, money, wealthType, quantity} = this.state;
        // if (! isRegExp("phoneCode",phoneCode)) {
        //     this.setState({
        //         errorTitle: "错误提示",
        //         ErrShowIOS: true,
        //         errorContent: "请输入正确的验证码！",
        //     })
        //     return;
        // }
        const params = {
            // phone: userInfo.phone,
            // phoneCode,
            couponType,
            couponValue: money,
            wealthType,
            quantity
        }

        Req.MCouponExchange(params).then(function (record) {
            console.log(record)
            this.setState({
                showToast: true,
                phoneCode:""
            });
            this.getWealth();
            this.state.toastTimer = setTimeout(() => {
                this.setState({showToast: false});
            }, 2000);
        }.bind(this)).catch(function (code) {
            console.log(code);
            this.setState({
                errorTitle: "错误",
                ErrShowIOS: true,
                errorContent: code.msg,
            })
        }.bind(this));
    }

    getPhoneCodeInfo() {
        //获取验证码判断条件
        let {phone} = this.state.userInfo;
        return {phone};
    }

    render() {
        const {showIOS1, showIOS2, money, quantity, consumablePoint, currentPoint, currentCash, wealthType, userInfo, moneyArr, showToast, errorTitle, ErrShowIOS, errorContent, PointRate,CashRate,phoneCode} = this.state;
        const buttons1 = [{
                type: 'default',
                label: '取消',
                onClick: e => {
                    this.setState({showIOS1: false,phoneCode:""});
                }
            }, {
                type: 'primary',
                label: '确认',
                onClick: e => {
                    if(userInfo.phone >0){
                        this.setState({showIOS1: false, showIOS2: true,phoneCode:""});
                    }else{
                        browserHistory.push("/user_phone")
                    }
                }
            }],
            buttons2 = [{
                type: 'default',
                label: '取消',
                onClick: e => {
                    this.setState({showIOS2: false});
                }
            }, {
                type: 'primary',
                label: '确认',
                onClick: e => {
                    this.MCouponExchange()
                    this.setState({showIOS2: false});
                }
            }],
            ErrButtons = [{
                type: 'primary',
                label: '确认',
                onClick: e => {
                    this.setState({ErrShowIOS: false});
                }
            }];
        const moneyArrList = moneyArr.map((item, index, arr) => {
            if (index % 3 != 0)return;
            let items = [item];
            if (arr[index + 1]) {
                items.push(arr[index + 1])
            }
            if (arr[index + 2]) {
                items.push(arr[index + 2])
            }
            return (
                <div className="f--hcc" key={index}>
                    {items.map((item1, index1) => {
                        return (
                            <div key={index1} className={money == item1 ? "active" : ""} onClick={(e) => {
                                this.setState({
                                    money: item1,
                                    quantity: this.setQuantity(item1)
                                })
                            }}>￥{item1}
                            </div>
                        )
                    })}
                </div>
            )
        }).filter(item => item);

        return (
            <Tab>
                <TabBody className="umall" style={(PointRate > 0) ? {paddingBottom: 0} : {}}>
                    <div>
                        <div className="head">
                            <div className="f--hlc">
                                <div onClick={()=>{
                                    browserHistory.push("/user_myu")
                                }}>
                                    <p>
                                        我的优币
                                    </p>
                                    <p className="um">
                                        {consumablePoint / 10000}
                                        {/*{currentPoint / 10000}*/}
                                    </p>
                                </div>
                                <div>
                                    <Link to="/user_myu">
                                        <i className="cell_ft"></i>
                                    </Link>
                                </div>
                            </div>
                            <div className="f--hlc" onClick={() => {
                                this.setState({
                                    wealthType: "POINT",
                                },()=>this.setState({quantity: this.setQuantity()}))
                            }}>
                                <div>
                                    <i className="ic-ymoner"></i>
                                    <span>优币抵扣 <span>兑换比例[100:{PointRate}]</span></span>
                                </div>
                                <div>
                                    <span>{consumablePoint / 10000}</span>
                                    <span className="checkI">
                                        {(wealthType === "POINT") && <i className="ic-choice-2"></i>}
                                    </span>
                                </div>
                            </div>
                            {currentCash > 0 &&
                                <div className="f--hlc" onClick={() => {
                                    this.setState({
                                        wealthType: "CASH",
                                    },()=>this.setState({quantity: this.setQuantity()}))
                                }}>
                                    <div>
                                        <i className="ic-balance"></i>
                                        <span>余额抵扣<span> 兑换比例[100:{CashRate}]</span></span>
                                    </div>
                                    <div>
                                        <span>{(currentCash / 10000).toFixed(0)}</span>
                                        <span className="checkI">
                                            {(wealthType === "CASH") && <i className="ic-choice-2"></i>}
                                        </span>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className="content">
                            <div className="list">
                                {(PointRate > 0 || CashRate > 0 ) &&
                                <div className="jd">
                                    <div className="mallLogo">
                                        <img src="../../images/jd.png" alt=""/>
                                        <span className="money">￥{money}</span>
                                    </div>
                                    <div className="checkbox">
                                        {moneyArrList}
                                    </div>
                                    <div className="foot f--hlc">
                                        <span>京东E卡</span>
                                        <span>￥{money}</span>
                                    </div>
                                </div>
                                }
                            </div>
                        </div>

                        <Dialog type="ios" title={`￥${money} 京东E卡`} buttons={buttons1} show={showIOS1}>

                            {userInfo.phone >0? "确认兑换吗？":"您未绑定手机号码！是否绑定手机号码？"}
                        </Dialog>
                        <Dialog className="cellphoneCode1" type="ios" title={userInfo.phone} buttons={buttons2} show={showIOS2}>
                            <div>
                                <p className="tel">
                                    您确定用此手机号码兑换吗？
                                </p>
                                <div className="f--hlc">
                                    {/*<div className="flex-1">
                                        <input type="number" value={phoneCode} maxLength="8" onChange={(e) => {
                                            this.setState({
                                                phoneCode: e.target.value
                                            })
                                        }}/>
                                    </div>
                                    <PhoneCodeButton className='btn textHover' info={this.getPhoneCodeInfo()}/>*/}
                                </div>
                            </div>
                        </Dialog>
                        <Dialog type="ios" title={errorTitle} buttons={ErrButtons} show={ErrShowIOS}>
                            {errorContent}
                        </Dialog>
                        <Toast icon="success-no-circle" show={showToast}>提交成功，<br />请等待审核</Toast>
                    </div>
                </TabBody>
                <TabBar>
                    {(PointRate > 0) &&
                    <div className="tatal_tabbar umall">
                        <div onClick={()=>browserHistory.go(-1)}>
                            <i className="ic-aeeow-24-white"></i>
                        </div>
                        <div>单价：<span
                            style={{fontSize: "16px"}}>{quantity} {/*wealthType === "POINT" ? "优币" : "余额"*/}</span></div>
                        <div className="btn btnHover" onClick={e => {
                            this.setState({
                                showIOS1: true
                            })
                        }}>
                            <span>兑换</span>
                        </div>
                    </div>
                    }
                </TabBar>
            </Tab>
        );
    }
}
