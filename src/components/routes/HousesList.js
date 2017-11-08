/**
 * Created by StupidBoy on 2017/3/11.
 */
import React from 'react';
import {Link, browserHistory} from 'react-router';
import AppTabBar from './widget/TabBar';
import AppFooter from './widget/Footer';
import {Req} from '../../utils/request';
import {fullImage} from '../../utils/util';
import WeUI from 'react-weui';
import setWXTitle from '../WXTitle';
import {FootLoaderIcon, NoDateNode} from '../public';
const {Tab, TabBody, InfiniteLoader} = WeUI;
import "../../styles/HousesList.scss";

class HousesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            selectedTabIndex: 0,
            premisesList: [],
            regionName: "全部",
            regionList: [],
            regionBol: false,//地区筛选
            cityId: "",
            offset: 0,
            limit: 10,
            onloadDate:false,
            total: 0
        };
    }

    componentDidMount() {
        this.premisesSearch();
        this.area();
        setWXTitle("楼盘列表");
    }

    premisesSearch(resolve, finish) {
        //获取楼盘列表
        const {cityId, offset, limit, premisesList} = this.state;
        let params = {offset, limit};
        (cityId) && (params["cityId"] = cityId);

        Req.premisesSearch(params).then(function (record) {

            // browserHistory.push("/introduction/"+record.items[0].premisesId);
            this.setState({
                premisesList: premisesList.concat(record.items),
                offset: offset + limit,
                total: record.total,
                onloadDate:true,
            }, () => {
                (resolve) && resolve();
            })
        }.bind(this)).catch(function (code) {
            console.log(code);
            (finish) && finish();
            this.setState({
                onloadDate:true
            })
        }.bind(this));
    }

    area() {
        //省市区
        // Req.area({parentId:2943}).then(function (result) {
        //     // if(result)
        //     // const regionName =result[0].name ||"";
        //     this.setState({
        //         // regionName,
        //         regionList: result
        //     })
        // }.bind(this)).catch(function (code) {
        //     console.log(code);
        // }.bind(this));
        Req.premisesCity().then(function (result) {
            // if(result)
            // const regionName =result[0].name ||"";
            this.setState({
                // regionName,
                regionList: result
            })
        }.bind(this)).catch(function (code) {
            console.log(code);
        }.bind(this));

    }

    setRegion(item) {
        this.setState({
            regionName: item.name,
            regionBol: false,
            cityId: item.areaId,
            premisesList: [],
            offset: 0
        }, () => this.premisesSearch());

    }

    render() {
        const {premisesList, regionList, regionName, regionBol, offset, total, onloadDate} = this.state;
        //地区列表
        const regionItem = regionList.map((item, index) => {
            return <p key={item.areaId} onClick={this.setRegion.bind(this, item)}>{item.name}</p>
        });
        //楼盘列表
        const premisesItem = (premisesList || []).map((item, index) => {
            return <div key={index} onClick={() => {
                browserHistory.push("/introduction/" + item.premisesId);
            }}>
                <div className="img"><img src={fullImage(item.image)} alt="楼盘图片"/></div>
                <div className="premisesName">{item.premisesName}</div>
                <div className="description">{item.description}</div>
            </div>
        });

        return (
            <Tab>
                <TabBody className="HousesList" style={regionBol ?{borderBottom:0}:{}}>
                    <InfiniteLoader loaderDefaultIcon={FootLoaderIcon}
                                    onLoadMore={ (resolve, finish) => {
                                        if(regionBol)resolve();
                                        if (offset > total) {
                                            //finish()
                                            resolve();
                                        } else {
                                            this.premisesSearch(resolve, finish)
                                        }
                                    }}>
                        <div className="navTop" onClick={() => {
                            this.setState({
                                regionBol: !regionBol
                            })
                        }}>
                            <span className="name"></span>
                            <div className="region">
                                <span>{regionName}</span>
                                <span className="Combined-Shape"></span>
                            </div>
                        </div>
                        {regionBol &&
                        <div className="regionList" onClick={()=>{
                            this.setState({
                                regionBol: !regionBol
                            })
                        }}>
                            <p onClick={() => {
                                this.setState({
                                    regionBol: false,
                                    regionName: "全部",
                                    cityId: "",
                                    premisesList: [],
                                    offset: 0
                                }, () => this.premisesSearch());

                            }}>全部</p>
                            {regionItem}
                        </div>
                        }

                        {!regionBol &&
                        <div className="list">
                            {premisesItem}
                        </div>
                        }
                        {
                            (onloadDate &&(offset > total)&& premisesList.length >0&& (!regionBol))&&
                            FootLoaderIcon
                        }

                        {(premisesList.length == 0 && onloadDate && (!regionBol)) &&
                           <div>{NoDateNode}</div>
                        }
                        {!regionBol &&
                            <AppFooter/>
                        }
                    </InfiniteLoader>
                </TabBody>
                {!regionBol &&
                <AppTabBar tabbarType='default' selectedIndex={this.state.selectedTabIndex}/>
                }
            </Tab>
        );
    }
}

export default HousesList;
