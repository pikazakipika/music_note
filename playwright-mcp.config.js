// playwright-mcp.config.js
// Playwright MCP用の基本設定ファイル

module.exports = {
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  use: {
    headless: true,
    viewport: { width: 375, height: 667 }, // スマホサイズ
    ignoreHTTPSErrors: true,
    video: 'off',
  },
};
