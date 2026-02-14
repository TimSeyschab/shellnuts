import { expect, test } from '@playwright/test';

test('home page exposes canonical and json-ld', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://shellnuts.de/'
	);
	await expect(page.locator('head script[type="application/ld+json"]')).toHaveCount(1);
});

test('post page exposes article seo tags', async ({ page }) => {
	await page.goto('/post/quarkusObservabilityInOneAfternoon');

	await expect(page.locator('head meta[property="og:type"]')).toHaveAttribute('content', 'article');
	await expect(page.locator('head meta[property="article:author"]')).toHaveAttribute(
		'content',
		'Tim'
	);
	await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://shellnuts.de/post/quarkusObservabilityInOneAfternoon'
	);
});

test('robots.txt references sitemap and sitemap is reachable', async ({ request }) => {
	const robots = await request.get('/robots.txt');
	expect(robots.ok()).toBeTruthy();
	const robotsText = await robots.text();
	expect(robotsText).toContain('Sitemap: https://shellnuts.de/sitemap.xml');

	const sitemap = await request.get('/sitemap.xml');
	expect(sitemap.ok()).toBeTruthy();
	const sitemapText = await sitemap.text();
	expect(sitemapText).toContain('<?xml version="1.0" encoding="UTF-8"?>');
	expect(sitemapText).toContain('<loc>https://shellnuts.de/blog</loc>');
});
