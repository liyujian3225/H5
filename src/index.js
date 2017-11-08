import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './components/AppRouter';
import {isDev, setCookie, getCookie} from './utils/util';

require('weui');
require('react-weui/lib/react-weui.min.css');
require('normalize.css/normalize.css');
require('!style!css!sass!./styles/index.scss');

//开发模式自动添加cookies用于测试
// if (isDev&&!getCookie('_MCH_AT')) {
//     let authValue = 'i2zoMMEKWIoidjN7eCsO5fOsiF2MsJvQkK0Mik9K7SKiNXygM7FIjbh1bNZYEYPdRRxPlqa06cb2cvMgQap0Zvl3CM0I%2BNSXjQqVPBygisvu7nOqXWlRjTZ6EGyB4iC89cMuwSDBqm5LLlog6SONxQ%3D%3D';
//     setCookie('_MCH_AT', authValue);
// }
ReactDOM.render(<AppRouter />, document.getElementById('app'));
