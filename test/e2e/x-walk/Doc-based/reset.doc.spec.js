import { test, expect } from '../../fixtures.js';
import { openPage } from '../../utils.js';

test.describe('Reset Doc Based', () => {
    const testURL = '/reset';
    test(':test rest for wizard', async ({ page }) => {
        await openPage(page, testURL, 'docbased');
        const fName = await page.getByLabel('First Name*');
        const lName = await page.getByLabel('Last Name*');
        const email = await page.getByLabel('Work Email*');
        const next = await page.getByLabel('Next');
        const reset = await page.getByLabel('Reset Form');
        await fName.fill('abc');
        await lName.fill('abc');
        await email.fill('abc@gmail.com');
        await next.click();
        await expect(page.locator('.current-wizard-step')).toHaveAttribute('data-index', '1');
        await reset.click();
        await expect(page.locator('.current-wizard-step')).toHaveAttribute('data-index', '0');
    });
});
