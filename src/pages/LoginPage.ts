/* login locators and action */

import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly continueButton: Locator;
  readonly credentialsErrorMessage: Locator;
  readonly usernameErrorMessage: Locator;
  readonly lockoutMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox', { name: 'Email*' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password*' });
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.credentialsErrorMessage = page.getByText('Your email or password is');
    this.usernameErrorMessage = page.getByText('Incorrect username or');
    this.lockoutMessage = page.getByText('You’ve tried to log in too');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async submitEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.continueButton.click();
  }

  async submitPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.continueButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.submitEmail(email);
    await this.submitPassword(password);
  }
}
