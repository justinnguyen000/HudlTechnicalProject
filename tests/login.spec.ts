import { test, expect } from '@playwright/test';
import { env } from '../src/config/env';

test('user can log in with valid credentials', async ({ page}) => {
  // Go to the login page (baseURL + /login)
  await page.goto('/login');

  // Enter Email
  await page.getByRole('textbox', { name: 'Email*' }).fill(env.email);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();


  await page.getByRole('textbox', { name: 'Password*' }).fill(env.password);
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).not.toHaveURL('/login|identity/');
  await expect(page.getByRole('link', { name: 'Upload Upload' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Upload Upload' })).toBeVisible();
});