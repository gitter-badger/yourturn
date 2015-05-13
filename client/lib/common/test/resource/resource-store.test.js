/* globals expect */
import ResourceStore from 'common/src/data/resource/resource-store';
import ResourceActions from 'common/src/data/resource/resource-actions';
import FetchResult from 'common/src/fetch-result';
import {Flummox} from 'flummox';

class MockFlux extends Flummox {
    constructor() {
        super();

        this.createActions('resource', ResourceActions);
        this.createStore('resource', ResourceStore, this);
    }
}

describe('The resource store', () => {
    var store,
        flux = new MockFlux();

    beforeEach(() => {
        store = flux.getStore('resource');
    });

    afterEach(() => {
        store._empty();
    });

    it('should set a pending fetch result for a resource', () => {
        store.beginFetchResource('customer');
        let resource = store.getResource('customer');
        expect(resource instanceof FetchResult).to.be.true;
        expect(resource.isPending()).to.be.true;
    });

    it('should set a failed fetch result for a resource', () => {
        let err = new Error();
        err.id = 'customer';
        store.failFetchResource(err);
        let resource = store.getResource('customer');
        expect(resource instanceof FetchResult).to.be.true;
        expect(resource.isFailed()).to.be.true;
    });

    it('should receive scopes from multiple resources', () => {
        store.receiveScopes(['customer', [{
            description: 'Description',
            id: 'read_all',
            is_resource_owner_scope: false,
            summary: 'Grants read-access to all customer data',
            user_information: 'Read all base information'
        }]]);
        store.receiveScopes(['sales_order', [{
            id: 'read',
            summary: 'Grants read-access to the sales orders of a customer',
            description: 'Description',
            user_information: 'Read your Zalando orders',
            is_resource_owner_scope: true
        }]]);
        // they should be there
        let scopes = store.getAllScopes();
        expect(scopes.length).to.equal(2);
    });
});