// tests/note-game-flow.spec.js
// Playwright: 音符当てゲームの基本フロー自動テスト

const { test, expect } = require('@playwright/test');

const APP_URL = 'http://localhost:3000';

test.describe('音符当てゲームのフロー', () => {
  test('スタートから1問正解までの流れ', async ({ page }) => {
    await page.goto(APP_URL);
    await expect(page.locator('button#startButton')).toBeVisible();
    await page.click('button#startButton');
    const choiceButtons = page.locator('.choices button');
    await expect(choiceButtons.first()).toBeEnabled();
    const noteImage = page.locator('#noteImage');
    await expect(noteImage).not.toHaveAttribute('src', /quiz\.png/);
    await choiceButtons.first().click();
    await expect(page.locator('#actionButtons')).toBeVisible();
  });

  test('タイマーが0になるとゲームオーバー演出', async ({ page }) => {
    await page.goto(APP_URL);
    await page.click('button#startButton');
    await page.evaluate(() => { window.timeLeft = 1; });
    await page.waitForTimeout(1500);
    await expect(page.locator('#celebration')).toBeVisible();
    await expect(page.locator('#celebration')).toContainText('ゲームオーバー');
  });
});
