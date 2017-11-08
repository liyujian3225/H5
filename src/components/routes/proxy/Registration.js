/**
 * Created by StupidBoy on 2017/4/3.
 */
import React from 'react';
import {Link, browserHistory} from 'react-router';
import {
    Tab, TabBody, TabBar, Dialog, Toast
} from 'react-weui';
import {Req} from '../../../utils/request';
import {isRegExp, setCookie,getCookie} from '../../../utils/util';
import "../../../styles/ListCell.scss";
import PhoneCodeButton from '../widget/PhoneCodeButton';
import setWXTitle from '../../WXTitle';
import ProtocolPopUp from '../widget/ProtocolPopUp';
import {Prompt} from '../../public';

export default class AddRess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            DialogShow: false,
            protocolCheck: true,
            showToast: false,
            cellPhone: getCookie("phone"),
            phone: getCookie("phone")?getCookie("phone"):"",
            idNumber: "",
            cardNumber: "",
            phoneCode: "",
            name: "",
            errTitle: "",
            ErrShowIOS: false,
            ErrContent: "",
            outFn:()=>{}
        };
        this.toastTimer = "";
    }

    componentDidMount() {
        setWXTitle("代理人注册")
    }

    getPhoneCodeInfo() {
        let {phone} = this.state;
        return {phone};
    }

    disablePhoneCodeBtn() {
        let {phone} = this.state;
        return (phone === '');
    }

    submit() {
        const {phone, idNumber, cardNumber, phoneCode, name,cellPhone} = this.state;
        let params = {name, idNumber,phoneCode,phone};
        if (!(name.length > 1)) {
            this.setState({
                ErrShowIOS: true,
                ErrContent: "请输入正确的姓名！",
            })
            return;
        }
        if (!isRegExp("CardNo", idNumber)) {
            this.setState({
                ErrShowIOS: true,
                ErrContent: "请输入正确的身份证号码！",
            })
            return;
        }
        if (!isRegExp("phoneCode", phoneCode)) {
            this.setState({
                ErrShowIOS: true,
                ErrContent: "请输入正确的验证码！",
            })
            return;
        }
        /*if (!(cardNumber.length > 1)) {
            this.setState({
                ErrShowIOS: true,
                ErrContent: "请输入正确的卡号！",
            })
            return;
        }
        */
        if (!cellPhone){
            if (!isRegExp("phone", phone)) {
                this.setState({
                    ErrShowIOS: true,
                    ErrContent: "请输入正确的手机号码！",
                })
                return;
            }
        }

        Req.MAgenter(params).then(function (result) {
            setCookie("_MCH_AT", result);
            setCookie("phone",phone);
            this.setState({
                showToast: false,
                ErrShowIOS: true,
                errTitle:"认证通过",
                ErrContent:"恭喜您已经成为代理人！",
                outFn:()=> browserHistory.push("/user_center"),
            });
        }.bind(this)).catch(function (code) {
            console.log(code);
            this.setState({
                ErrShowIOS: true,
                ErrContent: code.msg,
            })

        }.bind(this));
    }

    render() {
        const {DialogShow, protocolCheck, showToast, ErrShowIOS, outFn, ErrContent,errTitle,cellPhone,phone} = this.state;
        return (
            <Tab>
                <TabBody>
                    <div className="ListCell fs16">
                        <div className="list" style={{border:"0"}}>
                            <div className="item">
                                <div>
                                    <span>姓名：</span>
                                    <input type="text" placeholder="请输入你的真实姓名" onChange={(e) => {
                                        this.setState({
                                            name: e.target.value
                                        })
                                    }}/>
                                </div>
                                <div>
                                    <span>身份证：</span>
                                    <input type="text" placeholder="请输入你的身份证号" onChange={(e) => {
                                        this.setState({
                                            idNumber: e.target.value
                                        })
                                    }}/>
                                </div>
                                {/*<div>
                                    <span>卡号：</span>
                                    <input type="number" placeholder="绑定银行卡号" onChange={(e) => {
                                        this.setState({
                                            cardNumber: e.target.value
                                        })
                                    }}/>
                                </div>*/}
                                <div>
                                    <span>手机号码：</span>
                                    <input type="tel" placeholder="请输入你的手机号码" disabled={cellPhone? true:false} value={phone} onChange={(e) => {
                                        this.setState({
                                            phone: e.target.value
                                        })
                                    }}/>
                                </div>
                                <div>
                                    <span>验证码：</span>
                                    <span className="flex-1">
                                        <input type="number" className="checkInput" onChange={(e) => {
                                            this.setState({
                                                phoneCode: e.target.value
                                            })
                                        }}/>
                                    </span>
                                    <span>
                                        <PhoneCodeButton className='btn textHover flex-1' info={this.getPhoneCodeInfo()}/>
                                    </span>
                                </div>
                                <div className="protocol">
                                    <div className="radio weui-cells_checkbox">
                                        <input type="checkbox" className="weui-check checkInput" name="checkbox"
                                               value="2"
                                               onChange={() => {
                                                   this.setState({
                                                       protocolCheck: !protocolCheck
                                                   })
                                               }} checked={protocolCheck}/>
                                        <span className="weui-icon-checked"></span>
                                    </div>
                                    <span>
                                        我同意
                                    </span>
                                    <span onClick={() => {
                                        //this.setState({DialogShow: true})
                                        this.refs['protocol'].show()
                                    }}>《代理协议条款》</span>
                                    <i className="ic-i" onClick={()=>{this.refs['protocol'].show();}}></i>
                                    <Dialog type="ios" title={"代理协议条款"} buttons={[
                                        {
                                            label: '我同意以上协议',
                                            onClick: () => {
                                                this.setState({
                                                    DialogShow: false,
                                                    protocolCheck: true
                                                })
                                            }
                                        }
                                    ]} show={DialogShow}>
                                        买卖协议书范本,就业协议书范本,承揽协议书范本,赠与协议书范本,借款协议书范本,租赁协议书范本,融资租赁协议书范本,建设工程协议书范本,运输协议书范本,技术协议书范本,仓储保管协议书范本,出版与专利协议书范本,行纪协议书范本,劳务协议书范本,保险协议书范本及其他一些常用无名协议书范本
                                    </Dialog>
                                    <Toast icon="success-no-circle" show={showToast}>注册成功</Toast>
                                    <ProtocolPopUp ref='protocol' type='Proxy'/>
                                    <Prompt AERR={{ErrShowIOS, ErrContent,errTitle}}
                                            outFn={outFn.bind(this)} changShow={() => this.setState({ErrShowIOS: false})}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabBody>
                <TabBar className="noBackground">
                    <div className="sPurchase f--hcc">
                        <a href="JavaScript:history.go(-1)" className="goBack"><i className="ic-aeeow"></i></a>
                        <div className="btnHover btn" onClick={() => {
                            this.submit()
                        }}>
                            <span>代理人认证</span>
                        </div>
                    </div>
                </TabBar>
            </Tab>
        )
    }
}
