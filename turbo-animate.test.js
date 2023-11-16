import { test, expect } from "@playwright/test";

test("transitions from / to /about", async ({ page }) => {
  await page.goto("/");
  await page.getByText("About").click();
  await expect(page.getByTestId("title")).toHaveText("About");
});
