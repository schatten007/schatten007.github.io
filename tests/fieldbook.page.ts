import { type Page } from '@playwright/test';

export class FieldbookPage {
  constructor(readonly page: Page) {}

  get searchButton() { return this.page.getByRole('button', { name: 'Search the site' }); }
  get searchDialog() { return this.page.getByRole('dialog', { name: 'QUICK SELECT' }); }
  get searchInput() { return this.page.getByRole('searchbox', { name: 'Search projects, notes, and pages' }); }
  get workCards() { return this.page.getByRole('article'); }
  get labResult() { return this.page.locator('[data-lab-result]'); }

  async goto(path = '/') { return this.page.goto(path); }
  async search(query: string) {
    await this.searchButton.click();
    await this.searchInput.fill(query);
  }
  async selectFixture(name: string) {
    await this.page.getByRole('button', { name }).click();
  }
  async inspectFixture() {
    await this.page.getByRole('button', { name: 'Run the check' }).click();
  }
}
