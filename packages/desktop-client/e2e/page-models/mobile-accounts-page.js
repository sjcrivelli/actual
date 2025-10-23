import { MobileAccountPage } from './mobile-account-page';
export class MobileAccountsPage {
    page;
    accountList;
    accountListItems;
    constructor(page) {
        this.page = page;
        this.accountList = this.page.getByLabel('Account list');
        this.accountListItems = this.accountList.getByTestId('account-list-item');
    }
    async waitFor(...options) {
        await this.accountList.waitFor(...options);
    }
    /**
     * Get the name and balance of the nth account
     */
    async getNthAccount(idx) {
        const accountRow = this.accountListItems.nth(idx);
        return {
            name: accountRow.getByTestId('account-name'),
            balance: accountRow.getByTestId('account-balance'),
        };
    }
    /**
     * Click on the n-th account to open it up
     */
    async openNthAccount(idx) {
        await this.accountListItems.nth(idx).click();
        return new MobileAccountPage(this.page);
    }
}
