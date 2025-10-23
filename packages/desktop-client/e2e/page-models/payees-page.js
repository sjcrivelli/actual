export class PayeesPage {
    page;
    searchBox;
    constructor(page) {
        this.page = page;
        this.searchBox = page.getByPlaceholder('Filter payees...');
    }
    async searchFor(payeeName) {
        await this.searchBox.fill(payeeName);
    }
}
