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
import {fullImage} from '../../../utils/util';
import setWXTitle from '../../WXTitle';
import "../../../styles/order.scss";
import ProtocolPopUp from '../widget/ProtocolPopUp';

export default class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showIOS2: false,
            showIOS3: false,
            showIOS4: false,
            showIOS5: false,
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
            saleOrderPayment: {},
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
        const {aipId, addressId} = this.state;
        // !aipId && ( this.setState({
        //     ToptipsArr: {
        //         show: true,
        //         type: "warn",
        //         content: "请重新选择软装套餐！"
        //     }
        // }, () => {
        //     setTimeout(() => {
        //         this.setState({ToptipsArr: {show: false}})
        //     }, 2000)
        // }));
        // !addressId && ( this.setState({
        //     ToptipsArr: {
        //         show: true,
        //         type: "warn",
        //         content: "请选择收货地址！"
        //     }
        // }, () => {
        //
        //     setTimeout(() => {
        //         this.setState({ToptipsArr: {show: false}})
        //     }, 2000)
        // }))
        // if ((!aipId ) || (!addressId )) {
        //     return false;
        // }
        this.setState({showIOS2: true})
    }

    oSubmitOrder() {
        //提交订单
        const {paymentPlatform, saleOrderPayment} = this.state;

        if (saleOrderPayment && saleOrderPayment.paymentCode > 0) {
            const paymentCode = saleOrderPayment.paymentCode;
            const saleOrderId = this.props.params.saleOrderId;

            if (paymentPlatform == "BANKPAY_NO") {
                //线上支付
                browserHistory.push('/online_pay/' +saleOrderId+'/'+ paymentCode);
            } else {
                //线下支付
                browserHistory.push("/offline_pay/" +saleOrderId+'/'+ paymentCode);
            }
        }
    }

    getOrderDetail() {
        //获取订单详情
        const saleOrderId = this.props.params.saleOrderId;
        Req.saleOrderDetail(saleOrderId).then(function (result) {
            let params = result;

            params["paymentPlatform"] = params["paymentPlatform"]["name"];
            params["premisesId"] = params["aipPack"]["premisesId"];
            params["aipItemList"] = params["saleOrderItems"];
            params["aipPrice"] = params["saleAmount"];
            params["paymentType"] = params["paymentType"]["name"];
            params["salePaymentType"] = params["saleOrderStatus"]["name"];
            params["receiveCellphone"] = params["receiveCellphone"];
            params["address"] = params["receiveAddressFinal"];
            params["ressName"] = params["receiveName"];
            params["saleOrderPayment"] =((params["paymentType"] =="PREPAY")?params["saleOrderPayments"].filter((item)=>{
                    return params["salePaymentType"] == "NEW"? (item.paymentType.name =="PREPAY"):(item.paymentType.name =="BALANCEPAY")
                }) : params["saleOrderPayments"])[0];

            setWXTitle("订单详情--" + params.interior.interiorName);
            this.setState(params, () => this.getPremisesRess());
        }.bind(this)).catch(function (code) {
            console.log(code);
            if (code == 508) {
                alert("订单发生变化，请重新提交订单");
            }
        }.bind(this));
    }

    saleOrderIdStatus() {
        const {saleOrderId} = this.state;
        Req.saleOrderIdStatus([saleOrderId, {
            "saleOrderStatus": "REFUND",
            "note": "申请退款"
        }]).then(function (result) {
            //this.getList()
            browserHistory.go(-1)
        }.bind(this))
    }

    componentDidMount() {
        this.getOrderDetail()
        // console.log(JSON.parse(this.getStorage("packageInfo")))
        // this.setState(JSON.parse(this.getStorage("packageInfo")||"{}"), () => {
        //     this.getPremisesRess()
        // })
        // this.getRessList()
    }

    render() {
        const {DialogShow, paymentPlatform, productMoreBol,aipId, interior, aipPrice, aipItemList, paymentType, saleOrderPayment, refund, premisesRess, agentCellphone, receiveCellphone, address, ressName, ToptipsArr, saleOrderStatus, salePaymentType,uxuanPrice} = this.state;
        const {interiorImage, interiorName, intro} = interior;
        const appMsgIcon = <img src={fullImage(interiorImage)}/>;
        const title = paymentType == "FULLPAY" ? "支付全额" : paymentType == "PREPAY" ? "支付预付款" : "尾款支付",
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
                    this.setState({showIOS2: false});
                    this.oSubmitOrder();
                }
            }],
            buttons3 = [{
                type: 'primary',
                label: '确认',
                onClick: e => {
                    this.setState({showIOS3: false});
                }
            }],
            buttons4 = [{
                type: 'primary',
                label: '确认',
                onClick: e => {
                    this.setState({showIOS4: false});
                }
            }],
            buttons5 = [{
                type: 'default',
                label: '取消',
                onClick: e => {
                    this.setState({showIOS5: false});
                }
            }, {
                type: 'primary',
                label: '确认',
                onClick: e => {
                    this.setState({showIOS5: false});
                    this.saleOrderIdStatus()
                }
            }];
        const inventoryList = (aipItemList && aipItemList.length > 0 ? ( productMoreBol ? aipItemList : aipItemList.slice(0, 2)) : []).map((item, index) => (
            <div key={index} onClick={()=>{
                 browserHistory.push("/commodity_detail/"+aipId+"/"+item.productId)
            }}>
                <div className="inventory_hd"><img src={fullImage(item.productImage)}/></div>
                <div className="inventory_bd">
                    {item.productName} &times;{item.quantity}
                </div>
                <div className="inventory_ft">
                    ￥{item.orderPrice / 10000}
                </div>
            </div>
        ));
        return (
            <Tab>
                <TabBody className="SubmitOrder OrderDetail"
                         style={{borderBottom: (saleOrderStatus && (saleOrderStatus.code == 3010 || saleOrderStatus.code == 3016 )) ? "50px solid #f8f9fa" : "0"}}>
                    <div>
                        <div className="ress">
                            <p>收货地址</p>
                            <div className="detailed">
                                <div className="detailedRess">
                                    <div>
                                        <p>
                                            <span>{ressName}</span>
                                            <span>{receiveCellphone}</span>
                                        </p>
                                        <p>{premisesRess}{address}</p>
                                    </div>
                                    {/*<div>*/}
                                        {/*<Link className="cell_ft"></Link>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                        <Cells className="GiftU">
                            <Cell>
                                <CellBody>
                                    <span>订单总额</span>
                                </CellBody>
                                <CellFooter className="fb7">
                                    ￥{aipPrice / 10000}
                                </CellFooter>
                            </Cell>
                        </Cells>
                        <Cells className="GiftU">
                            <Cell>
                                <CellBody>
                                    <span>赠送优币</span>
                                    <i className="ic-i" onClick={() => {
                                        //this.setState({showIOS4: true});
                                        this.refs['protocol'].show()
                                    }}></i>
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
                            <input type="tel" placeholder="推荐人手机号码" value={agentCellphone||""} disabled="true" />
                        </div>
                        <div className="payment_method">
                            <Cells>
                                <Cell access>
                                    <CellBody>
                                        <span className="img mr10"><img
                                            src={`/images/${paymentPlatform == "BANKPAY_NO" ? "ic-unionpay" : "ic-pos"}.png`}
                                            alt=""/></span>支付方式
                                    </CellBody>
                                    <CellFooter onClick={() => {
                                        this.setState({
                                            //DialogShow: true
                                        })
                                    }}>
                                        {paymentPlatform == "BANKPAY_NO" ? "线上支付" : "POS机刷卡"}
                                    </CellFooter>
                                </Cell>
                                <div className="payment_method_list">
                                    {paymentType == "FULLPAY" &&
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
                                    }
                                    {paymentType == "PREPAY" &&
                                    <div className="section" onClick={() => {
                                        this.setState({
                                            paymentType: "PREPAY",
                                        })
                                    }}>
                                        <div className="img"></div>
                                        <div className="text">
                                            支付预付款
                                            <i className="ic-i" onClick={() => {
                                                //this.setState({showIOS3: true});
                                                this.refs['protocol1'].show();
                                            }}></i>
                                        </div>
                                        <div className="radio weui-cells_checkbox">
                                            <input type="checkbox" className="weui-check" name="checkbox" value="2"
                                                   onChange={() => {
                                                   }} checked={paymentType == "PREPAY"}/>
                                            <span className="weui-icon-checked"></span>
                                        </div>
                                    </div>
                                    }
                                </div>
                            </Cells>
                            <div onClick={() => {
                                this.setState({
                                    DialogShow: false
                                })
                            }}>
                                <Dialog title="支付方式" buttons={[]} show={DialogShow} className="pay_type"
                                        onClick={(e) => e.stopPropagation()}>
                                    <div className="list">
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

                                    </div>
                                </Dialog>
                            </div>
                        </div>
                        <div className="scheme">
                            <Panel>
                                <PanelHeader>
                                    套餐详情
                                </PanelHeader>
                                <PanelBody>
                                    <MediaBox type="appmsg" href="javascript:void(0);" onClick={()=>{
                                        browserHistory.push("/package/"+aipId)
                                    }}>
                                        <MediaBoxHeader>{appMsgIcon}</MediaBoxHeader>
                                        <MediaBoxBody>
                                            <MediaBoxTitle>{interiorName}</MediaBoxTitle>
                                            <MediaBoxDescription>
                                                {intro}
                                            </MediaBoxDescription>
                                        </MediaBoxBody>
                                        <div className="money">
                                            ￥{aipPrice / 10000}
                                        </div>
                                    </MediaBox>
                                </PanelBody>
                                <PanelFooter href="javascript:void(0);">
                                    <div className="more" onClick={() => {
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
                    <Dialog type="ios" title={"预付款协议"} buttons={buttons3} show={this.state.showIOS3}>
                        预付款协议预付款协议预付款协议预付款协议预付款协议
                    </Dialog>

                    <Dialog type="ios" title={"优币赠送协议"} buttons={buttons4} show={this.state.showIOS4}>
                        优币赠送协议优币赠送协议优币赠送协议优币赠送协议优币赠送协议
                    </Dialog>


                </TabBody>
                <TabBar className="OrderDetail SubmitOrderBar">
                    {(saleOrderStatus && (saleOrderStatus.code == 3010 || saleOrderStatus.name == "NEW" || saleOrderStatus.code == 3016 || saleOrderStatus.name == "PREPAID" )) &&
                    <div className="tatal_tabbar">
                        <div onClick={()=>browserHistory.go(-1)}>
                            <i className="ic-aeeow-24-white"></i>
                        </div>
                        <div>
                            实付：<span>￥{( saleOrderPayment.paymentFee / 10000 ).toFixed(2)}
                            </span>
                        </div>
                        {(salePaymentType == "PREPAID" && refund >0) &&
                        <div className="btn btnHover notContract" onClick={e => {
                            this.setState({showIOS5:true})
                        }}>
                            <span>申请退款</span>
                        </div>
                        }
                        <div className="btn btnHover" onClick={e => {
                            this.addSubmit()

                        }}>
                            <span>{salePaymentType == "NEW" ? (paymentType == "PREPAY" ? "支付预付款" : "付款") : salePaymentType == "PREPAID" || salePaymentType == "VIOLATE" ? "支付尾款" : "付款"}</span>
                        </div>
                    </div>
                    }
                </TabBar>
                <Dialog className="DialogMoney" type="ios" title={"￥"+ (saleOrderPayment.paymentFee / 10000 ).toFixed(2)} buttons={buttons2} show={this.state.showIOS2}>
                    您确定支付吗?
                </Dialog>
                <Dialog type="ios" title={"申请退款"} buttons={buttons5} show={this.state.showIOS5}>
                    <p>您是否确认退款？</p>
                    {/*<p style={{fontSize:"13px",marginTop:20}}>
                        <span onClick={()=>{this.setState({showIOS5:false});this.refs['protocol1'].show();}}>《预付款协议》</span>
                    </p>*/}
                </Dialog>
                <Toptips show={ToptipsArr.show || false} type={ToptipsArr.type || "warn"}>
                    {ToptipsArr.content}
                </Toptips>
                <ProtocolPopUp ref='protocol' type='Presentation'/>
                <ProtocolPopUp ref='protocol1' type='Prepayments'/>
            </Tab>
        )
    }
}
