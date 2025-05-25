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

test('should show hotel search results', async ({ page }) => {
    await page.goto(`${UI_URL}search`);
  
    await page.getByPlaceholder('Where are you going?').fill("Mombasa");

    await page.getByRole("button", {name: "search"}).click();

    await expect(page.getByText("Hotels found in Mombasa")).toBeVisible()
    await expect(page.getByText("Sarova WhiteSands")).toBeVisible()
})
test('should show hotel detail', async ({ page }) => {
    await page.goto(UI_URL);
  
    await page.getByPlaceholder('Where are you going?').fill("Mombasa");

    await page.getByRole("button", {name: "search"}).click();

    await page.getByText("Sarova WhiteSands").click();
    await expect(page).toHaveURL(/detail/);
    await expect(page.getByRole("button", {name: "Book now"})).toBeVisible();
});
test('should book hotel ', async ({ page }) => {
    await page.goto(UI_URL);
  
    await page.getByPlaceholder('Where are you going?').fill("Mombasa");

    const date = new Date();
    date.setDate(date.getDate() + 3);
    const formattedDate = date.toISOString().split("T")[0];
    await page.getByPlaceholder("Check-out Date").fill(formattedDate);

    await page.getByRole("button", {name: "search"}).click();

    await page.getByText("Sarova WhiteSands").click();

    await page.getByRole("button", {name: "Book now"}).click();

    await expect(page.getByAltText("Total Cost: usd200.00")).toBeVisible();

    const stripeFrame = page.frameLocator("iframe").first();
    await stripeFrame.locator('[placeholder="Card number"]').fill("42424242424242");

    await stripeFrame.locator('[placeholder="MM / YY"]').fill("07/31")
    await stripeFrame.locator('[placeholder="CVC"]').fill("242")
    await stripeFrame.locator('[placeholder="ZIP"]').fill("24245")

    await page.getByRole("button", {name: "Confirm Booking"}).click();
    await expect(page.getByText("Booking Saved!")).toBeVisible();

    await page.getByRole("link", {name: "My Bookings"}).click();
    await expect(page.getByText("Sarova WhiteSands")).toBeVisible();

});