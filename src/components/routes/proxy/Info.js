/**
 * Created by Brian on 18/03/2017.
 */
import React from 'react';
import {browserHistory, Link} from 'react-router';
import {Req} from '../../../utils/request';
import {fullImage} from '../../../utils/util';
import WeUI from 'react-weui';
import setWXTitle from '../../WXTitle';
import {FootLoaderIcon, NoDateNode} from '../../public';
const {Tab, TabBody, Dialog, InfiniteLoader} = WeUI;


import "../../../styles/UserCenter.scss";

export default class UserMyU extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabsIndex: 0,
            onloadDate:false,
            InviterList: [],
            CashList: [],
            offset: 0,
            limit: 10,
            total: 0,
            inviterTotal:0,
        };
    }

    getInviters(resolve) {
        const {offset, limit, InviterList} = this.state;
        Req.MAgenterInviters({offset, limit}).then(function (record) {
            this.setState({
                InviterList: offset >0 ? InviterList.concat(record.items):record.items,
                total: record.total,
                inviterTotal: record.total,
                offset: offset + limit,
                onloadDate:true
            }, () => {
                resolve && resolve();
            })
        }.bind(this)).catch(function () {
            this.setState({
                onloadDate:true
            })
        }.bind(this));
    }
    getCashReward(resolve) {
        const {offset, limit, CashList} = this.state;
        Req.MAgenterCashReward({offset, limit}).then(function (record) {
            this.setState({
                CashList:offset >0 ? CashList.concat(record.items):record.items,
                total: record.total,
                offset: offset + limit,
                onloadDate:true
            }, () => {
                resolve && resolve();
            })
        }.bind(this)).catch(function () {
            this.setState({
                onloadDate:true
            })
        }.bind(this));
    }

    componentDidMount() {
        this.getInviters()
        setWXTitle("代理人信息查询")
    }

    render() {
        const {tabsIndex, InviterList, CashList, offset, total ,onloadDate,inviterTotal} = this.state;
        const recommendList = InviterList.map((item, index) => {
                const createTime = (item.createTime || item.lastLoginTime);
                var arr = createTime.split(/[- : \/]/),
                    date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);

                return (
                    <div key={index} className="item">
                        <div className="f--hcc">
                            <div className="flex-1">
                                <img className="head" src={fullImage(item.photo)} alt=""/>
                                <span>{item.nickname}</span>
                            </div>
                            <div className="date">
                                {date.Format()}
                            </div>
                        </div>
                    </div>
                )
            }),
            rewardList = CashList.map((item, index) => {
                const createTime = (item.createTime || item.lastLoginTime);

                var arr = createTime.split(/[- : \/]/),
                    date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
                return (
                    <div key={index} className="item">
                        <div className="f--hcc">
                            <div className="flex-1 name" style={{textAlign:"left"}}>
                                <p>{item.nickname}</p>
                                <p>订单成交推荐奖励</p>
                            </div>
                            <div className="fMoney">
                                <p>+{(item.quantity/10000).toFixed(0)}</p>
                                <p>{date.Format()}</p>
                            </div>
                        </div>
                    </div>
                )
            })
        return (
            <Tab>
                <TabBody className="proxy_info">
                    <InfiniteLoader loaderDefaultIcon={FootLoaderIcon}
                        onLoadMore={ (resolve, finish) => {
                            if (offset > total) {
                                //finish()
                                resolve()
                            } else {
                                tabsIndex == 0 ? this.getInviters(resolve) : this.getCashReward(resolve);
                            }
                        }}
                    >
                        <div>
                            <div className="head f--s">
                                <p>{inviterTotal}</p>
                                <p>推荐总人数</p>
                            </div>
                            <div className="content balanceDetail">
                                <div className="nav f--hlc">
                                <span className={tabsIndex == 0 ? "active" : ""}
                                      onClick={() => {

                                          this.setState({tabsIndex: 0,offset:0,onloadDate:false,CashList:[]},()=>{
                                              this.getInviters()
                                          })
                                      }}
                                >推荐人员名单</span>
                                    <span className={tabsIndex == 1 ? "active" : ""}
                                          onClick={() => {

                                              this.setState({tabsIndex: 1,offset:0,onloadDate:false,InviterList:[]},()=>{
                                                  this.getCashReward();
                                              })
                                          }}
                                    >推荐奖励明细</span>

                                </div>
                                { tabsIndex == 0 &&
                                <div className="recommend">


                                    {recommendList}
                                    {
                                        (onloadDate &&(offset > total)&& InviterList.length >0)&&
                                            FootLoaderIcon
                                    }
                                </div>
                                }
                                { tabsIndex == 1 &&

                                <div className="rewardList">
                                    {rewardList}
                                    {
                                        (onloadDate &&(offset > total)&& CashList.length >0)&&
                                        FootLoaderIcon
                                    }
                                </div>
                                }
                            </div>
                        </div>
                        {(((tabsIndex == 0 && InviterList.length ==0)||(tabsIndex == 1 && CashList.length ==0)) && onloadDate) &&(<div>{NoDateNode}</div>)}
                        <div className="return" onClick={()=>{
                            browserHistory.go(-1)
                        }}>
                            <i className="ic-aeeow-32-white"></i>
                        </div>
                    </InfiniteLoader>
                </TabBody>
            </Tab>
        );
    }
}
