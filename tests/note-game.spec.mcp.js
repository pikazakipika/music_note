// tests/note-game.spec.js
// Playwright: 音符当てゲームの自動テスト雛形

const { test, expect } = require('@playwright/test');

test.describe('音符当てゲーム', () => {
  test('初期画面が正しく表示される', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page.locator('text=音符当てゲーム')).toBeVisible();
    await expect(page.locator('button:has-text("スタート")')).toBeVisible();
  });

  // ここに追加テストケースを記述
});
