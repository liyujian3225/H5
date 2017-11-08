import React from 'react';
import { Link, browserHistory } from 'react-router';
import {
    Tab, TabBody,TabBar,Toptips,Dialog
} from 'react-weui';
import {Req} from '../../../utils/request';
import {isRegExp,getCookie} from '../../../utils/util';
import "../../../styles/ListCell.scss";
import setWXTitle from '../../WXTitle';
import {Prompt} from '../../public';

export default class AddRess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addressId:"",
            areaId:"1126",
            cellphone:"",
            onephone:"",
            address:"",
            name:"",
            premisesRess:"",
            phoneCode:"",
            toptipsShow:false,
            ErrShowIOS:false,
            DidNotREG:true,
            codeDisabled:"获取验证码",
            ToptipsType:"warning"
        }
    }
    getRessList(){
        Req.customerAddress().then(function (result) {
            if(result && result[0]){
                setWXTitle("修改地址")
                const  {addressId,areaId, cellphone, address, name} = result[0];
                this.setState({
                    addressId,areaId, cellphone, address, name,
                    onephone:cellphone
                },()=>this.InputREG())
            }
        }.bind(this))
    }
    addRess(){
        const {areaId, cellphone, address, name} = this.state;
        Req.addRess({areaId, cellphone, address, name}).then(function (record) {
            browserHistory.go(-1)
        }.bind(this));
    }
    revampAddress(){
        const {areaId, cellphone, address, name,addressId} = this.state;
        Req.revampAddress({addressId , areaId, cellphone, address, name}).then(function (record) {
            browserHistory.go(-1)
        }.bind(this));
    }
    phoneCode(tel){
        Req.phoneCode(tel).then(function (result) {

        }.bind(this))
    }
    getPhoneCodeInfo() {
        let {cellphone, phoneCode} = this.state;
        return {phone:cellphone};
    }
    getPremisesRess() {
        //获取楼盘地址
        const premisesId = (JSON.parse(window.localStorage["packageInfo"])||{}).premisesId;
        if(premisesId > 0 ){
            Req.premisesAddress(premisesId).then(function (result) {
                const premisesRess = result.province.name + result.city.name + result.area.name + result.address;
                this.setState({
                    premisesRess: premisesRess
                })
            }.bind(this))
        }else{
            browserHistory.push("/")
        }
    }
    componentWillMount(){
        setWXTitle("添加地址");
        this.getRessList()
        this.getPremisesRess()
        // this.phoneCode({cellphone:"18825192423"});
        // this.addRess()
        if(getCookie("photo")){
            this.setState({
                onephone:getCookie("photo")
            })
        }else{

        }
    }
    submit(){
        const {addressId,areaId, cellphone, address, name,phoneCode}  = this.state;

        if(!(isRegExp("phone",cellphone)|| cellphone =="")){
            this.setState({
                ErrShowIOS:true,
                ErrContent:"请输入11位手机号码！"
            });
            return;
        }
        if(!name.length >0){
            this.setState({
                ErrShowIOS:true,
                ErrContent:"收货人名不能为空！"
            });
            return;
        }
        if(!address.length >0){
            this.setState({
                ErrShowIOS:true,
                ErrContent:"详细地址不能为空！"
            });
            return;
        }
        if(isRegExp("phone",cellphone) && name.length >0 && address.length >0){
            this.setState({
                DidNotREG:false
            })
        }else{
            return ;
        }
        if(addressId > 0 ){
            this.revampAddress()
        }else{
            this.addRess()
        }
    }
    InputREG(value,bol){
        const { cellphone, address, name}  = this.state;
        if(!bol){
            if(cellphone.length > 0 && name.length >0 && address.length >0){
                this.setState({
                    DidNotREG:false
                })
            }else{
                this.setState({
                    DidNotREG:true
                })
            }
        }
        return value && value.length >0;
    }
    render() {
        const {areaId, cellphone, address, name,phoneCode,premisesRess,codeDisabled,DidNotREG,ErrShowIOS,ErrContent} = this.state;
        return (
            <Tab>
                <TabBody>
                    <div className="ListCell address">
                        <div className="list">
                            <div className="title">个人信息</div>
                            <div className="item">
                                <div>
                                    <span>收货人名：</span>
                                    <input type="text" className={!(name && name.length >0)&&"error"} value={name} onChange={(e)=>{
                                        const value = e.target.value||"";
                                        this.setState({name:value},()=>this.InputREG(value,false));


                                    }} onBlur={(e)=>this.InputREG(e.target.value)}/>
                                </div>
                                <div style={{height:49}}>
                                    <span>手机号码：</span>
                                    <input type="tel" className={!(cellphone && cellphone.length >0)&&"error"} value={cellphone} onChange={(e)=>{
                                        const value = e.target.value||"";
                                        this.setState({cellphone:value},()=>this.InputREG(value,false));

                                    }} onBlur={(e)=>this.InputREG(e.target.value)}/>
                                </div>
                            </div>
                        </div>
                        <div className="list">
                            <div className="title">收货地址</div>
                            <div className="item">
                                <div>
                                    <span>楼盘地址：</span>
                                    <span className="flex-1 detailRess" style={{lineHeight:"1.2"}}>{premisesRess}</span>
                                    {/*<input type="text" value={premisesRess} onChange={(e)=>{ }}/>*/}
                                </div>
                                <div>
                                    <span>详细地址：</span>
                                    <input type="text"  className={!(address && address.length >0)&&"error"} value={address} onChange={(e)=>{
                                        const value = e.target.value||"";
                                        this.setState({address:value},()=> this.InputREG(value,false));
                                    }} onBlur={(e)=>this.InputREG(e.target.value)}/>
                                </div>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Prompt AERR={{ErrShowIOS,ErrContent}} changShow={()=>this.setState({ErrShowIOS:false})} />
                </TabBody>
                <TabBar className="noBackground">
                    <div className="Purchase sPurchase f--hcc">
                        <a href="JavaScript:history.go(-1)" className="goBack"><i className="ic-aeeow"></i></a>
                        <div className={"btnHover btn "+(DidNotREG&&"DidNotREG")} onClick={() => {
                            this.submit()
                        }}>
                            <span>保存</span>
                        </div>
                    </div>
                </TabBar>
            </Tab>
        )
    }
}
