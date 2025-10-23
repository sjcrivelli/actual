export class EditNotesModal {
    page;
    locator;
    heading;
    textArea;
    saveNotesButton;
    constructor(locator) {
        this.locator = locator;
        this.page = locator.page();
        this.heading = locator.getByRole('heading');
        this.textArea = locator.getByRole('textbox');
        this.saveNotesButton = locator.getByRole('button', { name: 'Save notes' });
    }
    async close() {
        await this.heading.getByRole('button', { name: 'Close' }).click();
    }
    async updateNotes(notes) {
        await this.textArea.fill(notes);
        await this.saveNotesButton.click();
    }
}
