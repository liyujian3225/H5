/**
 * Created by StupidBoy on 2017/3/19.
 */
import React from 'react';
import {Link,browserHistory} from 'react-router';
import WeUI from 'react-weui';
import ReactMCarousel from 'react-m-carousel';
import {Req} from '../../utils/request';
import {fullImage} from '../../utils/util';
import setWXTitle from '../WXTitle';
const {Tab, TabBody} = WeUI;

import "../../styles/SoftOutfitPackage.scss";

export default class CommodityDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            MCarouselIndex: 1,
            productName: "",
            description: "",
            aipPrice: "",
            pictures:[],
            carouselContent:[],
            productSubDescriptions:[],
            productAttributes:[],
            parentId:"0",
            productPack: {
            },
            aipItemList:[]
        }
    }
    componentDidMount(){
        this.getProduct(this.props.params.productId);
        this.getDetail(this.props.params.aipId)
    }
    componentWillReceiveProps(nextProps){
        this.getProduct(nextProps.params.productId);
        document.getElementsByClassName("SoftOutfitPackage")[0].parentNode.scrollTop = 0;
    }
    getProduct(id){
        Req.productDetail(id).then(function (record) {
            const {productName,description,consumerPrice,pictures,productSubDescriptions,productAttributes,parentId} = record;
            this.setState({
                productName,
                description,
                aipPrice:(Number(consumerPrice)||0)/10000,
                carouselContent:pictures,
                productSubDescriptions,
                productAttributes,
                parentId,
            })

            setWXTitle(productName);
        }.bind(this)).catch(function (code) {
            console.log(code);
        }.bind(this));
    }
    getDetail(id){
        //获取套餐内容
        Req.aipDetail(id).then(function (result) {
            var aipItemList = result.aipItemList;
            this.setState({
                aipItemList
            })
        }.bind(this)).catch(function (code) {
            console.log(code);
        }.bind(this));
    }
    render() {
        const { MCarouselIndex, productName, description, aipPrice, aipItemList,carouselContent,productSubDescriptions,productAttributes,parentId} = this.state;
        const carouselItem = (carouselContent || []).map((item, index) => {
            return (<div key={index} className='f--hcc'>
                <img src={fullImage(item.pictureUri)}/>
            </div>);
        })
        const interiorContent = (productSubDescriptions ||[]).map((item,index)=>{
            return(
                <div key={index}>
                    <img src={fullImage(item.descriptionImage)} alt=""/>
                </div>
            )
        })
        const productAttributesItem = (productAttributes||[]).map((item,index)=>{
            return(
                <div key={index}>
                    <p>{item.attribute2Name}：</p>
                    <p>{item.attribute2Value||item.attribute2Options[0].optionName||""}</p>
                </div>
            )
        })
        const productItem = (aipItemList || []).map((item, index, arr) => {
            // console.log(arr)
            let items = [item];
            if (index % 3 != 0) {
                return false
            }
            if (arr[index + 1]) {
                items.push(arr[index + 1]);
            } else {
                items.push(undefined, undefined)
            }
            if (arr[index + 2]) {
                items.push(arr[index + 2]);
            } else {
                items.push(undefined)
            }
            return (
                <div key={index} className="f--hlt">
                    {
                        items.map((item1, index1) => {
                            if (item1 == undefined) {
                                return <div key={index1}></div>
                            }
                            return (
                                <div key={index1}>
                                    <Link to={"/commodity_detail/" + item1.aipId +"/"+item1.product.productId}>
                                        <div className="img">
                                            <img src={fullImage(item1.product.productImage)} alt=""/>
                                            {item1.quantity > 1 && <span className="badge">&times;{item1.quantity}</span>}
                                        </div>
                                        <div className="text">
                                            <p>{item1.product.productName}</p>
                                            <p>￥{item1.product.consumerPrice/10000}</p>
                                        </div>
                                    </Link>
                                </div>
                            )
                        })
                    }
                </div>
            )

        })
        return (
            <Tab>
                <TabBody style={{padding: 0}}>
                    <div className="SoftOutfitPackage" style={{border: 0}}>
                        <div>
                            <div className="carousel">
                                <ReactMCarousel className="carousel" loop={true} indicators={true} responsive={60} onSwiped={(e) => {
                                    //this.setState({MCarouselIndex: (Number(e) || 0) + 1});
                                }}>
                                    {carouselItem}
                                </ReactMCarousel>
                                {/*<div className="indicators">
                                    <span>{MCarouselIndex}/{carouselItem.length}</span>
                                </div>*/}
                            </div>
                            <div className="info">
                                <div className="interiorName">
                                    <span>{productName}</span>
                                </div>
                                <div className="description">
                                    <span>{description}</span>
                                </div>
                                <div className="aipPrice">
                                    <span>￥{aipPrice}</span>
                                </div>
                            </div>
                            <div className="specification">
                                <div className="title">
                                    <span>规格参数</span>
                                </div>
                                <div>
                                    <p>商品编号：</p>
                                    <p>{parentId}</p>
                                </div>
                                {productAttributesItem}

                            </div>
                            <div className="content">
                                <div className="interiorContent">
                                    {interiorContent}
                                </div>
                                <div className="PackageList" id="PackageList">
                                    <div className="title">
                                        套餐清单
                                    </div>
                                    <div className="content">
                                        {productItem}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="return" onClick={()=>{
                            browserHistory.go(-1)
                        }}>
                            <i className="ic-aeeow-32-white"></i>
                        </div>
                    </div>
                </TabBody>
            </Tab>
        );
    }
}
