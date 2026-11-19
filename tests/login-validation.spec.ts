import { test, expect } from '../src/fixtures/test-fixtures';
import { env } from '../src/config/env';
import { malformedEmails } from '../src/data/login-data';

test.describe('Login input validation', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('does not continue with an empty email', async ({ loginPage }) => {
    await loginPage.continueButton.click();

    await expect(loginPage.passwordInput).toBeHidden();
  });

  test('does not log in with an empty password', async ({ page, loginPage }) => {
    await loginPage.submitEmail(env.email);
    await loginPage.continueButton.click();

    await expect(loginPage.passwordInput).toBeVisible();
    await expect(page).toHaveURL(/login|identity/);
  });

  for (const email of malformedEmails) {
    test(`rejects malformed email "${email}"`, async ({ loginPage }) => {
      await loginPage.submitEmail(email);

      await expect(loginPage.passwordInput).toBeHidden();
    });
  }
});
