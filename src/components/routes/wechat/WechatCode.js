/**
 * Created by Brian on 19/03/2017.
 */
import React from 'react';

class WechatCode extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='wechat-code'>
                <div className='code-layer'>
                    <div className='wechat-info f--hcc'>
                        <div className='wechat-group'>
                            <img className='wechat-code' src='../../../images/wechat-code.jpg'/>
                            <div className='wechat-notice'>
                                关注官方公众号获取更多详情
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WechatCode;
