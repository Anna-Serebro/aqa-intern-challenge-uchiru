import { test, expect } from '@playwright/test';
import { WidgetPage } from "./widget.page";

test.describe('Uchi.ru widget', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({ page }) => {
    widgetPage = new WidgetPage(page);

    // open uchi.ru main page
    await page.goto('https://uchi.ru');

    // close cookies popup
    await page.locator('._UCHI_COOKIE__button')
                     .click({ timeout: 5000 })
                     .catch(() => {});
  });

  test('widget opens', async ({ page }) => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible()
  });

  test('widget has support title after clicking "write to us"', async ({ page }) => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible();

    const articles = await widgetPage.getPopularArticles();

    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
//     expect(articles.length).toBeGreaterThan(0);

    await articles.first().click();

    await widgetPage.clickWriteToUs();

    await expect
          .poll(async () => await widgetPage.getTitle())
          .toBe('Связь с поддержкой');
  });

  test('widget open button is visible', async ({ page }) => {
    const button = page.locator('[data-test=openWidget]');

    await expect(button).toBeVisible();
  });
});
