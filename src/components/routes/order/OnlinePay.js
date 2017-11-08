import React from 'react';
import { Link, browserHistory } from 'react-router';
import {
    Tab, TabBody,TabBar
} from 'react-weui';
import setWXTitle from '../../WXTitle';
import {Req} from '../../../utils/request';
import {Prompt} from '../../public';
import {isRegExp, fullImage} from '../../../utils/util';
import "../../../styles/ListCell.scss";

export default class OnlinePay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            identity: '',
            cardName: '',
            ErrShowIOS:false,
            ErrContent:"",
            orderInfo: {},
        };
        this.allowClick = true;
        this.paymentCode = props.params.paymentCode;
        this.orderCode = props.params.orderId;

        this.onChangeInfo = this.onChangeInfo.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        setWXTitle("线上支付");
        Req.saleOrderDetail(this.orderCode).then(function (result) {
            let orderInfo = {};
            orderInfo.saleOrderCode = result['saleOrderCode'];
            orderInfo.packName = result['interior']['interiorName'];
            orderInfo.saleAmount = result['saleAmount'];
            orderInfo.packImage = result['interior']['interiorImage'];
            this.setState({
                orderInfo: orderInfo
            })
        }.bind(this)).catch(function(){
            //failed
        });
    }

    onChangeInfo(type, e) {
        let value = e.target.value;
        let state = {};
        switch (type) {
            case 'i':
                //id
                state.identity = value;
                break;
            case 'n':
                //name
                state.cardName = value;
                break;
        }
        if(Object.keys(state).length>0){
            this.setState(state);
        }
    }

    onSubmit(){
        const {identity,cardName} = this.state;
        if(!isRegExp("name",cardName)){
            this.setState({
                ErrShowIOS:true,
                ErrContent:"请输入两位以上的真实姓名！"
            });
            return
        }
        if(!isRegExp("CardNo",identity)){
            this.setState({
                ErrShowIOS:true,
                ErrContent:"请输入真实的身份证号码！"
            });
            return
        }
        if(this.allowClick&&isRegExp("name",cardName)&&isRegExp("CardNo",identity)) {
            this.allowClick = false;
            let data = {'paymentCode':this.paymentCode, 'idNo': this.state.identity, 'acctName': this.state.cardName};
            Req.lianLianOnlinePay(data, true).catch(function(){
                //TODO: failed
                this.allowClick = true;
            }.bind(this));
        }
    }
    BtnREG(isname){
        const {cardName,identity} = this.state;
        if(isname){
            return this.state[isname].length > 0;
        }
        return ((cardName.length >0) && (identity.length >0));
    }

    onBackOrderList() {
        browserHistory.push('/order_list/');
    }

    render() {
        const {ErrShowIOS,ErrContent,cardName, identity} = this.state;
        return (
            <Tab>
                <TabBody>
                    <div className="ListCell pay-cell">
                        <div className="list pay-list">
                            {
                                Object.keys(this.state.orderInfo).length === 0
                                    ? <div className='order-info loading-order'>
                                    加载订单信息...
                                </div>
                                    : <div className='order-info'>
                                    <div className='f--hlc order-group'>
                                        <div className='order-item order-code'>
                                            订单编号：<span>{this.state.orderInfo.saleOrderCode}</span>
                                        </div>
                                        <div className='order-item order-amount'>
                                            <span>¥ {this.state.orderInfo.saleAmount / 10000}</span>
                                        </div>
                                    </div>
                                    <div className='f--h pack-group'>
                                        <div className='f--hcc order-image'>
                                            <img src={fullImage(this.state.orderInfo.packImage)} />
                                        </div>
                                        <div className='order-item order-pack-name'>
                                            <span>{this.state.orderInfo.packName}</span>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className='pay-separator'></div>
                            <div className="title" style={{fontSize:"14px"}}>银行卡快捷支付</div>
                            <div className="item">
                                <div>
                                    <span>持卡人姓名：</span>
                                    <input className={!this.BtnREG("cardName")&&"error"} value={this.state.cardName} onChange={this.onChangeInfo.bind(this, 'n')}
                                           type="text" placeholder="持卡人姓名"/>
                                </div>
                                <div>
                                    <span>身份证号码：</span>
                                    <input className={!this.BtnREG("identity")&&"error"} value={this.state.identity} onChange={this.onChangeInfo.bind(this, 'i')}
                                           type="text" placeholder="持卡人身份证"/>
                                </div>
                                {/*<div>*/}
                                    {/*<span>卡号：</span>*/}
                                    {/*<input value={this.state.identity} onChange={this.onChangeInfo.bind(this, 'c')}*/}
                                        {/*type="text" placeholder="无需网银／免手续费"/>*/}
                                {/*</div>*/}
                                {/*<div>*/}
                                    {/*<span>手机号码：</span>*/}
                                    {/*<input type="text" placeholder="银行预留手机号"/>*/}
                                {/*</div>*/}
                                {/*<div>*/}
                                    {/*<span>验证码：</span>*/}
                                    {/*<input type="text" />*/}
                                    {/*<span className="btn textHover">获取验证码</span>*/}
                                {/*</div>*/}
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div className="Purchase pay-purchase">
                        <div className={"btnHover "+ (!this.BtnREG()&&"DidNotREG")} onClick={this.onSubmit}>
                            <span>下一步</span>
                        </div>
                    </div>
                    <div className="return" onClick={this.onBackOrderList}>
                        <i className="ic-aeeow-32-white" />
                    </div>
                    <Prompt AERR={{ErrShowIOS,ErrContent}} changShow={()=>this.setState({ErrShowIOS:false})} />
                </TabBody>
            </Tab>
        )
    }
}
