// @ts-strict-ignore
import { listen } from 'loot-core/platform/client/fetch';
import { aqlQuery } from './aqlQuery';
export function liveQuery(query, { onData, onError, options = {}, }) {
    return LiveQuery.runLiveQuery(query, onData, onError, options);
}
// Subscribe and refetch
export class LiveQuery {
    get query() {
        return this._query;
    }
    get data() {
        return this._data;
    }
    set data(data) {
        this._data = data;
    }
    get isRunning() {
        return this._unsubscribeSyncEvent != null;
    }
    get inflightRequestId() {
        return this._inflightRequestId;
    }
    set inflightRequestId(id) {
        this._inflightRequestId = id;
    }
    constructor(query, onData, onError, options = {}) {
        this.addListener = (func) => {
            this._listeners.push(func);
            return () => {
                this._listeners = this._listeners.filter(l => l !== func);
            };
        };
        this.onData = (data, prevData) => {
            for (let i = 0; i < this._listeners.length; i++) {
                this._listeners[i](data, prevData);
            }
        };
        this.onError = (error) => {
            this._onError(error);
        };
        this.onUpdate = (tables) => {
            // We might not know the dependencies if the first query result
            // hasn't come back yet
            if (this._dependencies == null ||
                tables.find(table => this._dependencies.has(table))) {
                this.run();
            }
        };
        this.run = () => {
            this.subscribe();
            return this.fetchData(() => aqlQuery(this._query));
        };
        this.subscribe = () => {
            if (this._unsubscribeSyncEvent == null) {
                this._unsubscribeSyncEvent = listen('sync-event', event => {
                    // If the user is doing optimistic updates, they don't want to
                    // always refetch whenever something changes because it would
                    // refetch all data after they've already updated the UI. This
                    // voids the perf benefits of optimistic updates. Allow querys
                    // to only react to remote syncs. By default, queries will
                    // always update to all changes.
                    if ((event.type === 'applied' || event.type === 'success') &&
                        this._supportedSyncTypes.has(event.type)) {
                        this.onUpdate(event.tables);
                    }
                });
            }
        };
        this.unsubscribe = () => {
            if (this._unsubscribeSyncEvent) {
                this._unsubscribeSyncEvent();
                this._unsubscribeSyncEvent = null;
            }
        };
        this._optimisticUpdate = (updateFn) => {
            const previousData = this.data;
            this.updateData(updateFn);
            this.onData(this.data, previousData);
        };
        this.optimisticUpdate = (dataFunc) => {
            this._optimisticUpdate(dataFunc);
        };
        this.updateData = (updateFn) => {
            this.data = updateFn(this.data);
        };
        this.fetchData = async (runQuery) => {
            // TODO: precompile queries, or cache compilation results on the
            // backend. could give a query an id which makes it cacheable via
            // an LRU cache
            const reqId = Math.random();
            this.inflightRequestId = reqId;
            try {
                const { data, dependencies } = await runQuery();
                // Regardless if this request was cancelled or not, save the
                // dependencies. The query can't change so all requests will
                // return the same deps.
                if (this._dependencies == null) {
                    this._dependencies = new Set(dependencies);
                }
                // Only fire events if this hasn't been cancelled and if we're
                // still subscribed (`this.unsubscribeSyncEvent` will exist)
                if (this.inflightRequestId === reqId && this._unsubscribeSyncEvent) {
                    const previousData = this.data;
                    // For calculate queries, data is a raw value, not an array
                    // Convert it to an array format to maintain consistency
                    if (this._query.state.calculation) {
                        this.data = [data];
                    }
                    else {
                        this.data = data;
                    }
                    this.onData(this.data, previousData);
                    this.inflightRequestId = null;
                }
            }
            catch (e) {
                console.log('Error fetching data', e);
                this.onError(e);
            }
        };
        this._query = query;
        this._data = null;
        this._dependencies = null;
        this._listeners = [];
        this._onError = onError || (() => { });
        // TODO: error types?
        this._supportedSyncTypes = options.onlySync
            ? new Set(['success'])
            : new Set(['applied', 'success']);
        if (onData) {
            this.addListener(onData);
        }
    }
}
LiveQuery.runLiveQuery = (query, onData, onError, options = {}) => {
    const liveQuery = new LiveQuery(query, onData, onError, options);
    liveQuery.run();
    return liveQuery;
};
