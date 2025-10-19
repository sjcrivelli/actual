import { send } from '../../../loot-core/src/platform/client/fetch';
export async function aqlQuery(query) {
    return send('query', query.serialize());
}
