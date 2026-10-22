import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Easing,
	Img,
	OffthreadVideo,
	Sequence,
	interpolate,
	staticFile,
	useCurrentFrame,
} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {z} from 'zod';
import {
	CAM_CARD,
	CAM_DATE,
	CAM_DATE_DRIFT,
	CAM_PORTAL,
	CAM_THUMB,
	CARD,
	Cam,
	DATE,
	SHOT,
	THUMB,
} from './geometry';
import {T} from './timeline';

export const proofInsertSchema = z.object({
	motionBlur: z.boolean(),
	motionBlurSamples: z.number().int().min(2).max(16),
	showLabel: z.boolean(),
	sfxVolume: z.number().min(0).max(1),
});

export type ProofInsertProps = z.infer<typeof proofInsertSchema>;

const W = 2560;
const H = 1440;

const C = {
	graphite: '#0B0E13',
	gold: '#D9A93D',
	ivory: '#F4F1E9',
};

const VIDEO = staticFile('insert/trueskins.mp4');
const SCREENSHOT = staticFile('insert/youtube-prev.jpg');

// Easing curves
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
const softOut = Easing.bezier(0.22, 1, 0.36, 1);
const longTail = Easing.bezier(0.45, 0, 0.15, 1);
const pushIn = Easing.bezier(0.72, 0, 0.18, 1);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const ease = (f: number, from: number, to: number, e: (t: number) => number) =>
	interpolate(f, [from, to], [0, 1], {...clamp, easing: e});

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Zoom is interpolated in log space so that perceived speed stays constant
const mixCam = (a: Cam, b: Cam, t: number): Cam => ({
	cx: lerp(a.cx, b.cx, t),
	cy: lerp(a.cy, b.cy, t),
	z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), t)),
});

// One continuous virtual camera over the screenshot
const cameraAt = (f: number): Cam => {
	const entry: Cam = {...CAM_THUMB, z: CAM_THUMB.z * 1.12};
	let cam = mixCam(entry, CAM_THUMB, ease(f, T.revealStart, T.revealThumbEnd + 4, expoOut));
	cam = mixCam(cam, CAM_CARD, ease(f, T.openRightStart, T.openRightEnd, inOut));
	cam = mixCam(cam, CAM_DATE, ease(f, T.toDateStart, T.toDateEnd, longTail));
	cam = mixCam(cam, CAM_DATE_DRIFT, ease(f, T.toDateEnd, T.portalStart, Easing.bezier(0.3, 0, 0.7, 1)));
	cam = mixCam(cam, CAM_PORTAL, ease(f, T.portalStart, T.portalEnd, pushIn));
	return cam;
};

type Rect = {x0: number; y0: number; x1: number; y1: number; r: number};

// Mask over the screenshot, in screenshot pixels
const cardMaskAt = (f: number): Rect => {
	const open = ease(f, T.revealStart, T.revealThumbEnd, expoOut);
	const cy = (THUMB.y0 + THUMB.y1) / 2;
	const insetX = 70 * (1 - open);
	const thumb: Rect = {
		x0: THUMB.x0 + insetX,
		x1: THUMB.x1 - insetX,
		y0: lerp(cy - 6, THUMB.y0, open),
		y1: lerp(cy + 6, THUMB.y1, open),
		r: THUMB.radius,
	};
	const t = ease(f, T.openRightStart, T.openRightEnd, inOut);
	return {
		x0: lerp(thumb.x0, CARD.x0, t),
		x1: lerp(thumb.x1, CARD.x1, t),
		y0: lerp(thumb.y0, CARD.y0, t),
		y1: lerp(thumb.y1, CARD.y1, t),
		r: lerp(thumb.r, CARD.radius, t),
	};
};

const toScreen = (cam: Cam, x: number, y: number) => ({
	x: (x - cam.cx) * cam.z + W / 2,
	y: (y - cam.cy) * cam.z + H / 2,
});

const insetPath = (r: Rect, w: number, h: number, radius: number) =>
	`inset(${r.y0}px ${w - r.x1}px ${h - r.y1}px ${r.x0}px round ${radius}px)`;

// Original TrueSkins recording, dimmed and defocused behind the screenshot
const BackgroundVideo: React.FC = () => {
	const f = useCurrentFrame();
	const push = interpolate(f, [0, T.dimEnd, T.portalEnd], [1, 1.045, 1.085], {
		...clamp,
		easing: Easing.bezier(0.33, 0, 0.25, 1),
	});
	const dim = ease(f, T.dimStart, T.dimEnd, softOut);
	const blur = lerp(0, 18, dim);
	const brightness = lerp(1, 0.34, dim);
	// Depth: the edges defocus first, the portfolio area stays sharp a little longer
	const edgeBlur = interpolate(f, [0, T.dimStart + 2], [0, 7], clamp);

	const videoStyle: React.CSSProperties = {
		width: W,
		height: H,
		transform: `scale(${push})`,
		transformOrigin: '50% 27%',
	};

	return (
		<AbsoluteFill style={{filter: `blur(${blur}px) brightness(${brightness}) saturate(${lerp(1, 0.75, dim)})`}}>
			<OffthreadVideo src={VIDEO} style={videoStyle} />
			<AbsoluteFill
				style={{
					WebkitMaskImage: 'radial-gradient(ellipse 62% 58% at 50% 32%, transparent 40%, black 100%)',
					maskImage: 'radial-gradient(ellipse 62% 58% at 50% 32%, transparent 40%, black 100%)',
					filter: `blur(${edgeBlur}px)`,
				}}
			>
				<OffthreadVideo src={VIDEO} muted style={videoStyle} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const Vignette: React.FC = () => {
	const f = useCurrentFrame();
	const v = interpolate(f, [0, T.dimEnd, T.portalStart, T.portalEnd + 6], [0.25, 0.7, 0.7, 0], clamp);
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(ellipse 75% 70% at 50% 45%, rgba(11,14,19,0) 45%, rgba(11,14,19,${v}) 100%)`,
				pointerEvents: 'none',
			}}
		/>
	);
};

const Screenshot: React.FC<{showLabel: boolean}> = ({showLabel}) => {
	const f = useCurrentFrame();
	if (f < T.revealStart || f > T.portalEnd + 2) {
		return null;
	}
	const cam = cameraAt(f);
	const mask = cardMaskAt(f);
	const enter = ease(f, T.revealStart, T.revealThumbEnd, expoOut);
	const lift = lerp(26, 0, enter);
	// Card recedes in light while the portal opens, adding depth
	const recede = ease(f, T.portalStart + 4, T.portalEnd - 4, Easing.bezier(0.4, 0, 0.6, 1));

	const underline = ease(f, T.underlineStart, T.underlineEnd, softOut);
	const underlineOut = 1 - ease(f, T.portalStart + 2, T.portalStart + 10, Easing.linear);
	const label = ease(f, T.underlineStart + 6, T.underlineEnd + 6, softOut);

	const world: React.CSSProperties = {
		position: 'absolute',
		left: 0,
		top: 0,
		width: SHOT.width,
		height: SHOT.height,
		transformOrigin: '0 0',
		transform: `translate(${W / 2 - cam.cx * cam.z}px, ${H / 2 - cam.cy * cam.z + lift}px) scale(${cam.z})`,
	};

	return (
		<AbsoluteFill>
			<div style={world}>
				{/* Soft contact + ambient shadow following the mask */}
				<div
					style={{
						position: 'absolute',
						left: mask.x0,
						top: mask.y0,
						width: mask.x1 - mask.x0,
						height: mask.y1 - mask.y0,
						borderRadius: mask.r,
						boxShadow: '0 24px 60px rgba(0,0,0,0.55), 0 4px 14px rgba(0,0,0,0.35)',
						opacity: enter,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						clipPath: insetPath(mask, SHOT.width, SHOT.height, mask.r),
						filter: `brightness(${lerp(1, 0.62, recede)})`,
					}}
				>
					<Img src={SCREENSHOT} style={{width: SHOT.width, height: SHOT.height, display: 'block'}} />
				</div>
				{/* Warm underline under the original "1 мес. назад" */}
				<div
					style={{
						position: 'absolute',
						left: DATE.x0,
						top: DATE.underlineY,
						width: DATE.x1 - DATE.x0,
						height: 3.6,
						borderRadius: 2,
						background: C.gold,
						transformOrigin: '0 50%',
						transform: `scaleX(${underline})`,
						opacity: underlineOut,
					}}
				/>
				{showLabel ? (
					<div
						style={{
							position: 'absolute',
							left: DATE.x0,
							top: DATE.underlineY + 14,
							fontFamily: 'Inter, Arial, sans-serif',
							fontWeight: 700,
							fontSize: 11,
							letterSpacing: 2.4,
							color: C.gold,
							opacity: label * underlineOut,
							transform: `translateY(${lerp(6, 0, label)}px)`,
						}}
					>
						МЕСЯЦ НАЗАД
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

// The thumbnail becomes a window into the live portfolio, then grows to full frame
const Portal: React.FC = () => {
	const f = useCurrentFrame();
	if (f < T.portalStart + 4) {
		return null;
	}
	const cam = cameraAt(Math.min(f, T.portalEnd));
	const a = toScreen(cam, THUMB.x0, THUMB.y0);
	const b = toScreen(cam, THUMB.x1, THUMB.y1);
	const done = f >= T.portalEnd;
	const rect: Rect = done ? {x0: 0, y0: 0, x1: W, y1: H, r: 0} : {x0: a.x, y0: a.y, x1: b.x, y1: b.y, r: 0};
	const radius = done ? 0 : THUMB.radius * cam.z * (1 - ease(f, T.portalEnd - 8, T.portalEnd, Easing.linear));

	const appear = ease(f, T.portalStart + 4, T.portalStart + 14, Easing.bezier(0.33, 0, 0.2, 1));
	const settle = ease(f, T.portalStart + 6, T.settleEnd, Easing.bezier(0.25, 0.1, 0.1, 1));
	const blur = lerp(12, 0, settle);
	const scale = lerp(1.14, 1, settle);
	const brightness = lerp(0.7, 1, settle);

	return (
		<AbsoluteFill style={{clipPath: insetPath(rect, W, H, radius), opacity: appear}}>
			<AbsoluteFill style={{filter: blur > 0.05 ? `blur(${blur}px) brightness(${brightness})` : undefined}}>
				<OffthreadVideo
					src={VIDEO}
					muted
					style={{width: W, height: H, transform: `scale(${scale})`, transformOrigin: '50% 40%'}}
				/>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const Scene: React.FC<{showLabel: boolean}> = ({showLabel}) => (
	<AbsoluteFill style={{background: C.graphite}}>
		<BackgroundVideo />
		<Vignette />
		<Screenshot showLabel={showLabel} />
		<Portal />
	</AbsoluteFill>
);

export const ProofInsert: React.FC<ProofInsertProps> = ({motionBlur, motionBlurSamples, showLabel, sfxVolume}) => {
	const frame = useCurrentFrame();
	// Blur only the animated part; the tail is the untouched original recording
	const blurOn = motionBlur && frame < T.settleEnd;
	return (
		<AbsoluteFill style={{background: C.graphite}}>
			{blurOn ? (
				<CameraMotionBlur shutterAngle={180} samples={motionBlurSamples}>
					<Scene showLabel={showLabel} />
				</CameraMotionBlur>
			) : (
				<Scene showLabel={showLabel} />
			)}
			{/* Original soundtrack, untouched */}
			<Audio src={VIDEO} />
			{sfxVolume > 0 ? (
				<>
					<Sequence from={T.revealStart - 3} durationInFrames={30}>
						<Audio src={staticFile('insert/sfx-reveal.wav')} volume={sfxVolume} />
					</Sequence>
					<Sequence from={T.portalStart} durationInFrames={40}>
						<Audio src={staticFile('insert/sfx-whoosh.wav')} volume={sfxVolume} />
					</Sequence>
				</>
			) : null}
		</AbsoluteFill>
	);
};
