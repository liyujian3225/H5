/**
 * Created by Brian on 18/03/2017.
 */
import React from 'react';
import {browserHistory, Link} from 'react-router';
import {Req} from '../../../utils/request';
import WeUI from 'react-weui';
const {Tab, TabBody,InfiniteLoader} = WeUI;
import ProtocolPopUp from '../widget/ProtocolPopUp';
import {FootLoaderIcon, NoDateNode} from '../../public';
import "../../../styles/UserCenter.scss";
import setWXTitle from '../../WXTitle';

export default class UserMyU extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Balance: 0,
            money: 200,
            onloadDate:false,
            pointFlowList: [],
            consumablePoint:"",
            currentPoint:"",
            returnPoint:"",
            returnTime:"",
            offset: 0,
            limit: 10,
            total: 0

        };
    }
    getList(resolve){
        //获取优币流水
        const {offset, total,limit} = this.state;
        Req.pointFlow({Status:"SUCCESS",offset, limit}).then(function (record) {
            const pointFlowList = this.state.pointFlowList.concat(record.items)
            this.setState({
                pointFlowList,
                offset: offset + limit,
                total: record.total,
                onloadDate:true
            })
            resolve && resolve()
        }.bind(this)).catch(function (code) {
            this.setState({
                onloadDate:true
            })
        }.bind(this));
    }
    getPoint(){
        //获取优币记录
        Req.MPoint().then(function (record) {
            const {consumablePoint, currentPoint, returnPoint, returnTime} = record;
            this.setState({
                consumablePoint,
                currentPoint,
                returnPoint,
                returnTime:returnTime||"",
            })
        }.bind(this));
    }
    componentDidMount() {
        this.getList();
        this.getPoint();
        setWXTitle("我的优币")
    }

    render() {
        const {pointFlowList,consumablePoint, currentPoint, returnPoint, returnTime ,offset,total,onloadDate} = this.state;
        let arr = returnTime.split(/[- : \/]/),
            oreturnTime = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);

        const items = pointFlowList.map((item, index) => {
            let poine = item.quantity >0 ;
            var arr = item.createTime.split(/[- : \/]/),
                date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
            return (
                <div className="item" key={index}>
                    <div className="f--h">
                        <span>{item.note} <i>{(item.status.name != "SUCCESS")&&("["+item.status.text+"]")}</i></span>
                        <span className={ poine ? "AMoney" : "fMoney" }>{ poine ? "+" :""}{ (item.quantity / 10000).toFixed(0)}</span>
                    </div>
                    <div className="f--h">
                        <span>流水号：{item.flowNum}</span>
                        <span>{date.Format()}</span>
                    </div>
                </div>
            )
        })
        return (
            <Tab>
                <TabBody className="myU">
                    <InfiniteLoader loaderDefaultIcon={FootLoaderIcon}
                                    onLoadMore={ (resolve, finish) => {
                                        if (offset > total) {
                                            finish()
                                            //resolve();
                                        } else {
                                            this.getList(resolve, finish)
                                        }
                                    }}>
                        <div className="head">
                            <div className="totalCoin f--h">
                                <div>
                                    <p>可消费优币</p>
                                    <p>{(consumablePoint|| 0)/10000}</p>
                                </div>
                                <div>
                                    <Link to="/user_myu_withdraw">提现额度</Link>
                                    <a> | </a>
                                    <Link to="/user_myu_detail">兑换记录</Link>
                                </div>
                            </div>
                            <div className="notCoin f--hlc">
                                <div>
                                    <p>
                                        <span>待返还优币</span>
                                        <i className="ic-i2" onClick={()=>{this.refs['protocol'].show();}}></i>
                                    </p>
                                    <p>{(currentPoint - consumablePoint)/10000}</p>
                                </div>
                                <div className="line"></div>
                                <div>
                                    <div className="f--h">
                                        <span>下期到账</span>
                                        <span>{returnTime && oreturnTime.Format()}</span>
                                    </div>
                                    <p>
                                        <span>{(returnPoint || 0)/10000}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="content balanceDetail">
                            <div className="title f--hlc">
                                <span>优币消费明细</span>
                            </div>
                            <div className="list">
                                {items}
                            </div>
                            <ProtocolPopUp ref='protocol' type='myUBack'/>
                        </div>
                        <div className="return" onClick={() => {
                            browserHistory.go(-1)
                        }}>
                            <i className="ic-aeeow-32-white"></i>
                        </div>
                        {((!pointFlowList.length >0)&& onloadDate) &&(<div>{NoDateNode}</div>)}
                    </InfiniteLoader>
                </TabBody>
            </Tab>
        );
    }
}
