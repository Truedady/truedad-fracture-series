import {Config} from '@remotion/cli/config';

// Use a preinstalled Chromium when REMOTION_BROWSER is set (e.g. sandboxed CI without downloads).
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
// PNG frames keep the output in limited-range yuv420p (JPEG frames end up as full-range yuvj420p).
Config.setVideoImageFormat('png');
Config.setPixelFormat('yuv420p');
