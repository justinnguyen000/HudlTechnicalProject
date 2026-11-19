export const errorMessages = {
  invalidCredentials: 'Your email or password is',
  invalidUsernamePassword: 'Incorrect username or password',
};

export const unregisteredEmail = 'unregistered-email-qa-test@example.com';

export const malformedEmails = [
  'plainaddress',
  'missing-at-sign.com',
  'user@',
  '@no-local-part.com',
  'user name@example.com',
];

/* lockout variables */
export const maxFailedAttempts = 10;
// Pause between failed login attempt
export const attemptDelayMs = 2_000;
