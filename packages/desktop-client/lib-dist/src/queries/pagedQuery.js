// @ts-strict-ignore
import { once } from 'loot-core/shared/async';
import { getPrimaryOrderBy } from 'loot-core/shared/query';
import { aqlQuery } from './aqlQuery';
import { LiveQuery } from './liveQuery';
export function pagedQuery(query, { onData, onError, onPageData, options = {}, }) {
    return PagedQuery.runPagedQuery(query, onData, onError, onPageData, options);
}
// Paging
export class PagedQuery extends LiveQuery {
    get hasNext() {
        return !this._hasReachedEnd;
    }
    get totalCount() {
        return this._totalCount;
    }
    constructor(query, onData, onError, onPageData, options = {}) {
        super(query, onData, onError, options);
        this.fetchCount = () => {
            return aqlQuery(this.query.calculate({ $count: '*' })).then(({ data }) => {
                this._totalCount = data;
            });
        };
        this.run = () => {
            this.subscribe();
            this._fetchDataPromise = this.fetchData(async () => {
                this._hasReachedEnd = false;
                // Also fetch the total count
                this.fetchCount();
                // If data is null, we haven't fetched anything yet so just
                // fetch the first page
                return aqlQuery(this.query.limit(this.data == null
                    ? this._pageCount
                    : Math.max(this.data.length, this._pageCount)));
            });
            return this._fetchDataPromise;
        };
        this.refetchUpToRow = async (id, defaultOrderBy) => {
            this._fetchDataPromise = this.fetchData(async () => {
                this._hasReachedEnd = false;
                // Also fetch the total count
                this.fetchCount();
                const orderDesc = getPrimaryOrderBy(this.query, defaultOrderBy);
                if (orderDesc == null) {
                    throw new Error(`refetchUpToRow requires a query with orderBy`);
                }
                const { field, order } = orderDesc;
                let result = await aqlQuery(this.query.filter({ id }).select(field));
                if (result.data.length === 0) {
                    // This row is not part of this set anymore, we can't do
                    // this. We stop early to avoid possibly pulling in a ton of
                    // data that we don't need
                    return;
                }
                const fullRow = result.data[0];
                result = await aqlQuery(this.query.filter({
                    [field]: {
                        [order === 'asc' ? '$lte' : '$gte']: fullRow[field],
                    },
                }));
                const data = result.data;
                // Load in an extra page to make room for the UI to show some
                // data after it
                result = await aqlQuery(this.query
                    .filter({
                    [field]: {
                        [order === 'asc' ? '$gt' : '$lt']: fullRow[field],
                    },
                })
                    .limit(this._pageCount));
                return {
                    data: data.concat(result.data),
                    dependencies: result.dependencies,
                };
            });
            return this._fetchDataPromise;
        };
        this.onPageData = (data) => {
            this._onPageData(data);
        };
        // The public version of this function is created below and
        // throttled by `once`
        this._fetchNext = async () => {
            while (this.inflightRequestId) {
                await this._fetchDataPromise;
            }
            const previousData = this.data;
            if (!this._hasReachedEnd) {
                const { data } = await aqlQuery(this.query.limit(this._pageCount).offset(previousData.length));
                // If either there is an existing request in flight or the data
                // has already changed underneath it, we can't reliably concat
                // the data since it's different now. Need to re-run the whole
                // process again
                if (this.inflightRequestId || previousData !== this.data) {
                    return this._fetchNext();
                }
                else {
                    if (data.length === 0) {
                        this._hasReachedEnd = true;
                    }
                    else {
                        this._hasReachedEnd = data.length < this._pageCount;
                        const prevData = this.data;
                        this.updateData(currentData => currentData.concat(data));
                        // Handle newly loaded page data
                        this.onPageData(data);
                        // Handle entire data
                        this.onData(this.data, prevData);
                    }
                }
            }
        };
        this.fetchNext = once(this._fetchNext);
        this.optimisticUpdate = (updateFn) => {
            const previousData = this.data;
            this._optimisticUpdate(updateFn);
            this._totalCount += this.data.length - previousData.length;
        };
        this._totalCount = 0;
        this._pageCount = options.pageCount || 500;
        this._fetchDataPromise = null;
        this._hasReachedEnd = false;
        this._onPageData = onPageData || (() => { });
    }
}
PagedQuery.runPagedQuery = (query, onData, onError, onPageData, options = {}) => {
    const pagedQuery = new PagedQuery(query, onData, onError, onPageData, options);
    pagedQuery.run();
    return pagedQuery;
};
