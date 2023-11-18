import { test, expect } from "@playwright/test";

test("advance", async ({ page }) => {
  await page.goto("/");

  const leave = expect(page.getByTestId("index")).toHaveClass("turbo-advance-leave");
  const enter = expect(page.getByTestId("about")).toHaveClass("turbo-advance-enter");

  await page.getByText("About").click();
  await leave;
  await enter;

  await expect(page.getByTestId("about")).toBeVisible();
  await expect(page.getByTestId("index")).not.toBeInViewport();
});

test("replace", async ({ page }) => {
  await page.goto("/about");

  const leave = expect(page.getByTestId("about")).toHaveClass("turbo-replace-leave");
  const enter = expect(page.getByTestId("index")).toHaveClass("turbo-replace-enter");

  await page.getByText("Back").click();
  await leave;
  await enter;

  await expect(page.getByTestId("index")).toBeVisible();
  await expect(page.getByTestId("about")).not.toBeInViewport();
});

test("restore", async ({ page }) => {
  await page.goto("/");
  await page.getByText("About").click();
  await expect(page.getByTestId("index")).not.toBeInViewport();

  const leave = expect(page.getByTestId("about")).toHaveClass("turbo-restore-leave");
  const enter = expect(page.getByTestId("index")).toHaveClass("turbo-restore-enter");

  await page.goBack();
  await leave;
  await enter;

  await expect(page.getByTestId("index")).toBeVisible();
  await expect(page.getByTestId("about")).not.toBeInViewport();
});

test("custom navigation", async ({ page }) => {
  await page.goto("/");

  const leave = expect(page.getByTestId("index")).toHaveClass("turbo-custom-leave");
  const enter = expect(page.getByTestId("form")).toHaveClass("turbo-custom-enter");

  await page.getByText("Form").click();
  await leave;
  await enter;

  await expect(page.getByTestId("form")).toBeVisible();
  await expect(page.getByTestId("index")).not.toBeInViewport();
});

test("custom form submission", async ({ page }) => {
  await page.goto("/form");

  const leave = expect(page.getByTestId("form")).toHaveClass("turbo-custom-leave");
  const enter = expect(page.getByTestId("index")).toHaveClass("turbo-custom-enter");

  await page.getByText("Save").click();
  await leave;
  await enter;

  await expect(page.getByTestId("index")).toBeVisible();
  await expect(page.getByTestId("form")).not.toBeInViewport();
});

test("animating Turbo.visit", async ({ page }) => {
  await page.goto("/");

  const leave = expect(page.getByTestId("index")).toHaveClass("turbo-advance-leave");
  const enter = expect(page.getByTestId("about")).toHaveClass("turbo-advance-enter");

  await page.getByText("Imperative").click();
  await leave;
  await enter;

  await expect(page.getByTestId("about")).toBeVisible();
  await expect(page.getByTestId("index")).not.toBeInViewport();
});

test("custom action with Turbo.visit", async ({ page }) => {
  await page.goto("/");

  const leave = expect(page.getByTestId("index")).toHaveClass("turbo-custom-leave");
  const enter = expect(page.getByTestId("about")).toHaveClass("turbo-custom-enter");

  await page.getByText("Set next action").click();
  await leave;
  await enter;

  await expect(page.getByTestId("about")).toBeVisible();
  await expect(page.getByTestId("index")).not.toBeInViewport();
});
