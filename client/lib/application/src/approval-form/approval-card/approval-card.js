import BaseView from 'common/src/base-view';
import Template from './approval-card.hbs';
import Markdown from 'common/src/markdown';
import moment from 'moment';
import {DATE_FORMAT} from 'common/src/config';
import 'common/asset/less/application/approval-card.less';

class ApprovalCard extends BaseView {
    constructor(props) {
        props.className = 'approvalCard';
        props.events = {
            'click': 'toggleDetails'
        };
        super(props);
        this.state = {
            toggled: false
        };
    }

    toggleDetails() {
        this.state.toggled = !this.state.toggled;
        this.$el.find('.approvalCard-details').toggle(this.state.toggled);
    }

    render() {
        this.props.approval.humanTimestamp = moment(this.props.approval.timestamp).format(DATE_FORMAT);
        this.$el.html(Template(this.props));
        this.$el.find('.approvalCard-notes').html(Markdown.render(this.props.approval.notes));
        return this;
    }
}

export default ApprovalCard;
