import { expect, test } from '@playwright/test';

test('main navigation works from a post page', async ({ page }) => {
	await page.goto('/post/quarkusObservabilityInOneAfternoon');

	await expect(
		page.getByRole('heading', { name: 'Quarkus observability as a practical reference' })
	).toBeVisible();

	await page.getByRole('link', { name: 'Blog' }).click();
	await expect(page).toHaveURL(/\/blog$/);

	await page.getByRole('link', { name: 'About' }).click();
	await expect(page).toHaveURL(/\/about$/);
	await expect(page.getByRole('heading', { name: 'About Shellnuts' })).toBeVisible();
});

test('home page renders hero and latest posts section', async ({ page }) => {
	await page.goto('/');

	await expect(
		page.getByRole('heading', { name: /Java hacks, observability rabbit holes/i })
	).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Latest Posts' })).toBeVisible();
});

test('blog cards are fully clickable', async ({ page }) => {
	await page.goto('/blog');

	const firstPostCard = page.locator('a.card').first();
	await expect(firstPostCard).toBeVisible();

	await firstPostCard.click();
	await expect(page).toHaveURL(/\/post\/[^/]+$/);
});

test('blog pagination behaves correctly', async ({ page }) => {
	await page.goto('/blog');

	const nextButton = page.getByRole('link', { name: 'Next' });
	const hasNextPage = (await nextButton.count()) > 0;

	if (!hasNextPage) {
		await expect(page.getByText(/Page \d+ of \d+/)).toHaveCount(0);
		return;
	}

	await nextButton.click();
	await expect(page).toHaveURL(/\/blog\/\d+$/);
	await expect(page.getByRole('link', { name: 'Previous' })).toBeVisible();
});
