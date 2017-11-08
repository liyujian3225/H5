/**
 * Created by StupidBoy on 2017/3/12.
 */
import React from 'react';
import {Link,browserHistory} from 'react-router';
import AppTabBar from './widget/TabBar';
import setWXTitle from '../WXTitle';
import {FootLoaderIcon, NoDateNode} from '../public';
import {Req} from '../../utils/request';
import {fullImage} from '../../utils/util';
import WeUI from 'react-weui';
import ReactMCarousel from 'react-m-carousel';
const {Tab, TabBody,InfiniteLoader} = WeUI;

import "../../styles/introduction.scss";

class Introduction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            visible: false,
            onloadDate: false,
            selectedTabIndex: 2,
            premisesId:"",
            offset: 0,
            limit: 2,
            total: 0
        };
    }

    componentDidMount() {
        this.setState({
            premisesId:this.props.params.premisesId
        },()=>this.getInterior());
    }
    getInterior() {
        const {offset, limit,premisesId} = this.state;
        if(!premisesId>0)alert("请重新进入软装列表")
        Req.interiorSearch({premisesId}).then(function (result) {
            const {premisesName} = result;
            result.onloadDate = true;
            this.setState(result)
            setWXTitle(premisesName)
        }.bind(this)).catch(function (code) {
            console.log(code);
            this.setState({
                onloadDate:true
            })
        }.bind(this));
    }

    render() {
        const {premisesName, image, description ,aipList ,contentList,offset, onloadDate,total} = this.state;
        const aipLists  = (aipList||[]).map((item,index)=>{
            return <div key={index}>
                <div onClick={()=>{
                    browserHistory.push("/package/"+item.aipId);
                    }} className="img"><img src={fullImage(item.interior.interiorImage)} alt=""/></div>
                <div className="product">
                    {(item.aipItemList && item.aipItemList.length > 0?item.aipItemList.slice(0,4):[]).map((item2,index2)=>{
                        return <Link key={index2} to={"/commodity_detail/"+item2.aipId+"/"+item2.product.productId}><img src={fullImage(item2.product.productImage)} alt=""/></Link>
                    })}
                </div>
                <div onClick={()=>{
                    browserHistory.push("/package/"+item.aipId);
                    }} className="interiorName">{item.interior.interiorName}</div>
                <div onClick={()=>{
                    browserHistory.push("/package/"+item.aipId);
                    }} className="aipPrice">￥{item.aipPrice/10000}</div>
                <div onClick={()=>{
                    browserHistory.push("/package/"+item.aipId);
                    }} className="uxuanPrice">{/*赠送 <span>{item.uxuanPrice}</span>优币*/}</div>
                <div className="commodityDetail">
                    <Link to={"/package/"+item.aipId} className="textHover">
                        查看套餐详情
                    </Link>
                </div>
            </div>
        });
        const images = (contentList||[{contentImage:image}]).map((item,index)=>{
                    return  <div key={index} className='f--hcc'>
                            <img src={fullImage(item.contentImage)}/>
                        </div>
                })
        return (
            <Tab>
                <TabBody className="introduction">

                    <InfiniteLoader  loaderDefaultIcon={FootLoaderIcon} onLoadMore={ (resolve, finish) => {
                        finish()
                        if (offset > total) {

                        } else {
                            //finish()
                            //this.getInterior(resolve,finish)
                        }
                    }}>
                        {image && <div className="diagram">
                                {/*<img src={fullImage(image)} alt="楼盘图片"/>*/}
                            <div className="SoftOutfitPackage" style={{border:0}}>
                                <ReactMCarousel className="carousel" loop auto={2000} responsive={66.5} indicators={true}>
                                    {images}
                                </ReactMCarousel>
                            </div>
                            <div className="premisesName">{premisesName}</div>
                            <div className="description">{description}</div>
                        </div>}
                        {(aipLists.length>0)&&
                            <div className="list">
                                <div className="title" style={{paddingTop:0}}>{/*软装套餐*/}</div>
                                <div className="items">
                                    {aipLists}
                                </div>
                            </div>
                        }

                        {((!aipLists.length>0)&&onloadDate) &&
                        <div>{NoDateNode}</div>
                        }
                        {/*<AppFooter/>*/}
                    </InfiniteLoader>
                </TabBody>
                <AppTabBar tabbarType='default' selectedIndex={this.state.selectedTabIndex}/>
            </Tab>
        );
    }
}

export default Introduction;
