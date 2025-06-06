import { test, expect } from '@playwright/test';

const UI_URL = "http://localhost:5173/";

test('allow user to sign in', async ({ page }) => {
  await page.goto(UI_URL);
  

  await page.getByRole("link", {name: "Sign in"}).click();

  await expect(page.getByRole("heading", {name: "Sign-in"})).toBeVisible();

  await page.locator("[name=email").fill("am@11.com");
  await page.locator("[name=password").fill("password@1");

  await page.getByRole("button", {name: "Login"}).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
  await expect(page.getByRole("link", {name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", {name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", {name: "Sign Out"})).toBeVisible();


});
test('allow user to register', async ({ page }) => {
  const testEmail = `test_register_${Math.floor(Math.random() * 90000) + 1000}@test.com`
  await page.goto(UI_URL);
  

  await page.getByRole("link", {name: "Sign In"}).click();
  await page.getByRole("link", {name: "Create an account here"}).click();

  await expect(page.getByRole("heading", {name: "Create an Account"})).toBeVisible();

  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=firstName]").fill("test_lastName");
  await page.locator("[email=email]").fill(testEmail);
  await page.locator("[name=password]").fill("password123");
  await page.locator("[name=confirmPassword").fill("password123");


  await page.getByRole("button", {name: "Create Account"}).click();

  await expect(page.getByText("Registration Successful!")).toBeVisible();
  await expect(page.getByRole("link", {name: "My Bookings"})).toBeVisible();
  await expect(page.getByRole("link", {name: "My Hotels"})).toBeVisible();
  await expect(page.getByRole("button", {name: "Sign Out"})).toBeVisible();


});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
