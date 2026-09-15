const status = document.getElementById('copy-status');
for (const button of document.querySelectorAll('[data-copy], [data-copy-from]')) {
  button.addEventListener('click', async () => {
    const field = button.dataset.copyFrom ? document.getElementById(button.dataset.copyFrom) : null;
    const value = field ? field.value : button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      if (status) status.textContent = button.dataset.copySuccess || '已复制。请通过联系方式发送给老鸽。';
    } catch {
      if (field) {
        field.focus();
        field.select();
      }
      if (status) status.textContent = field ? '浏览器未允许自动复制。已选中文字，请手动复制。' : '浏览器未允许自动复制，请手动选中并复制联系方式。';
    }
  });
}

// Enhance the poster with an explicit play action. Without JavaScript, native controls remain usable.
for (const player of document.querySelectorAll('.demo-player')) {
  const video = player.querySelector('video');
  const button = player.querySelector('.demo-play-button');
  const error = player.querySelector('.demo-error');
  if (!video || !button) continue;
  video.controls = false;
  button.hidden = false;
  const showNativeControls = () => {
    video.controls = true;
    button.hidden = true;
  };
  video.addEventListener('play', showNativeControls);
  button.addEventListener('click', async () => {
    showNativeControls();
    if (error) error.hidden = true;
    try {
      await video.play();
    } catch {
      if (error) {
        error.textContent = '暂时无法开始播放，请使用播放器控件重试，或点击下方“单独打开视频”。';
        error.hidden = false;
      }
    }
  });
}
