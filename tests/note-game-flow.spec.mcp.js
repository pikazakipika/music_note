// tests/note-game-flow.spec.js
// Playwright: 音符当てゲームの基本フロー自動テスト

const { test, expect } = require('@playwright/test');

// サーバーURL（必要に応じて修正）
const APP_URL = 'http://localhost:3000';

test.describe('音符当てゲームのフロー', () => {
  test('スタートから1問正解までの流れ', async ({ page }) => {
    await page.goto(APP_URL);
    // スタートボタンが表示されている
    await expect(page.locator('button#startButton')).toBeVisible();
    // スタートボタンを押す
    await page.click('button#startButton');
    // 選択肢ボタンが有効化される
    const choiceButtons = page.locator('.choices button');
    await expect(choiceButtons.first()).toBeEnabled();
    // 音符画像が問題画像以外になっている
    const noteImage = page.locator('#noteImage');
    await expect(noteImage).not.toHaveAttribute('src', /quiz\.png/);
    // どれかのボタンを押す（正解/不正解どちらでもOK）
    await choiceButtons.first().click();
    // アクションボタン（もういちど or つぎ）が表示される
    await expect(page.locator('#actionButtons')).toBeVisible();
  });

  test('タイマーが0になるとゲームオーバー演出', async ({ page }) => {
    await page.goto(APP_URL);
    await page.click('button#startButton');
    // タイマーを0にする（30秒待つのは非効率なのでJSで直接変更）
    await page.evaluate(() => { window.timeLeft = 1; });
    await page.waitForTimeout(1500); // 1.5秒後にタイマー0になる
    // ゲームオーバー演出が表示される
    await expect(page.locator('#celebration')).toBeVisible();
    await expect(page.locator('#celebration')).toContainText('ゲームオーバー');
  });
});
