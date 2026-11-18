import { test, expect } from '../src/fixtures/test-fixtures';
import { env } from '../src/config/env';
import { errorMessages, unregisteredEmail } from '../src/data/login-data';

test.describe('Login with invalid credentials', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('rejects an unregistered email', async ({ loginPage }) => {
    await loginPage.login(unregisteredEmail, 'Any-Password-123!');

    await expect(loginPage.usernameErrorMessage).toContainText(errorMessages.invalidUsernamePassword);
  });

  test('rejects a wrong password', async ({ loginPage }) => {
    await loginPage.login(env.email, 'Wrong-Password-123!');

    await expect(loginPage.credentialsErrorMessage).toContainText(errorMessages.invalidCredentials);
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('treats the password as case-sensitive', async ({ loginPage }) => {
    await loginPage.login(env.email, env.password.toUpperCase());

    await expect(loginPage.credentialsErrorMessage).toContainText(errorMessages.invalidCredentials);
  });
});

