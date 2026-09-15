const status = document.getElementById('copy-status');
for (const button of document.querySelectorAll('[data-copy], [data-copy-from]')) {
  button.addEventListener('click', async () => {
    const field = button.dataset.copyFrom ? document.getElementById(button.dataset.copyFrom) : null;
    const value = field ? field.value : button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      if (status) status.textContent = '已复制。请通过联系方式发送给老鸽。';
    } catch {
      if (field) {
        field.focus();
        field.select();
      }
      if (status) status.textContent = field ? '浏览器未允许自动复制。已选中文字，请手动复制。' : '浏览器未允许自动复制，请手动选中并复制微信号。';
    }
  });
}
