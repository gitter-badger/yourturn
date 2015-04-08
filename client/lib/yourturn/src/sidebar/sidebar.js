import $ from 'jquery';
import {history} from 'backbone';
import BaseView from 'common/src/base-view';
import Template from './sidebar.hbs';
import 'common/asset/scss/yourturn/sidebar.scss';

class SidebarView extends BaseView {
    constructor() {
        this.state = {};
        this.tagName = 'aside';
        this.className = 'sidebar';
        this.events = {
            'click .sidebar-item': 'transition'
        };
        super();
    }

    /**
     * Checks if this sidebar item has a data-route
     * attribute. If it does, navigates to this route.
     */
    transition(evt) {
        let $target = $(evt.currentTarget),
            route = $target.attr('data-route') || false;
        if (route) {
            history.navigate(route, {
                trigger: true
            });
        }
    }

    render() {
        this.$el.html( Template( this.state ) );
        return this;
    }
}

export default SidebarView;