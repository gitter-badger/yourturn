/* globals ENV_TEST */
import _ from 'lodash';
import BaseView from 'common/src/base-view';
import Template from './application-list.hbs';
import 'common/asset/less/application/application-list.less';

class AppList extends BaseView {
    constructor(props) {
        props.className = 'applicationList';
        props.stores = {
            kio: props.flux.getStore('kio'),
            user: props.globalFlux.getStore('user')
        };
        props.events = {
            'keyup': 'filter',
            'submit': 'filter'
        };
        super(props);
        this.state = {
            term: ''
        };
    }

    update() {
        let userTeamIds = _.pluck(this.stores.user.getUserTeams(), 'id'),
            otherApps = this.stores.kio.getOtherApplications(this.state.term, userTeamIds),
            otherAppsHiddenCount = otherApps.length - 20 < 0 ? 0 : otherApps.length - 20;
        this.data = {
            teamApps: this.stores.kio.getTeamApplications(this.state.term, userTeamIds),
            otherApps: otherApps.splice(0, 20),
            otherAppsHiddenCount: otherAppsHiddenCount,
            term: this.state.term
        };
    }

    filter(evt) {
        evt.preventDefault();
        this.state.term = this.$el.find('input').val();
        this.update();
        this.render();
        this.$el.find('input[data-action="search"]').focus();

        // .setSelectionRange is not worth the effort to mock it in node tests
        if (!ENV_TEST) {
            this
            .$el
            .find('input[data-action="search"]')[0]
            .setSelectionRange(this.state.term.length, this.state.term.length);
        }
    }

    render() {
        this.$el.html(Template(this.data));
        return this;
    }
}

export default AppList;
