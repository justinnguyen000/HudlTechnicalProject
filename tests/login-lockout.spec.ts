import { test, expect } from '../src/fixtures/test-fixtures';
import { env } from '../src/config/env';
import { maxFailedAttempts, attemptDelayMs } from '../src/data/login-data';

test.describe('Account lockout', () => {
  // Retrying would add even more failed attempts, so never retry this test
  test.describe.configure({ retries: 0 });

  test(
    'blocks the account after repeated failed password attempts',
    { tag: '@lockout' },
    async ({ page, loginPage }) => {
      // Many sequential login attempts take longer than the default 30 seconds
      test.setTimeout(180_000);

      await loginPage.goto();
      await loginPage.submitEmail(env.email);

      for (let attempt = 1; attempt <= maxFailedAttempts; attempt++) {
        await page.waitForTimeout(attemptDelayMs);
        await loginPage.submitPassword(`Wrong-Password-${attempt}!`);
        await expect(loginPage.lockoutMessage).toBeVisible();
      }

      // The real proof of lockout: even the correct password is refused
      await loginPage.submitPassword(env.password);

      await expect(loginPage.lockoutMessage).toBeVisible();
      await expect(page).toHaveURL(/login|identity/);
    },
  );
});
