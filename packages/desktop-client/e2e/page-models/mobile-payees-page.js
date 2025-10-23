export class MobilePayeesPage {
    page;
    searchBox;
    payeesList;
    emptyMessage;
    loadingIndicator;
    constructor(page) {
        this.page = page;
        this.searchBox = page.getByPlaceholder('Filter payees…');
        this.payeesList = page.getByRole('grid', { name: 'Payees' });
        this.emptyMessage = page.getByText('No payees found.');
        this.loadingIndicator = page.getByTestId('animated-loading');
    }
    async waitFor(options) {
        await this.payeesList.waitFor(options);
    }
    /**
     * Search for payees using the search box
     */
    async searchFor(text) {
        await this.searchBox.fill(text);
    }
    /**
     * Clear the search box
     */
    async clearSearch() {
        await this.searchBox.fill('');
    }
    /**
     * Get the nth payee item (0-based index)
     */
    getNthPayee(index) {
        return this.getAllPayees().nth(index);
    }
    /**
     * Get all visible payee items
     */
    getAllPayees() {
        return this.payeesList.getByRole('gridcell');
    }
    /**
     * Click on a payee to view/edit rules
     */
    async clickPayee(index) {
        const payee = this.getNthPayee(index);
        await payee.click();
    }
    /**
     * Get the number of visible payees
     */
    async getPayeeCount() {
        const payees = this.getAllPayees();
        return await payees.count();
    }
    /**
     * Wait for loading to complete
     */
    async waitForLoadingToComplete(timeout = 10000) {
        await this.loadingIndicator.waitFor({ state: 'hidden', timeout });
    }
}
