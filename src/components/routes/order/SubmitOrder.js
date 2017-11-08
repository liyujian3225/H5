import React from 'react';
import {Link, browserHistory} from 'react-router';
import {
    Tab, TabBody, TabBar, Dialog,
    Panel,
    PanelHeader,
    PanelBody,
    PanelFooter,
    MediaBox,
    MediaBoxHeader,
    MediaBoxBody,
    MediaBoxTitle,
    MediaBoxDescription,
    MediaBoxInfo,
    MediaBoxInfoMeta,
    Cells,
    Cell,
    CellBody,
    CellFooter,
    Toptips
} from 'react-weui';
import {Req} from '../../../utils/request';
import {fullImage,isRegExp} from '../../../utils/util';
import {protocols} from '../../../utils/word';
import {Prompt} from '../../public';
import setWXTitle from '../../WXTitle';
import ProtocolPopUp from '../widget/ProtocolPopUp';
import "../../../styles/order.scss";

export default class SubmitOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showIOS2: false,
            showIOS3: false,
            showIOS4: false,
            DialogShow: false,
            paymentType: "FULLPAY",
            paymentPlatform: "BANKPAY_NO",
            productMoreBol: false,
            premisesRess: "",
            addressId: "",
            cellphone: "",
            address: "",
            ressName: "",
            agentCellphone: "",
            interior: {},
            ErrShowIOS:false,
            ErrContent:"",
            ToptipsArr: {
                show: false,
                type: "warn",
                content: ""
            },
        }
    }

    getStorage(name) {
        //从storage获取套餐信息
        if (!window.localStorage) {
            alert("请升级浏览器");
            browserHistory.push('/');
            return false;
        } else {
            const storage = window.localStorage;
            if (storage[name]) {
                return storage[name];
            } else {
                browserHistory.push('/');
            }
        }
    }

    getPremisesRess() {
        //获取楼盘地址
        Req.premisesAddress(this.state.premisesId).then(function (result) {
            const premisesRess = result.province.name + result.city.name + result.area.name + result.address;
            this.setState({
                premisesRess: premisesRess
            })
        }.bind(this))
    }

    getRessList() {
        //获取地址列表
        Req.customerAddress().then(function (result) {
            if (result[0]) {
                const {addressId, cellphone, address, name} = result[0];
                this.setState({
                    addressId,
                    cellphone,
                    address,
                    ressName: name
                })
            }
        }.bind(this)).catch(function (code) {
            // console.log(code);
        }.bind(this));
    }

    addSubmit() {
        //确认提交订单

        const {aipId, addressId,agentCellphone} = this.state;
        !aipId && ( this.setState({
            ErrShowIOS:true,
            ErrContent:"请重新选择软装套餐！"
        }));
        !addressId && ( this.setState({
            ErrShowIOS:true,
            ErrContent:"请选择收货地址！"
        }))
        if(!(isRegExp("phone",agentCellphone)|| agentCellphone =="")){
            this.setState({
                ErrShowIOS:true,
                ErrContent:"请输入11位推荐人手机号码！"
            });
            return;
        }
        if ((!aipId ) || (!addressId )) {
            return false;
        }
        this.setState({showIOS2: true})
    }

    oSubmitOrder() {
        //提交订单
        const {aipId, addressId, agentCellphone, paymentType, aipPrice, insuranceAmount, paymentPlatform} = this.state;
        const aipAmount = aipPrice, saleAmount = aipPrice;

        Req.saleOrderSmart({
            aipId,
            addressId,
            agentCellphone,
            paymentType,
            aipAmount,
            saleAmount,
            paymentPlatform
        }).then(function (result) {
            if(result&&result['saleOrderCodeVos']&&result['saleOrderCodeVos'].length>0) {
                let paymentCode = result['saleOrderCodeVos'][0]['paymentCode'];
                let saleOrderId = result['saleOrderCodeVos'][0]['saleOrderId'];
                if (paymentPlatform == "BANKPAY_NO") {
                    //线上支付
                    browserHistory.push('/online_pay/'+saleOrderId+'/'+paymentCode);
                } else {
                    //线下支付
                    browserHistory.push("/offline_pay/"+saleOrderId+'/'+paymentCode);
                }
            }
        }.bind(this)).catch(function (code) {
            console.log(code);
            if (code == 508) {
                alert("订单发生变化，请重新提交订单");
            }
        }.bind(this));
    }

    componentDidMount() {
        setWXTitle("提交订单")
        this.setState(JSON.parse(this.getStorage("packageInfo")||"{}"), () => {
            this.getPremisesRess()
        });
        this.getRessList()

    }

    render() {
        const {DialogShow, paymentPlatform, productMoreBol, interior, aipPrice, aipItemList, paymentType, addressId, premisesRess, cellphone, address, ressName, ToptipsArr,prepayPersent,agentCellphone,uxuanPrice,ErrShowIOS,ErrContent} = this.state;
        const {interiorImage, interiorName, description} = interior;
        const appMsgIcon = <img src={fullImage(interiorImage)}/>;
        const title = paymentType == "FULLPAY" ? "支付全额" : paymentType == "PREPAY" ? "支付预付款" : "尾款支付",
            buttons = [{
                type: 'default',
                label: '取消',
                onClick: e => {
                    this.setState({showIOS2: false});
                }
            }, {
                type: 'primary',
                label: '确认',
                onClick: e => {
                    this.setState({showIOS2: false});
                    this.oSubmitOrder();
                    // if (paymentPlatform == "BANKPAY_NO") {
                        // browserHistory.push("/bank_card/900");
                    // } else {
                        // browserHistory.push("/offline_pay/900");
                    // }
                }
            }],
            buttons2 = [{
                type: 'primary',
                label: '确认',
                onClick: e => {
                    this.setState({showIOS3: false});
                }
            }],
            buttons3 = [{
                type: 'primary',
                label: '确认',
                onClick: e => {
                    this.setState({showIOS4: false});
                }
            }];
        const inventoryList = (aipItemList && aipItemList.length > 0 ? ( productMoreBol ? aipItemList : aipItemList.slice(0, 2)) : []).map((item, index) => (
            <div key={index}>
                <div className="inventory_hd"><img src={fullImage(item.product.productImage)}/></div>
                <div className="inventory_bd">
                    {item.product.productName} &times;{item.quantity}
                </div>
                <div className="inventory_ft">
                    ￥{item.product.consumerPrice / 10000}
                </div>
            </div>
        ))
        return (
            <Tab style={{position: "relative"}}>
                <TabBody className="SubmitOrder">
                    <div>
                        <div className="ress">
                            <p>收货地址</p>
                            <div className="detailed">
                                {addressId > 0 ? <div className="detailedRess" onClick={()=>{
                                    browserHistory.push("/add_ress")
                                    }}>
                                        <div>
                                            <p>
                                                <span>{ressName}</span>
                                                <span>{cellphone}</span>
                                            </p>
                                            <p>{premisesRess}{address}</p>
                                        </div>
                                        <div>
                                            <Link to="/add_ress" className="cell_ft"></Link>
                                        </div>
                                    </div> :
                                    <Link to="/add_ress" className="addRess">添加收货地址</Link>
                                }
                            </div>
                        </div>
                        <div className="scheme">
                            <Panel>
                                <PanelHeader>
                                    套餐详情
                                </PanelHeader>
                                <PanelBody>
                                    <MediaBox type="appmsg" href="javascript:void(0);">
                                        <MediaBoxHeader>{appMsgIcon}</MediaBoxHeader>
                                        <MediaBoxBody>
                                            <MediaBoxTitle>{interiorName}</MediaBoxTitle>
                                            <MediaBoxDescription>
                                                {description}
                                            </MediaBoxDescription>
                                        </MediaBoxBody>
                                        <div className="money">
                                            ￥{aipPrice / 10000}
                                        </div>
                                    </MediaBox>
                                </PanelBody>
                                <PanelFooter href="javascript:void(0);">
                                    <div className="more"  onClick={() => {
                                        this.setState({
                                            productMoreBol: !productMoreBol
                                        })
                                    }}>
                                        <div>套装清单</div>
                                        <div>
                                            <i className={`cell_ft ${productMoreBol && "active"}`}></i>
                                        </div>
                                    </div>
                                    <div className="inventory">
                                        {inventoryList}
                                    </div>
                                </PanelFooter>
                            </Panel>
                        </div>

                        <Cells className="GiftU">
                            <Cell>
                                <CellBody>
                                    <span>订单总额</span>
                                </CellBody>
                                <CellFooter className="fb7">
                                    ￥{aipPrice/10000}
                                </CellFooter>
                            </Cell>
                        </Cells>
                        <Cells className="GiftU">
                            <Cell>
                                <CellBody>
                                    <span>赠送优币</span>
                                    <i className="ic-i" onClick={()=>{
                                        //this.setState({showIOS4:true});
                                        this.refs['protocol'].show()
                                    }} ></i>
                                </CellBody>
                                <CellFooter>
                                    {uxuanPrice/10000}
                                </CellFooter>
                            </Cell>
                        </Cells>

                        <div className="recommend">
                            <span>
                                推荐人：
                            </span>
                            <input type="tel" placeholder="请输入推荐人手机号码" className={(isRegExp("phone",agentCellphone)||agentCellphone =="")?"":"error"}
                                   onChange={(e) => this.setState({agentCellphone: e.target.value})} maxLength="11"/>
                        </div>
                        <div className="payment_method">
                            <Cells>
                                <Cell access  onClick={() => {
                                    this.setState({
                                        DialogShow: true
                                    })
                                }}>
                                    <CellBody>
                                        <span className="img mr10"><img src={`/images/${paymentPlatform == "BANKPAY_NO"?"ic-unionpay":"ic-pos"}.png`} alt=""/></span>支付方式
                                    </CellBody>
                                    <CellFooter>
                                        {paymentPlatform == "BANKPAY_NO" ? "线上支付" : "POS机刷卡"}
                                    </CellFooter>
                                </Cell>
                                <div className="payment_method_list">
                                    <div className="all" onClick={() => {
                                        this.setState({
                                            paymentType: "FULLPAY",
                                        })
                                    }}>
                                        <div className="img"></div>
                                        <div className="text">支付全额</div>
                                        <div className="radio weui-cells_checkbox">
                                            <input type="checkbox" className="weui-check" name="checkbox" value="2"
                                                   onChange={() => {
                                                   }} checked={paymentType == "FULLPAY"}/>
                                            <span className="weui-icon-checked"></span>
                                        </div>
                                    </div>
                                    <div className="section" onClick={() => {
                                        this.setState({
                                            paymentType: "PREPAY",
                                        })
                                    }}>
                                        <div className="img"></div>
                                        <div className="text">
                                            支付预付款
                                            <i className="ic-i" onClick={()=>{
                                                //this.setState({showIOS3:true});
                                                this.refs['protocol1'].show()
                                            }} ></i>
                                        </div>
                                        <div className="radio weui-cells_checkbox">
                                            <input type="checkbox" className="weui-check" name="checkbox" value="2"
                                                   onChange={() => {
                                                   }} checked={paymentType == "PREPAY"}/>
                                            <span className="weui-icon-checked"></span>
                                        </div>
                                    </div>
                                </div>
                            </Cells>
                            <div onClick={() => {
                                this.setState({
                                    DialogShow: false
                                })
                            }}>
                                <Dialog type="ios" title="支付方式" buttons={[]} show={DialogShow} className="pay_type"
                                        onClick={(e) => e.stopPropagation()}>
                                    <div className="list">
                                        <div className="DialogShowHide" onClick={()=>{
                                            this.setState({
                                                DialogShow: false
                                            })
                                        }}> &times;</div>
                                         <div className="f--hlc" onClick={() => {
                                            this.setState({
                                                paymentPlatform: "BANKPAY_QR",
                                                DialogShow: false
                                            })
                                        }}>
                                            <div>
                                                <img src="/images/ic-pos.png" alt=""/>
                                                POS机刷卡
                                            </div>
                                            <div className="radio weui-cells_checkbox">
                                                <input type="checkbox" className="weui-check" name="checkbox" value="1"
                                                       onChange={() => {
                                                       }} checked={paymentPlatform == "BANKPAY_QR"}/>
                                                <span className="weui-icon-checked"></span>
                                            </div>
                                        </div>
                                        <div className="f--hlc" onClick={() => {
                                            this.setState({
                                                paymentPlatform: "BANKPAY_NO",
                                                DialogShow: false
                                            })
                                        }}>
                                            <div>
                                                <img src="/images/ic-unionpay.png" alt=""/>
                                                线上支付
                                            </div>
                                            <div className="radio weui-cells_checkbox">
                                                <input type="checkbox" className="weui-check" name="checkbox" value="2"
                                                       onChange={() => {
                                                       }} checked={paymentPlatform == "BANKPAY_NO"}/>
                                                <span className="weui-icon-checked"></span>
                                            </div>
                                        </div>
                                       

                                    </div>
                                </Dialog>
                            </div>
                        </div>

                        <div></div>
                        {/*<div className="orderMoney">
                         <div className="money">
                         <div>
                         <span>订单总额</span>
                         <span>￥515</span>
                         </div>
                         <div>
                         <span>减免金额</span>
                         <span>￥150</span>
                         </div>
                         </div>
                         <div className="total">
                         <span>合计</span>
                         <span>￥{aipPrice/10000}</span>
                         </div>
                         </div>*/}
                        {/*<div className="insurance">
                         <div>
                         <div>赠送客户质量保障险</div>
                         <div>保险费 150.0</div>
                         </div>
                         <div>
                         <span>查看详情</span>
                         </div>
                         </div>*/}
                    </div>

                    <Dialog type="ios" title={protocols["Prepayments"]["title"]} buttons={buttons2} show={this.state.showIOS3}>
                        {protocols["Prepayments"]["text"]}
                    </Dialog>
                    <Dialog type="ios" title={protocols["Presentation"]["title"]} buttons={buttons3} show={this.state.showIOS4}>
                        {protocols["Presentation"]["text"]}
                    </Dialog>
                    <Prompt AERR={{ErrShowIOS,ErrContent}} changShow={()=>this.setState({ErrShowIOS:false})} />
                </TabBody>
                <TabBar className="SubmitOrderBar">
                    <div className="tatal_tabbar">
                        <div onClick={()=>browserHistory.go(-1)}>
                            <i className="ic-aeeow-24-white"></i>
                        </div>
                        <div>
                            实付：<span>￥{paymentType  == "FULLPAY" ?( aipPrice / 10000 ).toFixed(2):
                            ((aipPrice / 10000)  * (prepayPersent/1000000) > 0.01 ?(aipPrice / 10000)  * (prepayPersent/1000000):0.01).toFixed(2)}
                            </span>
                        </div>
                        <div className="btn btnHover" onClick={e => {
                            this.addSubmit()
                        }}>
                            <span>确认订单</span>
                        </div>
                    </div>
                </TabBar>
                <Dialog className="DialogMoney" type="ios" title={"￥"+(paymentType  == "FULLPAY" ? (aipPrice / 10000 ).toFixed(2):
                    ((aipPrice / 10000)  * (prepayPersent/1000000) > 0.01 ?(aipPrice / 10000)  * (prepayPersent/1000000):0.01).toFixed(2))} buttons={buttons} show={this.state.showIOS2}>
                    您确定支付吗?
                </Dialog>
                <Toptips show={ToptipsArr.show || false} type={ToptipsArr.type || "warn"}>
                    {ToptipsArr.content}
                </Toptips>

                <ProtocolPopUp ref='protocol' type='Presentation'/>
                <ProtocolPopUp ref='protocol1' type='Prepayments'/>
            </Tab>
        );
    }
}
