/**
 * Created by Brian on 18/03/2017.
 */
import React from 'react';
import {browserHistory, Link} from 'react-router';
import {Req} from '../../../utils/request';
import WeUI from 'react-weui';
const {Tab, TabBody, InfiniteLoader} = WeUI;
import {FootLoaderIcon, NoDateNode} from '../../public';
import setWXTitle from '../../WXTitle';
import "../../../styles/UserCenter.scss";

export default class userBalance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Balance: 0,
            list: [],
            offset: 0,
            limit: 10,
            total: 0,
            onloadDate:false
        };
    }

    getMCashFlow(resolve) {
        const {offset, limit} = this.state;
        let params = {offset, limit};
        Req.MCashFlow(params).then(function (record) {
            const list = this.state.list.concat(record.items)
            this.setState({
                list,
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

    componentDidMount() {
        this.getMCashFlow()
        setWXTitle("我的余额明细")
    }

    render() {
        const {list,offset,total,onloadDate} = this.state;

        const items = list.map((item, index) => {
            var arr = item.createTime.split(/[- : \/]/),
            date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
            return (
                <div className="item" key={index}>
                    <div className="f--h">
                        <span>{item.note} <i>{(item.status.name !="SUCCESS") && `[${item.status.text}]`}</i></span>
                        <span
                            className={item.quantity > 0 ? "AMoney" : "fMoney"}>{item.quantity > 0 && "+"}{(item.quantity / 10000).toFixed(0)}</span>
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
                <TabBody className="balanceDetail">
                    <InfiniteLoader loaderDefaultIcon={FootLoaderIcon}
                                    onLoadMore={ (resolve, finish) => {
                                        if (offset > total) {
                                            finish()
                                            //resolve();
                                        } else {
                                            this.getMCashFlow(resolve, finish)
                                        }
                                    }}>
                        <div className="list">
                            {items}
                        </div>

                        {(list.length == 0 &&onloadDate ) &&
                        <div>{NoDateNode}</div>
                        }

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
