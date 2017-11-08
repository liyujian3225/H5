/**
 * Created by Brian on 18/03/2017.
 */
import React from 'react';
import {browserHistory, Link} from 'react-router';
import {Req} from '../../../utils/request';
import {protocols} from '../../../utils/word';
import {Prompt} from '../../public';
import {isRegExp,getCookie} from '../../../utils/util';
import WeUI from 'react-weui';
import setWXTitle from '../../WXTitle';
import ProtocolPopUp from '../widget/ProtocolPopUp';
const {Tab, TabBody,TabBar, Toast, Dialog} = WeUI;


import "../../../styles/UserCenter.scss";

export default class userBalance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Balance: 0,
            totalMoney: 0,
            bankList: [],
            cardPhone: getCookie("phone"),
            cardNumber: "",
            idNumber: "",
            userName: "",
            showIOS1: false,
            showIOS2: false,
            showIOS3: false,
            showIOS4: false,
            showToast: false,
            showToastText: "绑卡成功",
            ErrShowIOS: "",
            ErrContent: "",
            cardId: 0,
            quantity: 0,
            outFn:()=>{}
        };

    }
    getUserInfo(){
        const _this = this;
        Req.userInfo().then(function (result) {
            _this.setState({
                idNumber:result.idNumber,
                userName:result.name,
            })
        })
    }
    getBalance() {
        Req.MCash().then(function (record) {
            this.setState({
                totalMoney: record
            })
        }.bind(this))
    }

    getBankCard() {
        Req.MBankCard().then(function (record) {
            if (record && record.length > 0) {
                this.setState({idNumber: record[0].idNumber, userName: record[0].name})
                if (!this.state.cardId > 0) {
                    this.setState({cardId: record[0].cardId})
                }
            }else{
                this.getUserInfo()
            }
            this.setState({
                bankList: record
            })
        }.bind(this))
    }

    MWithdrawsCash() {
        //余额提现
        this.setState({showIOS2: false});
        const {quantity, cardId} = this.state;

        Req.MWithdrawsCash({cardId, quantity: quantity * 10000}).then(function (record) {
            this.setState({
                quantity: 0,
                showToast: true,
                showToastText: "提现成功，请等待审核！",
            })

            this.state.toastTimer = setTimeout(() => {
                this.setState({showToast: false});
            }, 2000);
            this.getBalance()
        }.bind(this)).catch(function (code) {
            this.setState({
                ErrShowIOS: true,
                ErrContent: code.msg
            })
        }.bind(this));
    }

    ADDBankCard() {
        const {cardPhone, cardNumber} = this.state;
        /*if (!isRegExp("phone", cardPhone)) {
            this.setState({
                ErrShowIOS: true,
                ErrContent: "请输入11位手机号码！"
            })
            return
        } else */
        if (!cardNumber.length > 0) {
            this.setState({
                ErrShowIOS: true,
                ErrContent: "请输入正确的银行卡号！"
            })
            return
        }
        Req.ADDMBankCard({/*phone: cardPhone,*/ cardNumber}).then(function (record) {
            this.setState({
                cardPhone: "",
                cardNumber: "",
                showToast: true,
                showToastText: "绑卡成功",
            })

            this.state.toastTimer = setTimeout(() => {
                this.setState({showToast: false});
            }, 2000);
            this.getBankCard()
        }.bind(this)).catch(function (code) {
            this.setState({
                ErrShowIOS: true,
                ErrContent: code.msg
            })
        }.bind(this));
    }
    submit(){
        let {bankList,quantity} = this.state;
        if (!(bankList.length > 0)) {
            this.setState({
                ErrShowIOS: true,
                ErrContent: "请绑定银行卡！"
            })
            return
        }
        if (!(getCookie("userType") == "CUSTOMER_AGENT")) {
            this.setState({
                ErrShowIOS: true,
                ErrContent: "请申请代理人后再提现！",
                outFn:()=>{
                    browserHistory.push("/proxy_registration");
                }
            })
            return
        }
        if (!(getCookie("phone") > 0)) {
            this.setState({
                ErrShowIOS: true,
                ErrContent: "请绑定手机号码后再提现！",
                outFn:()=>{
                    browserHistory.push("/user_phone");
                }
            })
            return
        }
        if (!(quantity >= 100)) {
            this.setState({
                ErrShowIOS: true,
                ErrContent: "最低提现金额 ￥100"
            })
            return
        }
        this.setState({showIOS2: true})
    }
    isPhone(){

        if (!(getCookie("phone") > 0)) {
            this.setState({
                ErrShowIOS: true,
                ErrContent: "请绑定手机号码后再提现！",
                outFn:()=>{
                    browserHistory.push("/user_phone");
                }
            })
            return false
        }
        this.setState({
            showIOS4: true
        })

    }
    componentDidMount() {
        this.getBalance()
        this.getBankCard()
        setWXTitle("我的余额");
    }

    render() {
        const {showIOS1, showIOS2, showIOS3, showIOS4, showToast, showToastText, quantity, totalMoney, bankList, cardId, idNumber, userName, ErrShowIOS, ErrContent, cardPhone, cardNumber,outFn} = this.state;
        const buttons1 = [{
                type: 'primary',
                label: '确认',
                onClick: e => {
                    this.setState({showIOS1: false});
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
                onClick: this.MWithdrawsCash.bind(this)
            }],
            buttons3 = [{
                type: 'primary',
                label: '确认',
                onClick: e => {
                    this.setState({showIOS3: false});
                }
            }],
            buttons4 = [{
                type: 'default',
                label: '取消',
                onClick: e => {
                    this.setState({showIOS4: false});
                }
            }, {
                type: 'primary',
                label: '确认',
                onClick: e => {
                    this.ADDBankCard();
                    this.setState({showIOS4: false});
                }
            }];
        const bankItem = bankList.map((item, index) => {
            return (
                <div className="item f--hlc" key={index} onClick={() => {
                    this.setState({cardId: item.cardId})
                }}>
                    <div className="img"><img src={item.logo} alt=""/></div>
                    <div className="cardInfo">
                        <p>{item.bank}</p>
                        <p>{item.cardNumber} {item.type == "贷记卡" ? "信用卡" : "储蓄卡"}</p>
                    </div>
                    <div className={cardId == item.cardId ? "check" : ""}>
                        <i className="ic-choice-2"></i>
                    </div>
                </div>
            )
        });
        return (
            <Tab>
                <TabBody className="balance">
                    <div>
                        <div className="head f--h">
                            <div>
                                <p>余额</p>
                                <p>￥{(totalMoney / 10000 || 0).toFixed(0)}</p>
                            </div>
                            <div>
                                <Link to="/user_balance_detail">余额明细</Link>
                            </div>
                        </div>
                        <div className="content">
                            <div className="title f--hlc">
                                <span>我的银行卡</span>
                                {(bankList.length > 0) &&
                                <i className="ic-add" onClick={() => {
                                    this.isPhone()
                                }}></i>
                                }
                            </div>
                            <div className="bankCard">
                                {bankItem}
                                {!(bankList.length > 0) &&
                                <div className="add" onClick={() => {
                                    this.isPhone()
                                }}>
                                    <i className="ic-add"></i>
                                    <span>添加银行卡</span>
                                </div>
                                }
                            </div>
                            <div className="withdraw">
                                <div className="title">
                                    提现金额
                                </div>
                                <div className="money">
                                    <div>
                                        <input type="tel" value={quantity} onChange={(e) => {
                                            let value = e.target.value;
                                            if (Number(value) * 100 >= 1 || Number(value) == 0 || value == "") {
                                                if (value > 0) {
                                                    value = value.replace(/^0+/, "").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
                                                    (value > totalMoney / 10000) && ( value = totalMoney / 10000)
                                                    value = Number(value).toFixed(0);
                                                }else{
                                                    value = " ";
                                                }
                                                this.setState({quantity: value});
                                            }
                                        }}/>
                                    </div>
                                </div>
                                <div className="doc">
                                    <p className="mb5">最低提现金额为￥100，手续费为￥3。</p>
                                    <span onClick={() => this.refs['protocol'].show()}>《提现协议》</span>
                                    <i className="ic-i" onClick={()=>{this.refs['protocol'].show();}}></i>
                                </div>
                            </div>
                            <Dialog type="ios" title={protocols["Withdraw"]["title"]} buttons={buttons1} show={showIOS1}>
                                {protocols["Withdraw"]["text"]}
                            </Dialog>
                            <Dialog type="ios" title={"¥"+quantity} buttons={buttons2} show={showIOS2}>
                                确认提现？
                            </Dialog>
                            <Dialog type="ios" title={protocols["BindBank"]["title"]} buttons={buttons3} show={showIOS3}>
                                {protocols["BindBank"]["text"]}
                            </Dialog>
                            <Prompt AERR={{ErrShowIOS, ErrContent}}
                                    outFn={this.state.outFn.bind(this)} changShow={() => this.setState({ErrShowIOS: false})}/>
                            <Toast icon="success-no-circle" show={showToast}>{showToastText}</Toast>

                            <ProtocolPopUp ref='protocol' type='Withdraw'/>
                            <ProtocolPopUp ref='protocol1' type='BindBank'/>
                            <div onClick={() => {
                                this.setState({
                                    showIOS4: false
                                })
                            }}>
                                <Dialog type="ios" title="添加银行卡" buttons={buttons4} show={showIOS4} className="backList"
                                        onClick={(e) => e.stopPropagation()}>
                                    <div className="list">
                                        <div className="DialogShowHide" onClick={() => {
                                            this.setState({
                                                showIOS4: false
                                            })
                                        }}> &times;</div>
                                        <div className="f--hlc">
                                            <div className="flex-1">
                                                {userName}
                                            </div>
                                            <div>
                                                {idNumber}
                                            </div>
                                        </div>

                                        <div className="f--hlc">
                                            <div>
                                                卡号：
                                            </div>
                                            <div className="flex-1">
                                                <input type="number" placeholder="请输入银行卡号" value={cardNumber}
                                                       onChange={(e) => this.setState({cardNumber: e.target.value})}/>
                                            </div>
                                        </div>
                                        <p className="mt20"></p>
                                        {/*<div className="f--hlc">
                                            <div>
                                                手机号码：
                                            </div>
                                            <div className="flex-1">
                                                <input type="tel" placeholder="银行预留手机号" value={cardPhone}
                                                       onChange={(e) => this.setState({cardPhone: e.target.value})}/>
                                            </div>
                                        </div>
                                        <div className="f--hlc bind">
                                            <span onClick={() => {this.setState({showIOS4: false},()=>this.refs['protocol1'].show())}}>《绑定协议》</span>
                                        </div>*/}
                                    </div>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </TabBody>
                <TabBar>
                    <div className="sPurchase f--hcc">
                        <a href="JavaScript:history.go(-1)" className="goBack"><i className="ic-aeeow"></i></a>
                        <div className="btnHover btn" onClick={() => {
                            this.submit()
                        }}>
                            提现
                        </div>
                    </div>
                </TabBar>
            </Tab>
        );
    }
}
