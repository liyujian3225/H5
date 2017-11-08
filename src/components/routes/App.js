import React from 'react';
import $class from 'classnames';
import { getBrowserType } from '../../utils/util';
import { isWechatAuth } from '../../utils/auth';

import AppStore from '../../stores/AppStore';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hideApp: true,
            isLoading: false,
        };

        this.onStatusChange = this.onStatusChange.bind(this);
    }

    componentDidMount() {
        this.unsubscribe = AppStore.listen(this.onStatusChange);
        //初始时候的loading
        this.onStatusChange(AppStore.startDefaultLoading('default', false));
        this.onStatusChange(AppStore.endDefaultLoading('default', false));
        let browserType = getBrowserType();
        switch(browserType) {
            case 'wechat':
                isWechatAuth().then(function () {
                    this.setState({
                        hideApp: false
                    })
                }.bind(this)).catch(function () {
                    //授权失败
                    this.setState({
                        hideApp: true
                    })
                }.bind(this));
                break;
            case 'mobile':
            case 'pc':
                this.setState({
                    hideApp: false
                });
                break;
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(status) {
        if(status.isLoading !== undefined) {
            this.setState({
                isLoading: status.isLoading
            })
        }
    }

    render() {
        return (
            <div className={$class('app',{'hidden':this.state.hideApp})}>
                {
                    !this.state.isLoading
                        ? null
                        : <div className='app-loading f--hcc'>
                        <div className="loading">
                            <div/>
                        </div>
                    </div>
                }
                {
                    this.props.children
                        ? this.props.children
                        : null
                }
            </div>
        );
    }
}

export default App;
