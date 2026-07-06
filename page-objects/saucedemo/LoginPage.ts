import { Page, Locator } from '@playwright/test';

export class LoginPage {
readonly page: Page;
readonly usernameInput: Locator;
readonly passwordInput: Locator;
readonly loginButton: Locator;

readonly errorMessage: Locator;
readonly errorButton: Locator;

constructor(page: Page) {
this.page = page;
// Locators based on actual SauceDemo elements
this.usernameInput = page.locator('#user-name');
this.passwordInput = page.locator('#password');
this.loginButton = page.locator('#login-button');
this.errorMessage = page.locator('[data-test="error"]');
this.errorButton = page.locator('.error-button');
}

async goto() {
await this.page.goto('https://www.saucedemo.com/');
}

async login(username: string, password: string) {
await this.usernameInput.fill(username);
await this.passwordInput.fill(password);
await this.loginButton.click();
}

// This is the logical OR operator (||), and it's being used here as a falsy fallback.

// If await this.errorMessage.textContent() successfully finds text (like "Invalid password"), that string is "truthy", so JavaScript stops there and keeps it.

// If the element isn't on the screen, Playwright might return null. Because null is "falsy", JavaScript skips to the right side of the || and uses the empty string ('') instead.

// Why do this? It prevents your test suite from throwing a TypeScript or JavaScript error later on. If a method returns null, trying to run a string assertion against it can crash the test with a type mismatch. Forcing a fallback to an empty string '' ensures the method always safely returns a string.

// I also always run an assertion in the test file after this getErrorMessage() method is called, to make sure the error message text is actually correct to prevent false positives 

async getErrorMessage(): Promise <string> {
return await this.errorMessage.textContent() || '';
}

async isErrorVisible(): Promise <boolean> {

return await this.errorMessage.isVisible();
}

async clearError() {
await this.errorButton.click();
}

async isLoginButtonEnabled(): Promise<boolean> {
return await this.loginButton.isEnabled();
}
}