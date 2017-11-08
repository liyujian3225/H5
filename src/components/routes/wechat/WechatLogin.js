/**
 * Created by Brian on 19/03/2017.
 */
import React from 'react';
import { Req } from '../../../utils/request';
import { loginType, getBrowserType } from '../../../utils/util';
import { saveLoginInfo } from '../../../utils/auth';
import { browserHistory } from 'react-router';

class WechatLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo: null
        };
        this.setInfo = this.setInfo.bind(this);
    }

    componentDidMount() {
        //对code处理和微信登录
        let code = this.props.location.query.code;
        if(code!=undefined) {
            //尝试微信登录
            Req.userLogin(loginType.wechat, {'code':code}).then(function (result) {
                //保存信息并调转
                if(result) {
                    saveLoginInfo(result, true);
                    browserHistory.push('/');
                }
            }.bind(this)).catch(function (errorCode) {
                this.setInfo(false);
            }.bind(this));
        } else {
            this.setInfo(false);
        }
    }

    setInfo(success) {
        if(success) {
            //成功时候的信息和设置
        } else {
            let info = 'code';
            if(getBrowserType() === 'wechat') {
                info = 'error';
            }
            this.setState({
                showInfo: info
            })
        }
    }

    render() {
        return (
            <div className='wechat-login'>
                <div className='login-layer'>
                    {
                        this.state.showInfo === 'code'
                            ? <div className='wechat-info f--hcc'>
                            <div className='wechat-group'>
                                <img className='wechat-code' src='../../../images/wechat-code.jpg'/>
                                <div className='wechat-notice'>
                                    关注官方公众号获取更多详情
                                </div>
                            </div>
                        </div>
                            : this.state.showInfo === 'error'
                            ? <div style={{'textAlign': 'center'}}>WECHAT LOGIN ERROR</div>
                            : <div className='app-loading f--hcc'>
                            <div className="loading">
                                <div/>
                            </div>
                        </div>
                    }
                </div>

            </div>
        );
    }
}

export default WechatLogin;
