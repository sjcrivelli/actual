// @ts-strict-ignore
import { logger } from '../../platform/server/log';
import { handlers } from '../main';
import { importActual } from './actual';
import * as YNAB4 from './ynab4';
import * as YNAB5 from './ynab5';
const importers = {
    ynab4: YNAB4,
    ynab5: YNAB5,
};
export async function handleBudgetImport(type, filepath, buffer) {
    if (type === 'actual') {
        return importActual(filepath, buffer);
    }
    const importer = importers[type];
    try {
        let data;
        let budgetName;
        try {
            data = importer.parseFile(buffer);
            budgetName = importer.getBudgetName(filepath, data);
        }
        catch (e) {
            logger.error('failed to parse file', e);
        }
        if (!budgetName) {
            return { error: 'not-' + type };
        }
        try {
            await handlers['api/start-import']({ budgetName });
        }
        catch (e) {
            logger.error('failed to start import', e);
            return { error: 'unknown' };
        }
        await importer.doImport(data);
    }
    catch (e) {
        await handlers['api/abort-import']();
        logger.error('failed to run import', e);
        return { error: 'unknown' };
    }
    await handlers['api/finish-import']();
}
