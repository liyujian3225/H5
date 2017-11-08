/**
 * Created by StupidBoy on 2017/3/14.
 */
import React from 'react';
import {Link, browserHistory} from 'react-router';
import setWXTitle from '../WXTitle';
import {Tab, TabBody, TabBar, NavBar, NavBarItem, Popup, Article, Button, Gallery} from 'react-weui';
import {Req} from '../../utils/request';
import ReactMCarousel from 'react-m-carousel';
import "../../styles/SoftOutfitPackage.scss";
import {fullImage} from '../../utils/util';

export default class SoftOutfitPackage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,
            fullpage_show: false,
            data: {},
            aparmentName: "",
            aparmentId: "",
            aipId: "",
            aparmentDesc: "",
            tabs: 0,
            MCarouselIndex: 1,
            premises:{}
        }
    }

    hide() {
        this.setState({
            fullpage_show: false,
        })
    }

    getAparment(all) {
        //获取户型
        Req.interiorAparment({premisesId: all.premisesId, interiorId: all.interiorId}).then(function (result) {
            this.setState({
                aparment: result,
            })

        }.bind(this)).catch(function (code) {
            console.log(code);
        }.bind(this));
    }
    getDetail(id){
        //获取套餐内容
        Req.aipDetail(id).then(function (result) {
            var all = result;
            const {aparmentName, aparmentDesc,aparmentId} = all.aparment;
            delete all.aparment;
            this.setState(all)
            setWXTitle(all.interior.interiorName);
            this.setState({
                aparmentName,
                aparmentDesc,
                aparmentId,
            });
            this.setStorage("packageInfo",JSON.stringify(all))
            this.getAparment(all)
        }.bind(this)).catch(function (code) {
            console.log(code);
        }.bind(this));
    }
    getAparmentDetail(){
        //根据户型获取内容
        const {premisesId,interiorId,aparmentId} = this.state;
        Req.switchAparmentDetail({premisesId,interiorId,aparmentId}).then(function (result) {
            var all = result;
            delete all.aparment;
            this.setState(all)
            setWXTitle(all.interior.interiorName);
            this.setStorage("packageInfo",JSON.stringify(all))
        }.bind(this)).catch(function (code) {
            console.log(code);
        }.bind(this));
    }
    setStorage(name,packageInfo){
        if(!window.localStorage){
            alert("请升级浏览器");
            return false;
        }else{
            const storage=window.localStorage;
            storage[name] = packageInfo;
        }
    }
    componentDidMount() {
        this.setState({aipId:this.props.params.aipId},()=>this.getDetail(this.state.aipId));
        this.scrollTabsActive();
    }
    scrollTabsActive(){
        //设置tabs选中
        const oScrollDiv = document.getElementsByClassName("SoftOutfitPackage")[0];
        const oInteriorContent = document.getElementsByClassName("SoftOutfitPackage")[0];
        const oDesign = document.getElementsByClassName("Design")[0];
        const oPackageList = document.getElementsByClassName("PackageList")[0];
        oScrollDiv.onscroll = (e)=>{
            const  oh = oScrollDiv.scrollTop + oScrollDiv.clientHeight;
            if(oh > oPackageList.offsetTop){
                this.setState({
                    tabs:2
                })
            }else if(oh > oDesign.offsetTop){
                this.setState({
                    tabs:1
                })
            }else if(oh > oInteriorContent.offsetTop){
                this.setState({
                    tabs:0
                })
            }
        }
    }
    changState(data, fn) {
        this.setState(data, fn);
    }


    setScrollTop(className) {
        //锚点
        const parent = document.getElementsByClassName("weui-tab__panel")[0];
        const children = document.getElementsByClassName(className)[0];
        parent.scrollTop = children.offsetTop - 50;
    }

    render() {
        const {tabsIndex, aparmentName, aparmentDesc, tabs, MCarouselIndex,premises,aipId,aparmentId,fullpage_show} = this.state;
        const {interior = {}, aipPrice = 0, uxuanPrice = 0, aparment = [], aipItemList = [] } = this.state;
        const {interiorName, description, carouselContent, interiorContent} = interior;
        var carouselItem = [];
        //     =  (interiorContent || []).map((item, index) => {
        //     return (<div key={index}>
        //         <img src={fullImage(item.contentImage)}/>
        //     </div>);
        // })
        // const aparmentItem = (aparment || []).map((item, index) => {
        //     return <option key={item.aparmentId} value={item.aparmentId}>{item.aparmentName}</option>;
        // });
        const interiorContentItem = (interiorContent || []).map((item, index) => {
            if (item.contentType.code == 2) {
                carouselItem.push(
                    <div key={index} className='f--hcc'>
                        <img src={fullImage(item.contentImage)}/>
                    </div>
                )
                return;
            }
            return (<div key={index}>
                {item.contentImage && <img src={fullImage(item.contentImage)}/>}
                {item.contentDesc && <p className="mt5 mb5 ">{item.contentDesc}</p>}
            </div>);
        }).filter((item)=>item);
        const premisesItem = ((premises.aparmentList||[{}])[0].aparmentItemList || []).map((item, index) => {
            return (<div key={index}>
                {item.contentDesc && <p>{item.contentDesc}</p>}
                {item.contentImage && <img src={fullImage(item.contentImage)}/>}
            </div>);
        });
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
                                    <Link to={"/commodity_detail/" +item1.aipId+"/"+ item1.product.productId}>
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
                <NavBar className="packageNavbar">
                    <NavBarItem active={tabs == 0} onClick={e => {
                        this.setState({tabs: 0});
                        {/*document.getElementById('interiorContent').scrollIntoView(true)*/
                        }
                        this.setScrollTop("packageNavbar")
                    }}>介绍</NavBarItem>
                    <NavBarItem active={tabs == 1} onClick={e => {
                        this.setState({tabs: 1});
                        this.setScrollTop("Design")
                    }}>详情</NavBarItem>
                    <NavBarItem active={tabs == 2} onClick={e => {
                        this.setState({tabs: 2});
                        this.setScrollTop("PackageList")
                    }}>商品清单</NavBarItem>
                </NavBar>
                <TabBody className="SoftOutfitPackage">
                    <div>

                        <div>
                            <div className="carousel">
                                <ReactMCarousel loop auto={2000} responsive={66.5} indicators={true} onSwiped={(e) => {
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
                                    <span>{interiorName}</span>
                                </div>
                                <div className="description">
                                    <span>{description}</span>
                                </div>
                                <div className="aipPrice">
                                    <span>￥{aipPrice/10000}</span>
                                </div>
                                <div className="uxuanPrice">
                                    {/*<span>赠送 {uxuanPrice} 优币 </span>*/}
                                    {/*<i className="icon-i"></i>*/}
                                </div>
                                <div className="aparment">
                                    <div>
                                        <span>户型选择</span>
                                        <span className="aparmentName"
                                              onClick={e => this.setState({fullpage_show: true})}>
                                            <i className="icon-aparment"></i>
                                            <span>{aparmentName}</span>
                                            <i className="cell_ft"></i>
                                        </span>
                                    </div>
                                    <div>
                                        {aparmentDesc}
                                    </div>
                                </div>
                            </div>
                            <div className="content">

                                {/*<div className="interiorContent" id="interiorContent">
                                    {premisesItem}
                                </div>*/}
                                <div className="Design" id="Design">
                                    {/*<div className="title">
                                        设计方案
                                    </div>*/}
                                    {interiorContentItem}
                                </div>
                                <div className="PackageList" id="PackageList">
                                    {/*<div className="title">
                                        商品清单
                                    </div>*/}
                                    <div className="content">
                                        {productItem}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabBody>
                <TabBar className="noBackground">
                    <div className="sPurchase f--hcc">
                        <a href="JavaScript:history.go(-1)" className="goBack"><i className="ic-aeeow"></i></a>
                        <button className="btn btn-clear btnHover" onClick={() => {
                            browserHistory.push("/submit_order/"+aipId+"/"+aparmentId);
                        }}>
                            <span>立即购买</span>
                        </button>
                    </div>
                </TabBar>
                {fullpage_show && <Aparment changState={this.changState.bind(this)} getAparmentDetail={this.getAparmentDetail.bind(this)} data={this.state}/>}
            </Tab>
        );
    }
}

//户型选择
class Aparment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabsIndex: 0,
            aparmentName: "",
            aparmentId: "",
            aparmentDesc: "",
            GallerySrc: "",
            GalleryShow: false
        }
    }

    submitAparment() {
        const {aparmentName, aparmentId, aparmentDesc} = this.state;
        this.props.changState({
            aparmentName,
            aparmentId,
            aparmentDesc,
            fullpage_show: false
        },this.props.getAparmentDetail.bind(this));
    }

    setScrollLeft(index) {
        const aparmentList = document.getElementsByClassName("aparmentList")[0];
        const event = aparmentList.children[0].children[index];
        aparmentList.scrollLeft = event.offsetLeft - ((document.body.offsetWidth - event.offsetWidth) / 2) - 20;
    }

    componentWillMount(){
        const {aparment,aparmentId,aparmentName,aparmentDesc}  = this.props.data
        aparment.map((item,index)=>{
            (item.aparmentId == aparmentId)&& this.setState({tabsIndex:index})
        })
        this.setState({aparmentId,aparmentName,aparmentDesc})
    }
    componentDidMount(){
        this.setScrollLeft(this.state.tabsIndex)
    }
    render() {
        const {changState, data} = this.props;
        const {fullpage_show, aparment} = data;
        const {tabsIndex, GallerySrc, GalleryShow} = this.state;
        const aparmentItems = (aparment || []).map((item, index) => {
            const {aparmentName, aparmentId, aparmentDesc, image,roomed,coveredArea} = item;
            return (
                <div className={tabsIndex == index ? "active" : ""} key={index} onClick={(e) => {
                    this.setState({
                        tabsIndex: index,
                        aparmentName,
                        aparmentId,
                        aparmentDesc
                    })
                    this.setScrollLeft(index)
                }}>
                    <div className="img">
                        <img src={fullImage(image)} alt="" onClick={() => {
                            (tabsIndex == index) &&(this.setState({GallerySrc: image, GalleryShow: true }));

                        }}/>
                    </div>
                    <div className="text">
                        <p>{aparmentName}</p>
                        <p className="aparmentContent">
                            <span>{roomed}</span>
                            <span style={{marginLeft:5}}>{coveredArea&&(coveredArea/10000 + " ㎡")}</span>
                        </p>
                    </div>
                </div>
            )
        })

        return (
            <Popup
                show={fullpage_show}
                onRequestClose={e => changState({fullpage_show: false})}
                className="aparmentWrap"
                style={{background: "transparent"}}
                onTouchMove={(event)=>{
                    event.preventDefault();
                }}
            >
                <div style={{height: '100vh', overflow: 'hidden'}} onClick={e => changState({fullpage_show: false})}>
                    <Article style={{background: "#fff"}} onClick={e => e.stopPropagation()}>
                        <div className="aparmentList"
                             onTouchMove={(event) => {
                                //event.preventDefault();
                                event.stopPropagation();
                        }}>
                            <div>
                                {aparmentItems}
                            </div>
                        </div>
                        <div onClick={() => {
                            //this.setState({
                            //GalleryShow: !GalleryShow
                            //})
                        }}>
                            <Gallery src={fullImage(GallerySrc)} show={GalleryShow} onClick={(e) => {
                                e.stopPropagation()
                                this.setState({
                                    GalleryShow: !GalleryShow
                                })
                            }}>
                                <div className="weui-gallery__opr">
                                    <div className="weui-gallery__del">
                                        <img src="/images/ic-close.png" alt="" onClick={(e) => {
                                            e.stopPropagation()
                                            this.setState({
                                                GalleryShow: !GalleryShow
                                            })
                                        }}/>
                                    </div>
                                </div>
                            </Gallery>
                        </div>
                        <div className="btn" onClick={() => {
                            this.submitAparment();
                        }}>
                            确定
                        </div>
                    </Article>
                </div>
            </Popup>
        )
    }
}
