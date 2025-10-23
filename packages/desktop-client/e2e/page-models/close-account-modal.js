export class CloseAccountModal {
    locator;
    page;
    constructor(locator) {
        this.locator = locator;
        this.page = locator.page();
    }
    async selectTransferAccount(accountName) {
        await this.locator.getByPlaceholder('Select account...').fill(accountName);
        await this.page.keyboard.press('Enter');
    }
    async closeAccount() {
        await this.locator.getByRole('button', { name: 'Close account' }).click();
    }
}
