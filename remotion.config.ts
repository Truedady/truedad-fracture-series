import {Config} from '@remotion/cli/config';

// Use a locally installed Chromium when Remotion cannot download its own.
if (process.env.REMOTION_BROWSER) {
	Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
