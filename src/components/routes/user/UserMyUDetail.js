/**
 * Created by StupidBoy on 2017/4/2.
 */
import React from 'react';
import {Req} from '../../../utils/request';
import {FootLoaderIcon, NoDateNode} from '../../public';
import {Link, browserHistory} from 'react-router';
import {
    Tab, TabBody, InfiniteLoader
} from 'react-weui';

import setWXTitle from '../../WXTitle';
import "../../../styles/UserCenter.scss";

export default class UserMyUDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pointFlowList: [],
            onloadDate: false,
            offset: 0,
            limit: 10,
            total: 0
        }
    }

    getList(resolve) {
        //获取优币流水
        const {offset, limit} = this.state;
        Req.MCoupon({offset, limit}).then(function (record) {
            const pointFlowList = this.state.pointFlowList.concat(record.items)
            this.setState({
                pointFlowList,
                offset: offset + limit,
                total: record.total,
                onloadDate:true,
            })
            resolve && resolve()
        }.bind(this)).catch(function (code) {
            this.setState({
                onloadDate:true
            })
        }.bind(this));
    }

    componentDidMount() {
        this.getList()
        setWXTitle("兑换记录")
    }

    render() {
        const {pointFlowList,offset,total,onloadDate} = this.state;
        const list = pointFlowList.map((item, index) => {
            return (
                <div className="item" key={index}>
                    <div className="hd f--hlc">
                        <div>单号：{item.exchangeNum}</div>
                        <div>{item.exchangeStatus.text}</div>
                    </div>
                    <div className="bd f--hlt" onClick={() => {
                    }}>
                        <div className="img"><img src="/images/jd2.png" alt=""/></div>
                        <div className="name">
                            <p>
                                兑换{item.couponType.text}券{item.couponValue}元
                            </p>
                            <p>
                                {(item.quantity / 10000).toFixed(0)}优币
                            </p>
                        </div>
                    </div>
                </div>
            )
        })
        return (
            <Tab>
                <TabBody className="UserMyUDetail">
                    <InfiniteLoader loaderDefaultIcon={FootLoaderIcon}
                                    onLoadMore={ (resolve, finish) => {
                                        if (offset > total) {
                                            finish()
                                            //resolve();
                                        } else {
                                            this.getList(resolve, finish)
                                        }
                                    }}>
                        <div className="list">
                                {list}
                                {((!pointFlowList.length >0)&&onloadDate) &&(<div>{NoDateNode}</div>)}

                                <div className="return" onClick={()=>{
                                    browserHistory.go(-1)
                                }}>
                                    <i className="ic-aeeow-32-white"></i>
                                </div>
                        </div>
                    </InfiniteLoader>
                </TabBody>
            </Tab>
        )
    }
}
