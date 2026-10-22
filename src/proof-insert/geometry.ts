// All coordinates are in pixels of the original screenshot (2000×619).
// They were measured on public/insert/youtube-prev.jpg — re-measure if the screenshot is replaced.

export const SHOT = {width: 2000, height: 619};

// Rounded thumbnail of the previous video
export const THUMB = {x0: 213, y0: 50, x1: 1031, y1: 508, radius: 26};

// Visible card crop (left YouTube sidebar and right scrollbar are excluded)
export const CARD = {x0: 190, y0: 22, x1: 1940, y1: 619, radius: 30};

// Original "1 мес. назад" text: underline is drawn just below its descenders
export const DATE = {x0: 1189, x1: 1354, underlineY: 213};

// Camera targets: point of the screenshot placed at frame centre + zoom
export type Cam = {cx: number; cy: number; z: number};

export const CAM_THUMB: Cam = {cx: 622, cy: 279, z: 2.35};
export const CAM_CARD: Cam = {cx: 1065, cy: 300, z: 1.34};
export const CAM_DATE: Cam = {cx: 1262, cy: 292, z: 1.86};
export const CAM_DATE_DRIFT: Cam = {cx: 1268, cy: 290, z: 1.95};
// Thumbnail is ~16:9, so at z≈3.13 it exactly covers the 2560×1440 frame
export const CAM_PORTAL: Cam = {cx: 622, cy: 279, z: 3.6};
