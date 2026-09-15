// 本地媒体准备工具。传入FFmpeg路径与原视频，公开构建只复制处理好的媒体文件。
import { execFileSync } from 'node:child_process';
import { mkdir, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const { values } = parseArgs({ options: {
  input: { type: 'string' },
  ffmpeg: { type: 'string' },
  crop: { type: 'string' },
  'poster-at': { type: 'string', default: '37' },
} });
if (!values.input || !values.ffmpeg) throw new Error('需要 --input 视频路径和 --ffmpeg 可执行文件路径');
if (values.crop && !/^\d+:\d+:\d+:\d+$/.test(values.crop)) throw new Error('--crop 格式为 宽:高:x:y');
if (!Number.isFinite(Number(values['poster-at'])) || Number(values['poster-at']) < 0) throw new Error('封面时间必须是非负秒数');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const input = resolve(values.input);
const output = join(root, 'public/media/customer-service-demo.mp4');
const poster = join(root, 'public/images/customer-service-demo-poster.jpg');
if (input === output) throw new Error('原视频不能与输出路径相同');
await stat(input);
await mkdir(dirname(output), { recursive: true });
await mkdir(dirname(poster), { recursive: true });

const args = ['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-map', '0:v:0'];
if (values.crop) args.push('-vf', `crop=${values.crop}`);
// 本段录屏经检查为静音；移除静音轨，按原视频帧序列编码，不调整速度和片段顺序。
args.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-an', '-map_metadata', '-1', '-movflags', '+faststart', output);
execFileSync(values.ffmpeg, args, { stdio: 'inherit' });
const size = (await stat(output)).size;
if (size > 25 * 1024 * 1024) throw new Error('视频超过Pages单文件25 MiB限制，请调整编码参数后重新处理');
execFileSync(values.ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', values['poster-at'], '-i', output, '-frames:v', '1', '-vf', 'scale=960:-2', '-q:v', '3', poster], { stdio: 'inherit' });
await stat(poster);
console.log(`Prepared MP4: ${(size / 1024 / 1024).toFixed(2)} MiB, H.264, faststart`);
console.log('Prepared poster from the actual recording.');
