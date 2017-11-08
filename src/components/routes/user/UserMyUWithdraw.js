/**
 * Created by StupidBoy on 2017/4/2.
 */
import React from 'react';
import {Req} from '../../../utils/request';
import {FootLoaderIcon, NoDateNode} from '../../public';
import {browserHistory} from 'react-router';
import {getLocalUserInfo} from '../../../utils/auth';
import {
    Tab, TabBody, InfiniteLoader
} from 'react-weui';

import "../../../styles/UserCenter.scss";
import setWXTitle from '../../WXTitle';

export default class UserMyUDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: getLocalUserInfo(),
            pointFlowList: [],
            onloadDate:false,
            offset: 0,
            limit: 10,
            total: 0
        }
    }

    getList(resolve) {
        //获取优币流水
        const {offset, limit} = this.state;
        Req.MPointConvert({offset, limit}).then(function (record) {
            const pointFlowList = this.state.pointFlowList.concat(record.items)
            this.setState({
                pointFlowList,
                offset: offset + limit,
                total: record.total,
                onloadDate:true,
            })
            resolve && resolve();
        }.bind(this)).catch(function () {
            this.setState({
                onloadDate:true
            })
        }.bind(this));
    }

    componentDidMount() {
        this.getList()
        setWXTitle("优币提现额度");
    }

    render() {
        const {pointFlowList, offset, total, userInfo,onloadDate} = this.state;
        const list = pointFlowList.map((item, index) => {
            const {saleOrderCode, totalPoint, recommendCount, convertPoint,percent} = item;
            const bl= percent;
            return (
                <div className="item" key={index}>
                    <div className="orderNum">
                        单号：{saleOrderCode}
                    </div>
                    <div className="moneyTotal">
                        <p>订单优币总额</p>
                        <p>{totalPoint / 10000}</p>
                    </div>
                    <div className="s-invitation f--hcc">
                        <div className="flex-11">
                            <p>成功邀请</p>
                            <p>{recommendCount}<span>人</span></p>
                        </div>
                        <div></div>
                        <div className="flex-1">
                            <p>已转余额的优币</p>
                            <p>{convertPoint / 10000}<span></span></p>
                        </div>
                        <div></div>
                        <div className="flex-1">
                            <p>待返还优币</p>
                            <p>{(totalPoint -convertPoint )/ 10000}<span></span></p>
                        </div>
                    </div>
                    <div className="slider">
                        <div className="slider-line">
                            <div className="slider-inner" style={{width: bl + "%"}}></div>
                        </div>
                        <div className="slider-box f--hlc">
                            <span style={{ overflow: "hidden"}}>{/*0%*/}</span>
                            <span className="flex-1" style={{textAlign:"center"}}>订单返还比例</span>
                            {bl>0 &&<span style={{overflow:"hidden"}}>{bl}%</span>}
                        </div>
                    </div>
                </div>
            )
        })

        return (
            <Tab>
                <TabBody className="UserMyUWithdraw">
                    <InfiniteLoader loaderDefaultIcon={FootLoaderIcon}
                                    onLoadMore={ (resolve, finish) => {
                                        console.log(offset)
                                        if (offset > total) {
                                            finish();
                                            //resolve();
                                        } else {
                                            this.getList(resolve, finish)
                                        }
                                    }}>
                        <div className="list">
                            {!(userInfo.userType == "CUSTOMER_AGENT") && (
                                <div className="no-proxy f--hlc">
                                    <div className="flex-1" onClick={() => {
                                        browserHistory.push("/proxy_registration");
                                    }}>
                                        <p>
                                            <i className="ic-authentication"></i>
                                            <span>代理人认证</span>
                                        </p>
                                        <p>
                                            成为代理人才可以获取优币提现资格
                                        </p>
                                    </div>
                                    <div>
                                        <i className="cell_ft"></i>
                                    </div>
                                </div>
                            )}
                            {list}

                            <div className="return" onClick={()=>{
                                browserHistory.go(-1)
                            }}>
                                <i className="ic-aeeow-32-white"></i>
                            </div>
                            {!(pointFlowList.length > 0 && onloadDate) && (<div>{NoDateNode}</div>)}
                        </div>
                    </InfiniteLoader>
                </TabBody>
            </Tab>
        )
    }
}
