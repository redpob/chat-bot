import { test, expect } from '@playwright/test';

test('should have correct page title', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const pageTitle = await page.title();
  await expect(pageTitle).toBe('Vite + React + TS');
});

test('should have root element', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const rootElement = await page.$('#root');
  await expect(rootElement).not.toBeNull();
});

test('should have input field', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const inputField = await page.$('input[type="text"]');
  await expect(inputField).not.toBeNull();
});

test('should display the welcome message', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const welcomeMessage = await page.waitForSelector('p');
  const textContent = await welcomeMessage.textContent();
  expect(textContent).toBe('Bot: Hello! How can I assist you?');
});

test('user can send a message', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Enter a message in the input field
  await page.fill('input[type="text"]', 'Hello, World!');

  // Press Enter key to send the message
  await page.press('input[type="text"]', 'Enter');

  // Wait for the message to appear in the chat
  await page.waitForSelector('div p:last-child');

  // Get the text content of the last message
  const lastMessage = await page.textContent('div p:last-child');

  // Verify that the last message matches the input
  expect(lastMessage).toBe('Hello, World!');
});

