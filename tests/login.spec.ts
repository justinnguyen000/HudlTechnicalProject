import { test, expect } from '../src/fixtures/test-fixtures';
import { env } from '../src/config/env';

test('user can log in with valid credentials', async ({ page, loginPage, homePage }) => {
  await loginPage.goto();
  await loginPage.login(env.email, env.password);

  await expect(page).not.toHaveURL(/login|identity/);
  await expect(homePage.uploadLink).toBeVisible();
});
