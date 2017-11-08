import React from 'react';
import {
    Dialog
} from 'react-weui';

let FootLoaderIcon = (<div style={{display: "block"}}><div className="weui-loadmore weui-loadmore_line"><img src="../../images/img-nomore.png" alt=""/></div></div>);

let NoDateNode = (<div className="noData"><p><i className="ic-nodata"></i></p><p>{/*还没有相关数据*/}</p></div>);
class Prompt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorTitle: "错误！",
            errorButtons: [{
                type: 'primary',
                label: '确认',
                onClick: e => {
                    this.setState({errorShowIOS: false});
                    this.props.outFn && this.props.outFn();
                    this.props.changShow && this.props.changShow();
                }
            }],
            errorShowIOS: false,
        }
    }

    render() {

        const {errorTitle, errorButtons, errorShowIOS} = this.state;
        const {errTitle, ErrButtons, ErrShowIOS, ErrContent} = this.props.AERR;
        return (
            <Dialog type="ios" title={errTitle || errorTitle} buttons={ErrButtons || errorButtons}
                    show={ErrShowIOS || errorShowIOS}>
                {ErrContent}
            </Dialog>
        )
    }
}
export  {FootLoaderIcon, NoDateNode, Prompt};
