/**
 * Created by Brian on 8/04/2017.
 */
import React from 'react';
import $class from 'classnames';
import { browserHistory } from 'react-router';
import PhoneCodeButton from '../widget/PhoneCodeButton';
import { Dialog } from 'react-weui';
import { Req } from '../../../utils/request';
import { saveLoginInfo } from '../../../utils/auth';
import { getReturnUrl, genUuid, isRegExp } from '../../../utils/util';

import '../../../styles/UserLogin.scss';

class UserLogin extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            uuid: genUuid(8,16),
            loginInfo: {
                phone: '',
                picCode: '',
                phoneCode: ''
            },
            showWarning: false,
            warningMsg: '',
        };

        this.returnUrl = getReturnUrl(); //获取回调地址

        this.genPicCodePic = this.genPicCodePic.bind(this);

        this.getInputDefaultProps = this.getInputDefaultProps.bind(this);
        this.onChangeProps = this.onChangeProps.bind(this);

        this.getPhoneCodeInfo = this.getPhoneCodeInfo.bind(this);
        this.getPhoneCodeResult = this.getPhoneCodeResult.bind(this);
        this.disablePhoneCodeBtn = this.disablePhoneCodeBtn.bind(this);

        this.doLogin = this.doLogin.bind(this);
        this.onLoginSubmit = this.onLoginSubmit.bind(this);

        this.isValidValue = this.isValidValue.bind(this); //是否合法
        this.allValid = this.allValid.bind(this);  //全部合法
        this.isCorrectInput = this.isCorrectInput.bind(this); //是否错误输入

        this.backHome = this.backHome.bind(this);
    }

    genPicCodePic() {
        this.setState({
            uuid: genUuid(8,16),
        });
    }

    onChangeProps(type, e) {
        let value = e.target.value;
        let loginInfo = this.state.loginInfo;
        switch (type){
            case 'phone':
                loginInfo.phone = value;
                break;
            case 'picCode':
                loginInfo.picCode = value;
                break;
            case 'phoneCode':
                loginInfo.phoneCode = value;
                break;
        }
        this.setState({
            loginInfo: loginInfo
        })
    }

    getInputDefaultProps(type) {
        let value = '';
        let placeholder = '';
        let className = 'login-input';
        let loginInfo = this.state.loginInfo;
        switch (type){
            case 'phone':
                value = loginInfo.phone;
                placeholder = '手机号';
                break;
            case 'picCode':
                value = loginInfo.picCode;
                placeholder = '验证码';
                className = className + ' code-input';
                break;
            case 'phoneCode':
                value = loginInfo.phoneCode;
                placeholder = '手机验证码';
                className = className + ' code-input';
                break;
        }
        let defaultProps = {
            value: value,
            className: className,
            placeholder: placeholder,
            onChange: this.onChangeProps.bind(this, type),
        };
        return defaultProps;
    }

    getPhoneCodeInfo() {
        let loginInfo = this.state.loginInfo;
        return {phone: loginInfo.phone, picCode:loginInfo.picCode, uuid:this.state.uuid};
    }

    disablePhoneCodeBtn() {
        let loginInfo = this.state.loginInfo;
        return (loginInfo.phone===''||loginInfo.picCode==='');
    }

    getPhoneCodeResult(result,startTimer) {
        result.then(function () {
            console.log('success');
            startTimer()
        }.bind(this)).catch(function () {

            this.setState({
                showWarning:true,
                warningMsg:"图形验证码无效"
            })
        }.bind(this));
    }

    doLogin() {
        let loginInfo = this.state.loginInfo;
        let data = {'cellphone': loginInfo.phone, 'phoneCode':loginInfo.phoneCode};
        Req.login(data).then(function (result) {
            //成功
            if(result) {
                saveLoginInfo(result, false);
                if(this.returnUrl !== '/') {
                    browserHistory.push(this.returnUrl);
                } else {
                    browserHistory.goBack();
                }
            }
        }.bind(this)).catch(function(res) {
            let state = {warningMsg: '请输入正确内容！', showWarning: true};
            if(res.msg) {
                state.warningMsg = res.msg;
            }
            this.setState(state);
        }.bind(this));
    }

    onLoginSubmit() {
        this.doLogin();
    }

    backHome() {
        browserHistory.goBack();
    }

    isCorrectInput(type) {
        let result = this.isValidValue(type);
        switch (type){
            case 'phone':
                result = (result && this.state.loginInfo.phone !== '') || this.state.loginInfo.phone === '';
                break;
            case 'picCode':
                result = result && this.state.loginInfo.picCode !== '' || this.state.loginInfo.picCode === '';
                break;
            case 'phoneCode':
                result = result && this.state.loginInfo.phoneCode !== '' || this.state.loginInfo.phoneCode === '';
                break;
        }
        return result;
    }

    isValidValue(type) {
        switch (type){
            case 'phone':
                return isRegExp('phone', this.state.loginInfo.phone);
                break;
            case 'picCode':
                return isRegExp('picCode', this.state.loginInfo.picCode);
                break;
            case 'phoneCode':
                return isRegExp('phoneCode', this.state.loginInfo.phoneCode);
                break;
        }
    }

    allValid() {
        return this.isValidValue('phone') && this.isValidValue('picCode') && this.isValidValue('phoneCode');
    }

    render() {
        const buttons = [{
                type: 'primary',
                label: '确认',
                onClick: () => {

                    this.setState({showWarning: false});
                    (this.state.warningMsg =="图形验证码无效")&& this.genPicCodePic();
                }
        }];
        return <div className='user-login f--hcc'>
            <div className='login-container'>
                <div className={$class('login-group input-group', {'error':!this.isCorrectInput('phone')})}>
                    <div className='f--hlc'>
                        <input type='tel' {...this.getInputDefaultProps('phone')}/>
                    </div>
                </div>
                <div className={$class('login-group input-group', {'error':!this.isCorrectInput('picCode')})}>
                    <div className='f--hlc'>
                        <input {...this.getInputDefaultProps('picCode')} maxLength={4} />
                        <img onClick={this.genPicCodePic} src={Req.picCode(this.state.uuid)}/>
                    </div>
                </div>
                <div className={$class('login-group input-group', {'error':!this.isCorrectInput('phoneCode')})}>
                    <div className='f--hlc'>
                        <input type='number' {...this.getInputDefaultProps('phoneCode')}  maxLength={8} />
                        <PhoneCodeButton className='phone-code-btn'
                                         info={this.getPhoneCodeInfo()}
                                         disabled={this.disablePhoneCodeBtn()}
                                         getResult={this.getPhoneCodeResult}/>
                    </div>
                </div>
                <div className='login-group btn-group'>
                    <button className='btn-clear login-btn'
                            disabled={!this.allValid()}
                            onClick={this.onLoginSubmit}>登录</button>
                </div>
                <div className="return" onClick={this.backHome}>
                    <i className="ic-aeeow-32-white" />
                </div>
                <Dialog type="ios" title={"提示"} buttons={buttons} show={this.state.showWarning}>
                    {this.state.warningMsg}
                </Dialog>
            </div>
        </div>
    }
}

export default UserLogin;
