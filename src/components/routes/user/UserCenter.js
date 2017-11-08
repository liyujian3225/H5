/**
 * Created by Brian on 18/03/2017.
 */
import React from 'react';
import {browserHistory} from 'react-router';
import {Req} from '../../../utils/request';
import WeUI from 'react-weui';
const {Tab, TabBody, Panel, PanelBody, MediaBox, Cells, Cell, CellBody, CellFooter} = WeUI;
import {fullImage, getBrowserType, clearCookies,getCookie} from '../../../utils/util';
import { saveLocalUserInfo, getLocalUserInfo } from '../../../utils/auth';
import setWXTitle from '../../WXTitle';
import AppTabBar from '../widget/TabBar';
import "../../../styles/UserCenter.scss";


class UserCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
            menus: [
                [
                    {title: '我的余额', code: 'remain', info: '0',className:"fb7"}, {title: '我的优币', code: 'ub', info: '0',total:"0"},
                ], [
                    {title: '积分商城', code: 'shop',icon:"ic-shop.png", info: ""},
                    {title: '我的订单', code: 'order',icon:"ic-order.png", info: ""},
                    {title: '客服电话', code: 'phone',icon:"ic-contact.png", info: '4000268880'},
                    {title: '手机号码', code: 'tel',icon:"ic-iphon.png", info: '未绑定'},
                    {title: '代理人认证', icon:"ic-authentication.png",code: 'agent', info: ''},
                ]
            ],
            selectedTabIndex: 1,
            userType:"CUSTOMER",
            showLogout: false,
        };
        this.getUserInfo = this.getUserInfo.bind(this);
        this.onClickMenu = this.onClickMenu.bind(this);

        this.onLogout = this.onLogout.bind(this);
    }

    componentDidMount() {
        this.getUserInfo();
        setWXTitle("个人中心")
    }

    getUserInfo() {
        //获取用户信息
        Req.userInfo().then(function (result) {
            saveLocalUserInfo(result);
            let newMenus = [].concat(this.state.menus);
            newMenus[0][0].info = 0;
            newMenus[0][0].info = (result.currentCash/10000).toFixed(0);
            newMenus[0][1].info = result.consumablePoint/10000;
            newMenus[0][1].total = (result.currentPoint -result.consumablePoint)/10000;

            (result.phone && result.phone.length >0 ) && (newMenus[1][3].info = result.phone );
            (result.userType.name == "CUSTOMER_AGENT") && (newMenus[1][4].title ="代理人信息查询" );

            let showLogout = true;
            if(getBrowserType() === 'wechat') {
                showLogout = false;
            }
            if(getCookie("tp") != "true"){
                newMenus[1].splice(3,1);
            }

            this.setState({
                userInfo: getLocalUserInfo(result),
                menus:newMenus,
                userType:result.userType.name,
                showLogout: showLogout,
            })
        }.bind(this)).catch(function (code) {
            console.log(code);
        }.bind(this));
    }

    onClickMenu(menu) {
        switch (menu.code) {
            case 'ub':
                browserHistory.push('/user_myu');
                break;
            case 'remain':
                browserHistory.push('/user_balance');
                break;
            case 'order':
                browserHistory.push('/order_list');
                break;
            case 'shop':
                browserHistory.push('/umall');
                break;
            case 'phone':
                window.location.href = 'tel://' + menu.info;
                //browserHistory.push('/');
                break;
            case 'tel':
                if(getCookie("tp") === "true"){
                    browserHistory.push('/user_phone');
                }
                break;
            case 'agent':
                if(this.state.userType=="CUSTOMER_AGENT" ){
                    browserHistory.push('/proxy_info');
                }else{
                    browserHistory.push('/proxy_registration');
                }
                break;
        }
    }

    onLogout() {
        clearCookies();
        browserHistory.push('/');
    }

    render() {
        const {userType} = this.state;
        return (
            <Tab>
                <TabBody className='user-center'>
                    <div>
                        <div className='user-info'>
                            <div className="img">
                                <img src={fullImage(this.state.userInfo.photo)} className='header'/>
                            </div>
                            <span className={`userName ${(userType=="CUSTOMER_AGENT") && "proxy"}` }>
                                {
                                    this.state.userInfo.nickname
                                        ? this.state.userInfo.nickname
                                        : null
                                }
                            </span>
                            {
                                this.state.showLogout
                                    ? <div className='logout'>
                                    <button className='btn-clear logout-btn' onClick={this.onLogout}>退出</button>
                                </div>
                                    : null
                            }
                        </div>
                        <Panel>
                            <PanelBody>
                                <MediaBox type="small_appmsg">
                                    {
                                        this.state.menus.map((v, i) => {
                                            return (<Cells key={i}> {
                                                v.map((v1, i1) => {
                                                    if (v1.code == "ub") {
                                                        return  (<Cell key={i1} className="ub_list" onClick={this.onClickMenu.bind(this, v1)}>
                                                            <CellBody>
                                                                <p>{v1.title}</p>
                                                                <p>可消费</p>
                                                                <p>{v1.info}</p>
                                                            </CellBody>
                                                            <CellFooter>
                                                                <div style={{textAlign:"center"}}>
                                                                    <p>待返还优币</p>
                                                                    <p>{v1.total}</p>
                                                                </div>
                                                            </CellFooter>
                                                        </Cell>)

                                                    }
                                                    if(v1.code == "remain" && this.state.userType=="CUSTOMER"){
                                                        return false;
                                                    }
                                                    return (<Cell key={i1} onClick={this.onClickMenu.bind(this, v1)}>
                                                        <CellBody>
                                                            <p>{v1.title}</p>
                                                        </CellBody>
                                                        <CellFooter>
                                                            <span className={v1.className||""}>{v1.code == "remain"&&"￥"}{v1.info}</span>
                                                            {v1.icon && <img src={"../../../images/"+v1.icon} alt=""/>}
                                                        </CellFooter>
                                                    </Cell>);
                                                })
                                            }
                                            </Cells>);
                                        })
                                    }
                                </MediaBox>
                            </PanelBody>
                        </Panel>
                    </div>
                </TabBody>
                <AppTabBar tabbarType='default' selectedIndex={this.state.selectedTabIndex}/>
            </Tab>
        );
    }
}

export default UserCenter;
