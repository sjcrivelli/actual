export class EnvelopeBudgetSummaryModal {
    page;
    locator;
    heading;
    constructor(locator) {
        this.locator = locator;
        this.page = locator.page();
        this.heading = locator.getByRole('heading');
    }
    async close() {
        await this.heading.getByRole('button', { name: 'Close' }).click();
    }
}
