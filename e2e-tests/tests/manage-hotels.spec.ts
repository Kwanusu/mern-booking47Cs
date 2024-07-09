import { test, expect } from '@playwright/test';
import path from 'path';

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
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="county"]').fill("Test County");
  await page.locator('[name="description"]').fill("This is a description for the test Hotel");
  await page.locator('[name="pricePerNight"]').fill("100");
  await page.selectOption('select[name="starRating"]', "3");

  await page.getByText("Budget").click();
  
  await page.getByLabel("Free WiFi").click();
  await page.getByLabel("Parking").click();

  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("4");

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "1.png"),
    path.join(__dirname, "files", "2.png"),
  ]);
  await page.getByRole("button", { name: "Save"}).click();
  await expect(page.getByText ("Hotel Saved!")).toBeVisible();
})


test('should display hotels', async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await expect(page.getByText("Sarova WhiteSands")).toBeVisible();
  await expect(page.getByText("Nestled in the heart of a vibrant city,")).toBeVisible();
  await expect(page.getByText("Sarova WhiteSands")).toBeVisible();
  await expect(page.getByText("Mombasa")).toBeVisible();
  await expect(page.getByText("Mombasa")).toBeVisible();
  await expect(page.getByText("Kshs: 5000/-per night")).toBeVisible();
  await expect(page.getByText("4 adults, 2 children")).toBeVisible();
  await expect(page.getByText("5 Star Rating")).toBeVisible();
  

  await expect(page.getByRole("link", {name: "View Details"})
  .first()).toBeVisible();
});

test('should edit hotel', async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", {name: "View Details"}).first().click(); 

  await page.waitForSelector('[name="name"]', {state: "attached"})

  await expect(page.locator('[name="name"]')).toHaveValue("Sarova WhiteSands")

  await page.locator('[name="name"]').fill("Sarova WhiteSands UPDATED");

  await page.getByRole("button", { name: "Save"}).click();

  await expect(page.getByText("Hotel saved")).toBeVisible();

  await page.reload();

  await page.locator('[name="name"]').fill("Sarova WhiteSands UPDATED");
  await expect(page.locator('[name="name"]')).toHaveValue("Sarova WhiteSands")

  await page.getByRole("button", { name: "Save"}).click();
  
});