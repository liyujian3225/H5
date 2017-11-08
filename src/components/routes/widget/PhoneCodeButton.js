/**
 * Created by Brian on 8/04/2017.
 */
import React from 'react';
import { Req } from '../../../utils/request';
import {isRegExp} from '../../../utils/util';
/*
*  @props disabled和getResult不是必需的props
*
* */

class PhoneCodeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: -1,
            disabled: this.isButtonDisabled(props),
        };

        this.isButtonDisabled = this.isButtonDisabled.bind(this);
        this.onClick = this.onClick.bind(this);
        this.getPhoneCode = this.getPhoneCode.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);

        this.allowSendData = true; //允许发送info
    }

    isButtonDisabled(props) {
        let state = {disabled: false};
        if(props.disabled) {
            state.disabled = props.disabled;
            if(props.info&&props.info.phone!==undefined) {
                state.disabled = props.disabled || !isRegExp("phone",props.info.phone);
            }
        } else if(props.info&&props.info.phone!==undefined) {
            state.disabled = !isRegExp("phone",props.info.phone);
        }
        return state.disabled;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            info: nextProps.info,
            disabled: this.isButtonDisabled(nextProps),
        })
    }

    componentWillUnmount() {
        if(this.timer) {
            clearInterval(this.timer);
        }
    }

    onClick() {
        //返回点击事件
        if(this.props.onClick) {
            this.props.onClick();
        }
        if(this.props.info&&this.allowSendData&&isRegExp("phone",this.props.info.phone)) {
            this.getPhoneCode(this.props.info);
        }
    }

    getPhoneCode(info) {
        let data = {'cellphone': info.phone};
        if(info.uuid !== undefined) {
            data['uuid'] = info.uuid;
        }
        if(info.picCode !== undefined) {
            data['photoCode'] = info.picCode;
        }
        if(data['cellphone']!=='') {
            if(this.props.getResult) {
                this.props.getResult(Req.phoneCode(data),this.startTimer.bind(this));
            } else {
                this.startTimer();
                Req.phoneCode(data).catch(function () {
                    //有错误就显示
                }.bind(this));
            }
        }
    }

    startTimer() {
        this.allowSendData = false;
        let second = 60;
        this.setState({
            time: second
        },()=>{
            this.timer = setInterval(function () {
                second--;
                if(second === 0) {
                    this.resetTimer();
                } else {
                    this.setState({
                        time: second
                    })
                }
            }.bind(this), 1000);
        });
    }

    resetTimer() {
        clearInterval(this.timer);
        this.setState({
            time: -1
        },()=>{
            this.allowSendData = true;
        })
    }

    render() {
        let className = 'btn-clear' + this.props.className? ' '+this.props.className : '';
        return <button className={className}
                       disabled={this.state.disabled || this.state.time != -1}
                       onClick={this.onClick}>
            {
                this.state.time === -1
                    ? '获取验证码'
                    : this.state.time + 's后重试'
            }
        </button>;
    }
}

export default PhoneCodeButton;
