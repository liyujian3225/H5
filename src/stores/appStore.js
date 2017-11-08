/**
 * Created by Brian on 8/04/2017.
 */
import Reflux from 'reflux';
import Actions from '../actions/AppAction';

export default Reflux.createStore({
    init: function() {
        this.listenTo(Actions['startLoading'], this.startLoading);
        this.listenTo(Actions['endLoading'], this.endLoading);
        this.isLoading = false;
        this.urls = {};
    },

    startDefaultLoading: function() {
        this.startLoading('default', false);
        return {isLoading: true};
    },

    endDefaultLoading: function() {
        this.endLoading('default', false);
        if(Object.keys(this.urls).length === 0) {
            //没有请求就清除
            return {isLoading: false};
        } else {
            //还有请求就显示loading
            return {isLoading: true};
        }
    },

    startLoading: function (url, trigger) {
        if(!this.urls[url]) {
            this.urls[url] = true;
        }
        if(!this.isLoading) {
            this.isLoading = true;
            if(trigger !== false) {
                this.trigger({isLoading: this.isLoading});
            }
        }
    },

    endLoading: function (url, trigger) {
        if(this.urls[url]) {
            delete this.urls[url];
        }
        if(this.isLoading&&Object.keys(this.urls).length === 0) {
            this.isLoading = false;
            if(trigger !== false) {
                this.trigger({isLoading: this.isLoading});
            }
        }
    }
});
