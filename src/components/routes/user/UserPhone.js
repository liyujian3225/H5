import React from 'react';
import {browserHistory} from 'react-router';
import PhoneCodeButton from '../widget/PhoneCodeButton';
import {Dialog} from 'react-weui';
import {Req} from '../../../utils/request';
import {getCookie, setCookie, isRegExp} from '../../../utils/util';
import '../../../styles/UserCenter.scss';
import setWXTitle from '../../WXTitle';

class UserPhone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPhone: this.getOldPhone(),
            isThirdParty: (getCookie("tp") == true || getCookie('tp') === 'true'),
            cellPhone: '',
            phoneCode: '',
            showIOS1: false,
            showWarning: false,
            warningMsg: '',

            isLoading: false,
        };

        this.getOldPhone = this.getOldPhone.bind(this);
        this.getPhoneCodeInfo = this.getPhoneCodeInfo.bind(this);
        this.getPhoneNumber = this.getPhoneNumber.bind(this);

        this.isValidValue = this.isValidValue.bind(this);
        this.allValid = this.allValid.bind(this);

        this.onSubmitData = this.onSubmitData.bind(this);
    }
    componentDidMount(){
        setWXTitle("绑定手机号码");
        if (!(this.state.oldPhone > 0)){
            this.setState({
                showIOS1:true
            })
        }
    }
    getOldPhone() {
        let phone = getCookie('phone');
        if(!phone || phone === 'undefined') {
            phone = null;
        }
        return phone;
    }

    getPhoneCodeInfo() {
        let {cellPhone} = this.state;
        return {phone:cellPhone};
    }

    getPhoneNumber() {
        let phone = this.state.oldPhone;
        return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    }

    isValidValue(type) {
        switch (type){
            case 'phone':
                return isRegExp('phone', this.state.cellPhone);
                break;
            case 'phoneCode':
                return isRegExp('phoneCode', this.state.phoneCode);
                break;
        }
    }

    allValid() {
        return this.isValidValue('phone') && this.isValidValue('phoneCode');
    }

    onSubmitData(){
        if(!this.allValid()) {
            return;
        }
        this.submitSuccess = false;
        this.setState({showIOS1: false, isLoading: true});
        let data = {
            'newCellphone':this.state.cellPhone,
            'newPhoneCode':this.state.phoneCode,
        };
        let state = {warningMsg: '', showWarning: true, isLoading: false,
            cellPhone: '', phoneCode: ''};
        if(this.state.oldPhone) {
            //修改
            data['oldCellphone'] = this.state.oldPhone;
            Req.modifyPhone(data, true).then(function (result) {
                //成功
                setCookie('phone', this.state.cellPhone);
                state.warningMsg = '更换手机号成功';
                state.oldPhone = this.state.cellPhone;
                this.submitSuccess = true;
                this.setState(state);
            }.bind(this)).catch(function(res){
                //失败
                state.warningMsg = '无法修改手机号';
                if(res.msg) {
                    state.warningMsg = res.msg;
                }
                this.setState(state);
            }.bind(this));
        } else {
            //绑定
            Req.bindPhone(data, true).then(function (result) {
                //成功
                setCookie('phone', this.state.cellPhone);
                state.warningMsg = '绑定手机号成功';
                state.oldPhone = this.state.cellPhone;
                this.submitSuccess = true;
                this.setState(state);
            }.bind(this)).catch(function(res){
                //失败
                state.warningMsg = '无法绑定手机号';
                if(res.msg) {
                    state.warningMsg = res.msg;
                }
                this.setState(state);
            }.bind(this));
        }
    }

    render() {
        const {showIOS1} = this.state;
        const buttons1 = [{
                type: 'default',
                label: '取消',
                onClick: () => {
                    this.setState({showIOS1: false});
                }
            }, {
                type: 'primary',
                label: '确认',
                onClick: this.onSubmitData
            }];
        const buttons = [{
            type: 'primary',
            label: '确认',
            onClick: () => {this.setState({showWarning: false},()=>{
                if(this.submitSuccess) {
                    browserHistory.goBack();
                }
            });}
        }];
        return (
            <div className='user-phone f--hlc'>
                <div className='phone-container'>
                    {
                        this.state.oldPhone? <div className="phone-wrap">
                            <div className="phone-title mr5">
                                当前的手机号码为
                            </div>
                            <div className="phone-tel">
                                {this.getPhoneNumber()}
                                {/*<input type="tel" readOnly="true" value={this.getPhoneNumber()}/>*/}
                            </div>
                        </div>
                            :  <div className="phone-wrap">
                                    <div className="phone-title not-bind">
                                未绑定手机号码
                            </div>
                            </div>
                    }
                    {
                        !this.state.isThirdParty
                            ? null
                            : <div className='phone-group btn-group'>
                            <button className='btn-clear' style={{'width':'100%'}}
                                //disabled={!this.allValid()}
                                    onClick={()=>this.setState({showIOS1:true})}>
                                {
                                    this.state.oldPhone
                                        ? '更换手机号码'
                                        : '绑定手机号码'
                                }
                            </button>
                        </div>
                    }
                    <div className="return" onClick={()=>{browserHistory.goBack();}}>
                        <i className="ic-aeeow-32-white"/>
                    </div>
                    <div onClick={() => {this.setState({showIOS1: false})}}>
                        <Dialog type="ios"  title={
                            this.state.oldPhone
                                ? '更换手机号码'
                                : '绑定手机号码'
                        } buttons={buttons1} show={showIOS1} className="backList"
                                onClick={(e) => e.stopPropagation()}>
                            <div className="list">
                                <div className="DialogShowHide" onClick={() => {
                                    this.setState({
                                        showIOS1: false
                                    })
                                }}> &times;</div>
                                <div className="f--hlc">
                                    <div className="flex-1">
                                        <input type="tel" maxLength='11' placeholder="请输入新的手机号码"
                                               value={this.state.cellPhone}
                                               onChange={e=>this.setState({cellPhone:e.target.value})}/>
                                    </div>
                                </div>
                                <div className="f--hlc">
                                    <div className="flex-1">
                                        <input type="number" placeholder="输入验证码"
                                               value={this.state.phoneCode}
                                               onChange={e=>this.setState({phoneCode:e.target.value})}/>
                                    </div>
                                    <PhoneCodeButton className='btn textHover'
                                                     info={this.getPhoneCodeInfo()}/>
                                </div>
                            </div>
                        </Dialog>
                    </div>
                    <Dialog type="ios" title={"提示"} buttons={buttons} show={this.state.showWarning}>
                        {this.state.warningMsg}
                    </Dialog>
                    {
                        this.state.isLoading
                            ? <div className='app-loading trans-loading f--hcc'>
                            <div className="loading">
                                <div/>
                            </div>
                        </div>
                            : null
                    }
                </div>
            </div>
        )

    }
}

export default UserPhone;
