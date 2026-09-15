import { test, expect } from '@playwright/test';

for (const width of [320, 390, 768, 1440]) {
  test(`真实页面在 ${width}px 下可读，无横向溢出`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/experiments/ai-customer-service/', '/experiments/ai-website/']) {
      await page.goto(path);
      await expect(page.locator('h1')).toBeVisible();
      const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      expect(dimensions.scroll, path).toBeLessThanOrEqual(dimensions.width);
      await expect(page.locator('.site-footer')).toBeAttached();
      for (const caption of await page.locator('.v2-visual-caption').all()) {
        const clipped = await caption.evaluate(element => {
          const box = element.getBoundingClientRect();
          const parent = element.closest('.v2-example-visual').getBoundingClientRect();
          return box.bottom > parent.bottom || box.right > parent.right;
        });
        expect(clipped, '案例示意图说明不应被裁掉').toBe(false);
      }
    }
    expect(errors).toEqual([]);
  });
}

test('从首页进入案例，返回联系入口，复制真实填写的需求', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('link', { name: 'AI客服：常见问题先答，需要判断的交给人', exact: true }).click();
  await expect(page).toHaveURL(/\/experiments\/ai-customer-service\/$/);
  await expect(page.getByRole('heading', { name: '这次验证到哪里？' })).toBeVisible();
  const evidence = page.locator('.evidence img');
  await evidence.scrollIntoViewIfNeeded();
  await expect.poll(() => evidence.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.getByRole('link', { name: '聊聊你的具体场景' }).click();
  await expect(page).toHaveURL(/\/#contact$/);
  const brief = '我的业务场景：小型电商\n目前怎么处理：人工重复回复\n最想改善的问题：物流查询';
  await page.locator('#contact-brief').fill(brief);
  await page.getByRole('button', { name: '复制需求描述' }).click();
  await expect(page.getByRole('status')).toHaveText('已复制。请通过联系方式发送给老鸽。');
  // Windows clipboard uses CRLF; compare text content without changing user input.
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied.replace(/\r\n/g, '\n')).toBe(brief);
  await page.getByRole('button', { name: '复制邮箱', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('Mrd_enge@163.com');
  await expect(page.getByRole('status')).toHaveText('邮箱已复制，可以在邮件应用中联系老鸽。');
  await expect(page.locator('.v2-email > a')).toHaveAttribute('href', /^mailto:Mrd_enge@163\.com\?/);
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: '打开个人微信二维码', exact: false }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  expect(new URL(popup.url()).pathname).toBe('/images/wechat-qr.jpg');
  await popup.close();
  await page.reload();
  await expect(page.locator('#contact-brief')).not.toHaveValue(brief);
});

test('FAQ支持键盘操作，未知路径返回真实404', async ({ page }) => {
  await page.goto('/');
  const question = page.locator('summary').first();
  await question.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await expect(page.locator('details').first().locator('p')).toBeVisible();
  await page.locator('.v2-updates summary').click();
  await expect(page.getByRole('img', { name: '老鸽的AI落地实验室公众号关注二维码' })).toBeVisible();
  const response = await page.goto('/missing-page/');
  expect(response.status()).toBe(404);
  await expect(page.getByRole('heading', { name: '这条路还没铺好。' })).toBeVisible();
  await page.getByRole('link', { name: '返回首页' }).click();
  await expect(page).toHaveURL('/');
});

test('真实录屏可按需播放、暂停和跳转，详情提供文字说明', async ({ page, request }) => {
  await page.goto('/');
  await page.getByRole('link', { name: '看客服录屏', exact: false }).click();
  await expect(page).toHaveURL(/\/#customer-service-video$/);
  const video = page.locator('#home-customer-service-demo');
  await expect(video).toBeInViewport();
  expect(await video.evaluate(element => element.paused)).toBe(true);
  await expect(video).toHaveAttribute('preload', 'none');
  await page.getByRole('button', { name: '播放AI客服测试录屏', exact: true }).click();
  await expect.poll(() => video.evaluate(element => element.currentTime)).toBeGreaterThan(0.2);
  const metadata = await video.evaluate(element => ({ duration: element.duration, width: element.videoWidth, height: element.videoHeight }));
  expect(metadata.duration).toBeGreaterThan(56);
  expect(metadata.duration).toBeLessThan(58);
  expect(metadata.width).toBe(1408);
  expect(metadata.height).toBe(966);
  await video.evaluate(element => { element.currentTime = 40; });
  await expect.poll(() => video.evaluate(element => !element.seeking && element.currentTime >= 40 && element.readyState >= 2)).toBe(true);
  await video.evaluate(element => element.pause());
  expect(await video.evaluate(element => element.paused)).toBe(true);
  const range = await request.get('/media/customer-service-demo.mp4', { headers: { Range: 'bytes=0-31' } });
  expect(range.status()).toBe(206);
  expect((await range.body()).length).toBe(32);
  await page.goto('/experiments/ai-customer-service/#recording');
  await page.locator('.demo-notes summary').click();
  await expect(page.locator('.demo-notes')).toContainText('没有重新录制人工回复回传的完整操作');
  await expect(page.locator('.demo-notes')).toContainText('重复与数量表述不一致');
});

test('保存第二版桌面与手机预览截图', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.locator('img').evaluateAll(images => Promise.all(images.map(async image => {
    image.loading = 'eager';
    await image.decode();
  })));
  await expect(page.getByRole('img', { name: '老鸽的头像', exact: true })).toHaveAttribute('src', '/images/avatar.jpg');
  await expect(page.locator('.v2-updates img')).toHaveAttribute('src', '/images/official-account-qr.jpg');
  await expect(page.getByRole('img', { name: '老鸽的个人微信二维码' })).toHaveAttribute('src', '/images/wechat-qr.jpg');
  await page.screenshot({ path: 'artifacts/v2/home-desktop.png', fullPage: true });
  await page.screenshot({ path: 'artifacts/v2/home-desktop-first-screen.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'artifacts/v2/home-mobile.png', fullPage: true });
  await page.screenshot({ path: 'artifacts/v2/home-mobile-first-screen.png' });
  await page.locator('#contact').screenshot({ path: 'artifacts/v2/contact-mobile.png' });
  await page.goto('/experiments/ai-customer-service/');
  await page.locator('img').evaluateAll(images => Promise.all(images.map(async image => {
    image.loading = 'eager';
    await image.decode();
  })));
  await page.screenshot({ path: 'artifacts/v2/customer-service-mobile.png', fullPage: true });
});
