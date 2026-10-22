// Frame timings at 30 fps. The animated part lasts ~3.5 s (0–105);
// after that the original recording plays on untouched until its end.
export const FPS = 30;
export const SOURCE_FRAMES = 141; // 1022(2).mp4 is 4.7 s

export const T = {
	// 0:00–0:00.5 — push-in on the portfolio, then dim
	dimStart: 9,
	dimEnd: 22,
	// 0:00.5–0:01.2 — masked reveal of the old video: thumbnail first, then open to the right
	revealStart: 14,
	revealThumbEnd: 26,
	openRightStart: 22,
	openRightEnd: 40,
	// 0:01.2–0:02.4 — camera settles on "1 мес. назад", underline draws
	toDateStart: 38,
	toDateEnd: 62,
	underlineStart: 50,
	underlineEnd: 66,
	// 0:02.4–0:03.5 — push into the thumbnail, which opens onto the live portfolio
	portalStart: 74,
	portalEnd: 100,
	settleEnd: 112,
};
