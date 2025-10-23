export class MobileRulesPage {
    page;
    searchBox;
    addButton;
    rulesList;
    emptyMessage;
    constructor(page) {
        this.page = page;
        this.searchBox = page.getByPlaceholder('Filter rules…');
        this.addButton = page.getByRole('button', { name: 'Add new rule' });
        this.rulesList = page.getByRole('main');
        this.emptyMessage = page.getByText('No rules found');
    }
    async waitFor(options) {
        await this.rulesList.waitFor(options);
    }
    /**
     * Search for rules using the search box
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
     * Get the nth rule item (0-based index)
     */
    getNthRule(index) {
        return this.getAllRules().nth(index);
    }
    /**
     * Get all visible rule items
     */
    getAllRules() {
        return this.page.getByRole('grid', { name: 'Rules' }).getByRole('row');
    }
    /**
     * Click on a rule to edit it
     */
    async clickRule(index) {
        const rule = this.getNthRule(index);
        await rule.click();
    }
    /**
     * Click the add button to create a new rule
     */
    async clickAddRule() {
        await this.addButton.click();
    }
    /**
     * Get the number of visible rules
     */
    async getRuleCount() {
        const rules = this.getAllRules();
        return await rules.count();
    }
    /**
     * Check if a rule contains specific text
     */
    async ruleContainsText(index, text) {
        const rule = this.getNthRule(index);
        const ruleText = await rule.textContent();
        return ruleText?.includes(text) || false;
    }
    /**
     * Get the stage badge text for a rule (PRE/DEFAULT/POST)
     */
    async getRuleStage(index) {
        const rule = this.getNthRule(index);
        const stageBadge = rule.getByTestId('rule-stage-badge');
        return await stageBadge.textContent();
    }
}
