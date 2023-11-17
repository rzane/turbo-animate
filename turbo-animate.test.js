import { test, expect } from "@playwright/test";

test("advance", async ({ page }) => {
  await page.goto("/");

  await page.getByText("About").click();
  await expect(page.getByTestId("index")).toHaveClass("turbo-advance-leave");
  await expect(page.getByTestId("about")).toHaveClass("turbo-advance-enter");

  await expect(page.getByTestId("about")).not.toHaveClass("turbo-advance-enter");
  await expect(page.getByTestId("about")).toBeVisible();
  await expect(page.getByTestId("index")).not.toBeInViewport();
});

test("replace", async ({ page }) => {
  await page.goto("/");
  await page.getByText("About").click();
  await expect(page.getByTestId("about")).not.toHaveClass("turbo-advance-enter");

  await page.getByText("Back").click();
  await expect(page.getByTestId("about")).toHaveClass("turbo-replace-leave");
  await expect(page.getByTestId("index")).toHaveClass("turbo-replace-enter");

  await expect(page.getByTestId("index")).not.toHaveClass("turbo-replace-enter");
  await expect(page.getByTestId("index")).toBeVisible();
  await expect(page.getByTestId("about")).not.toBeInViewport();
});

test("restore", async ({ page }) => {
  await page.goto("/");
  await page.getByText("About").click();
  await expect(page.getByTestId("about")).not.toHaveClass("turbo-advance-enter");

  await page.goBack();
  await expect(page.getByTestId("about")).toHaveClass("turbo-restore-leave");
  await expect(page.getByTestId("index")).toHaveClass("turbo-restore-enter");

  await expect(page.getByTestId("index")).not.toHaveClass("turbo-restore-enter");
  await expect(page.getByTestId("index")).toBeVisible();
  await expect(page.getByTestId("about")).not.toBeInViewport();
});

test("custom", async ({ page }) => {
  await page.goto("/");

  await page.getByText("Form").click();
  await expect(page.getByTestId("index")).toHaveClass("turbo-custom-leave");
  await expect(page.getByTestId("form")).toHaveClass("turbo-custom-enter");

  await expect(page.getByTestId("form")).not.toHaveClass("turbo-custom-enter");
  await expect(page.getByTestId("form")).toBeVisible();
  await expect(page.getByTestId("index")).not.toBeInViewport();

  await page.getByText("Save").click();
  await expect(page.getByTestId("form")).toHaveClass("turbo-custom-leave");
  await expect(page.getByTestId("index")).toHaveClass("turbo-custom-enter");

  await expect(page.getByTestId("index")).not.toHaveClass("turbo-custom-enter");
  await expect(page.getByTestId("index")).toBeVisible();
  await expect(page.getByTestId("form")).not.toBeInViewport();
});
