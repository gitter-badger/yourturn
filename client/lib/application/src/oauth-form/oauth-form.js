import BaseView from 'common/src/base-view';
import Template from './oauth-form.hbs';
import Placeholder from './placeholder.hbs';
import ErrorTpl from 'common/src/error.hbs';
import SearchableList from 'common/src/searchable-list/searchable-list';
import FetchResult from 'common/src/fetch-result';
import {history} from 'backbone';
import {constructLocalUrl} from 'common/src/data/services';
import 'common/asset/less/application/oauth-form.less';
import 'common/asset/less/application/oauth-sync-info.less';

class OAuthForm extends BaseView {
    constructor(props) {
        props.className = 'oAuthForm';
        props.stores = {
            user: props.globalFlux.getStore('user'),
            mint: props.flux.getStore('mint'),
            essentials: props.flux.getStore('essentials'),
            kio: props.flux.getStore('kio')
        };
        props.events = {
            'submit': 'save'
        };
        super(props);
    }

    /**
     * Saves the OAuth configuration and return to the detail view
     * if successful. Shows notification otherwise.
     */
    save(evt) {
        evt.preventDefault();
        let {$el} = this,
            scopes = this.stores.essentials.getAllScopes(),
            ownerscopes = this.ownerscopeList
                            .getSelection()
                            .map(s => s.split('.'))
                            .map(([resourceId, id]) => ({
                                resource_type_id: resourceId,
                                scope_id: id
                            })),
            appscopes = this
                            .data
                            .oauth
                            .scopes
                            .filter(scope => scopes.some(scp => scp.resource_type_id === scope.resource_type_id &&
                                                             scp.id === scope.scope_id &&
                                                             !scp.is_resource_owner_scope)),
            isNonConfidential = $el.find('#oauth_is_client_non_confidential:checked').length !== 0,
            redirectUrl = $el.find('#oauth_redirect_url').val(),
            oauthConfig = {
                s3_buckets: this.data.oauth.s3_buckets,
                scopes: ownerscopes.concat(appscopes),
                redirect_url: redirectUrl,
                is_client_confidential: !isNonConfidential
            },
            {applicationId} = this.props;

        this
        .props
        .flux
        .getActions('mint')
        .saveOAuthConfig(applicationId, oauthConfig)
        .then(() => {
            history.navigate(constructLocalUrl('application', [applicationId]), {trigger: true});
        })
        .catch(e => {
            this
            .props
            .globalFlux
            .getActions('notification')
            .addNotification(
                'Could not save OAuth client configuration for ' + applicationId + '. ' + e.message,
                'error');
        });
    }

    /**
     * Makes new data available to templates.
     */
    update() {
        let scopes = this.stores.essentials.getAllScopes(),
            application = this.stores.kio.getApplication(this.props.applicationId);
        this.data = {
            application: application,
            applicationId: this.props.applicationId,
            isOwnApplication: this.stores.user
                                    .getUserTeams()
                                    .map(team => team.id)
                                    .some(id => id === application.team_id),
            ownerScopes: scopes.filter(s => s.is_resource_owner_scope),
            appScopes: scopes.filter(s => !s.is_resource_owner_scope),
            oauth: this.stores.mint.getOAuthConfig(this.props.applicationId)
        };
    }

    render() {
        let {oauth} = this.data;
        if (oauth instanceof FetchResult) {
            this.$el.html(
                oauth.isPending() ?
                    Placeholder(this.data) :
                    ErrorTpl(oauth.getResult()));
            return this;
        }
        this.$el.html(Template(this.data));
        this.ownerscopeList = new SearchableList({
            items: this.data.ownerScopes,
            selected: oauth.scopes.map(s => `${s.resource_type_id}.${s.scope_id}`)
        });
        this.$el
            .find('[data-action="ownerscope-list"]')
            .html(this.ownerscopeList.render().$el);
        return this;
    }
}

export default OAuthForm;
