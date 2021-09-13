import { test,expect } from '@playwright/test';

test.describe('shellnuts-card', async() => {
  test.beforeEach(async({page})=>{
    await page.goto("http://localhost:3334")
  })
  test('renders', async ({page}) => {
    await expect(page).toHaveURL("http://localhost:3334/")
  });
});
