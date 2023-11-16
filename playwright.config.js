import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'npm run start',
    env: { PORT: '9001' },
    url: 'http://127.0.0.1:9001',
    stdout: 'ignore',
    stderr: 'pipe',
  },
  use: {
    baseURL: 'http://127.0.0.1:9001',
  },
});
