import * as AQL from './aqlQuery.js';

// Support named, default, or CJS namespace styles
const Resolved = AQL.aqlQuery ?? AQL.default ?? AQL;

export const aqlQuery = Resolved;
export default Resolved;
