import BaseView from 'common/src/base-view';
import Template from './version-detail.hbs';
import Flux from 'application/src/flux';
import FetchResult from 'common/src/fetch-result';
import ErrorTpl from 'common/src/error.hbs';
import Placeholder from './placeholder.hbs';
import Markdown from 'common/src/markdown';

import 'common/asset/scss/application/version-detail.scss';

class VersionDetail extends BaseView {
    constructor( props ) {
        this.stores = {
            application: Flux.getStore('application')
        };
        this.className = 'versionDetail';
        super(props);
    }

    update() {
        let {applicationId} = this.props,
            {versionId} = this.props;
        this.data = {
            version: this.stores.application.getApplicationVersion( applicationId, versionId )
        };
    }

    render() {
        let {data, $el} = this;

        if (data.version instanceof FetchResult) {
            $el.html(
                data.version.isPending() ?
                Placeholder() :
                ErrorTpl( data.version.getResult() )
            );
        } else {
            $el.html( Template( data ) );
            $el
                .find('[data-action="markdown"]')
                .html(Markdown.render(data.version.notes));
        }
        return this;
    }
}

export default VersionDetail;