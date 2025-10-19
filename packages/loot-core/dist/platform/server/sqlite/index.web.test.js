"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-strict-ignore
const util_1 = require("../../../mocks/util");
// eslint-disable-next-line no-restricted-imports
const index_web_1 = require("./index.web");
beforeAll(async () => {
    const baseURL = `${__dirname}/../../../../../../node_modules/@jlongster/sql.js/dist/`;
    (0, util_1.patchFetchForSqlJS)(baseURL);
    return (0, index_web_1.init)({ baseURL });
});
const initSQL = `
CREATE TABLE numbers (id TEXT PRIMARY KEY, number INTEGER);
CREATE TABLE textstrings (id TEXT PRIMARY KEY, string TEXT);
`;
describe('Web sqlite', () => {
    it('should rollback transactions', async () => {
        const db = await (0, index_web_1.openDatabase)();
        (0, index_web_1.execQuery)(db, initSQL);
        (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id1', 4)");
        let rows = (0, index_web_1.runQuery)(db, 'SELECT * FROM numbers', null, true);
        expect(rows.length).toBe(1);
        // @ts-expect-error Property 'number' does not exist on type 'unknown'
        expect(rows[0].number).toBe(4);
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => null);
        expect(() => {
            (0, index_web_1.transaction)(db, () => {
                (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id2', 5)");
                (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id3', 6)");
                // Insert an invalid one that will error
                (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id1', 1)");
            });
        }).toThrow(/constraint failed/);
        consoleSpy.mockRestore();
        // Nothing should have changed in the db
        rows = (0, index_web_1.runQuery)(db, 'SELECT * FROM numbers', null, true);
        expect(rows.length).toBe(1);
        // @ts-expect-error Property 'number' does not exist on type 'unknown'
        expect(rows[0].number).toBe(4);
    });
    it('should support nested transactions', async () => {
        const db = await (0, index_web_1.openDatabase)();
        (0, index_web_1.execQuery)(db, initSQL);
        (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id1', 4)");
        let rows = (0, index_web_1.runQuery)(db, 'SELECT * FROM numbers', null, true);
        expect(rows.length).toBe(1);
        // @ts-expect-error Property 'number' does not exist on type 'unknown'
        expect(rows[0].number).toBe(4);
        (0, index_web_1.transaction)(db, () => {
            (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id2', 5)");
            (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id3', 6)");
            // Only this transaction should fail
            const consoleSpy = vi
                .spyOn(console, 'log')
                .mockImplementation(() => null);
            expect(() => {
                (0, index_web_1.transaction)(db, () => {
                    (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id4', 7)");
                    // Insert an invalid one that will error
                    (0, index_web_1.runQuery)(db, "INSERT INTO numbers (id, number) VALUES ('id1', 1)");
                });
            }).toThrow(/constraint failed/);
            consoleSpy.mockRestore();
        });
        // Nothing should have changed in the db
        rows = (0, index_web_1.runQuery)(db, 'SELECT * FROM numbers', null, true);
        expect(rows.length).toBe(3);
        // @ts-expect-error Property 'number' does not exist on type 'unknown'
        expect(rows[0].number).toBe(4);
        // @ts-expect-error Property 'number' does not exist on type 'unknown'
        expect(rows[1].number).toBe(5);
        // @ts-expect-error Property 'number' does not exist on type 'unknown'
        expect(rows[2].number).toBe(6);
    });
    it('should match regex on text fields', async () => {
        const db = await (0, index_web_1.openDatabase)();
        (0, index_web_1.execQuery)(db, initSQL);
        (0, index_web_1.runQuery)(db, "INSERT INTO textstrings (id, string) VALUES ('id1', 'not empty string')");
        (0, index_web_1.runQuery)(db, "INSERT INTO textstrings (id) VALUES ('id2')");
        const rows = (0, index_web_1.runQuery)(db, 'SELECT id FROM textstrings where REGEXP("n.", string)', null, true);
        expect(rows.length).toBe(1);
        // @ts-expect-error Property 'id' does not exist on type 'unknown'
        expect(rows[0].id).toBe('id1');
    });
});
