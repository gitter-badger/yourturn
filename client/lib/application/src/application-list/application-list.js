import BaseView from 'common/src/base-view';
import Template from './application-list.hbs';
import Flux from 'application/src/flux';
import 'common/asset/scss/application/application-list.scss';

class AppDetail extends BaseView {
    constructor() {
        super({
            className: 'applicationList'
        });
        this.store = Flux.getStore('application');
    }

    update() {
        this.data = {
            apps: this.store.getApplications()
        };
    }

    render() {
        this.$el.html( Template( this.data ) );
        return this;
    }
}

export default AppDetail;
