import {test, expect} from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async({page}) => {
  await page.goto(UI_URL);
  

  await page.getByRole("link", {name: "Sign in"}).click();

  await expect(page.getByRole("heading", {name: "Sign-in"})).toBeVisible();

  await page.locator("[name=email").fill("am@11.com");
  await page.locator("[name=password").fill("password@1");

  await page.getByRole("button", {name: "Login"}).click();

  await expect(page.getByText("Sign in Successful!")).toBeVisible();
})

test('should allow user to add a hotel', async ({ page }) => {
    await page.goto(`${UI_URL}search`);
  
    await page.getByPlaceholder('Where are you going?').fill("Mombasa");

    await page.getByRole("button", {name: "search"}).click();

    await expect(page.getByAltText("Hotels found in Mombasa")).toBeVisible()
    await expect(page.getByAltText("Sarova WhiteSands")).toBeVisible()
})