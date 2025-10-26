import { Query } from '../../shared/query';
import { compileAndRunAqlQuery, runCompiledAqlQuery, } from './exec';
import { schema, schemaConfig } from './schema';
import { schemaExecutors } from './schema/executors';
export { convertForInsert, convertForUpdate, convertFromSelect, convertInputType, } from './schema-helpers';
export { compileQuery } from './compiler';
export { makeViews } from './views';
export { schema, schemaConfig } from './schema';
export function aqlCompiledQuery(queryState, sqlPieces, compilerState, params) {
    return runCompiledAqlQuery(queryState, sqlPieces, compilerState, {
        params,
        executors: schemaExecutors,
    });
}
export function aqlQuery(query, params) {
    if (query instanceof Query) {
        query = query.serialize();
    }
    return compileAndRunAqlQuery(schema, schemaConfig, query, {
        params,
        executors: schemaExecutors,
    });
}
