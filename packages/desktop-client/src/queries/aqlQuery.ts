import { send } from '../../../loot-core/src/platform/client/fetch';
import { type Query } from '../../../loot-core/src/shared/query';

export async function aqlQuery(query: Query) {
  return send('query', query.serialize());
}
