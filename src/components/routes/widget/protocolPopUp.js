/**
 * Created by Brian on 6/05/2017.
 */
import React from 'react';
import $class from 'classnames';
import {protocols} from '../../../utils/protocol';

import '../../../styles/protocol.scss';

class ProtocolPopUp extends React.Component {
    constructor(props) {
        super(props);
        let protocol = this.getProtocol(props.type);
        this.state = {
            header: protocol.header,
            protocol: protocol.protocol,
            isHidden: true,
        };

        this.getProtocol = this.getProtocol.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    getProtocol(type) {
        if (type) {
            if (protocols[type]) {
                return protocols[type];
            } else {
                return {
                    header: '暂无规则',
                    protocol: [],
                }
            }
        } else {
            return {
                header: '暂无规则',
                protocol: [],
            }
        }
    }

    show() {
        if (this.state.isHidden) {
            this.setState({
                isHidden: !this.state.isHidden
            })
        }
    }

    hide() {
        if (!this.state.isHidden) {
            this.setState({
                isHidden: !this.state.isHidden
            })
        }
    }

    onConfirm() {
        this.hide();
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render() {
        let protocol = (v, i) => {
            let text = null;
            let additionalClassName = v.className ? v.className : '';
            switch (v.type) {
                case 'head':
                    text = <h1 key={i} className={$class('content protocol-head', additionalClassName)}>
                        {v.text}
                    </h1>;
                    break;
                case 'title':
                    text = <h2 key={i} className={$class('content protocol-title', additionalClassName)}>
                        {v.text}
                    </h2>;
                    break;
                case 'subTitle':
                    text = <h3 key={i} className={$class('content protocol-subTitle', additionalClassName)}>
                        {v.text}
                    </h3>;
                    break;
                case 'bold':
                    text = <p key={i} className={$class('content protocol-bold', additionalClassName)}>
                        {v.text}
                    </p>;
                    break;
                default:
                    text = <p key={i} className={$class('content protocol-normal', additionalClassName)}>
                        {v.text}
                    </p>;
                    break;
            }
            return text;
        };

        return <div
                onTouchMove={(event) => {
                    event.preventDefault();
                }}
                className={$class('protocol-pop-up',
                    this.props.className ? this.props.className : '',
                    {'hidden': this.state.isHidden})}>
            <div className="weui-mask"></div>
            <div className="weui-dialog">
                <div className="weui-dialog__hd">
                    <strong className="weui-dialog__title protocol-header">{this.state.header}</strong>
                </div>
                <div className="weui-dialog__bd protocol-body"
                     onTouchMove={(event) => {
                         //event.preventDefault();
                         event.stopPropagation();
                     }}>
                    {
                        this.state.protocol.map(protocol)
                    }
                </div>
                <div className="weui-dialog__ft">
                    <button className='btn-clear weui-dialog__btn weui-dialog__btn_primary'
                            onClick={this.onConfirm}>
                        我知道了
                    </button>
                </div>
            </div>
        </div>;
    }
}

export default ProtocolPopUp;
