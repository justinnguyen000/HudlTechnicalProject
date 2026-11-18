import { test, expect } from '@playwright/test';
import { env } from '../src/config/env';
import { LoginPage } from '../src/pages/LoginPage';
import { HomePage } from '../src/pages/HomePage';

test('user can log in with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await loginPage.goto();
  await loginPage.login(env.email, env.password);

  await expect(page).not.toHaveURL(/login|identity/);
  await expect(homePage.uploadLink).toBeVisible();
});