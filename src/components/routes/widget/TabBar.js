/**
 * Created by Brian on 18/03/2017.
 *
 * Desc: 在weui的基础上封装tabbar
 */
import React from 'react';
import {Link} from 'react-router';

import WeUI from 'react-weui';
const {TabBar} = WeUI;

class AppTabBar extends React.Component {
    constructor(props) {
        super(props);

        this.defaultTabs = [{title: '首页', link: '/',icon:"/images/ic-home.png",ActiveIcon:"/images/ic-home-c.png"},
            {title:'个人中心', link:'/user_center',icon:"/images/ic-im.png",ActiveIcon:"/images/ic-im-c.png"}];
        this.authTabs =[{title: '跳过', link: '/'}, {title:'确定', link:'/'}];

        this.state = {
            tabbarList: this.getTabbarByType(props.tabbarType),
            selectIndex: props.selectedIndex!==undefined ? props.selectedIndex : 0,
        };
        this.getTabbarByType = this.getTabbarByType.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            tabbarList: this.getTabbarByType(nextProps.tabbarType),
            selectIndex: nextProps.selectedIndex!==undefined ? nextProps.selectedIndex : 0,
        });
    }

    getTabbarByType(type) {
        let list = [];
        switch (type){
            case 'auth':
                list = this.authTabs;
                break;
            default:
                list = this.defaultTabs;
                break;
        }
        return list;
    }

    render() {
        return (
            <TabBar>
                {
                    this.state.tabbarList.map((v,i)=>{
                        let className = 'weui-tabbar__item';
                        if(this.state.selectIndex === i) {
                            className += ' weui-bar__item_on';
                        }
                        return <Link to={v.link} key={i} className={className}>
                            {v.icon &&(<p><img src={this.state.selectIndex === i ? v.ActiveIcon : v.icon} /></p>)}
                            <p className="weui-tabbar__label">{v.title}</p>
                        </Link>
                    })
                }
            </TabBar>
        );
    }
}

export default AppTabBar;
