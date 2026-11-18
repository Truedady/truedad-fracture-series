import {loc, pg, ph, quote, Scene, steps} from './kit';

/*
 * Сцены 19–78 (номера из SCENES.json). Тайминги условные — до озвучки.
 * Принцип: настоящие страницы/архивы, 4–7 с на план, минимум графики, без выделений текста.
 */
const W = 'Архив_курса/04_Steam_Winter_Sale_75pct_архив_курса.png';
const G = (n: string) => `Готовая_графика/${n}.png`;
const K = (n: string) => `Архив_курса/${n}.png`;

export const CHAPTERS: {id: string; title: string; scenes: Scene[]}[] = [
  {
    id: 'Ch03-Regional',
    title: 'Региональная торговля играми',
    scenes: [
      {n: 19, plans: [loc(W, 'K04', {dur: 4.5, tag: 'HOLIDAY SALE · 2013', to: [783, 1008, 1.25]}), ph('A31_holiday_sale_2014', 1500, {dur: 4.5, tag: 'HOLIDAY SALE · 2014'})]},
      {n: 20, plans: [pg('A02_steam_trading_2011', 'steam', 640, {tag: 'STEAM TRADING · 2011'})]},
      {n: 21, plans: [pg('A36', 'article', 560, {dur: 4, tag: 'PC GAMER · 2014'}), pg('A38', 'support', 520, {dur: 3.5})]},
      {n: 22, plans: [pg('A37', 'event', 560, {dur: 6.5, tag: '03.05.2017'})]},
    ],
  },
  {
    id: 'Ch04-Markets',
    title: 'Сторонние маркеты, рулетки и боты',
    scenes: [
      {n: 23, plans: [ph('A23_market_2016', 900, {tag: 'STEAM MARKET · 2016'})]},
      {n: 24, plans: [ph('A74_market_2016', 1200, {tag: 'ИСТОРИЯ ПРОДАЖ · 2016'})]},
      {n: 25, plans: [pg('A51', 'blog', 900, {tag: 'VALVE · 29.03.2018'})]},
      {n: 26, plans: [loc(K('05_CSGODouble_архив_курса'), 'K05', {tag: 'CSGODOUBLE · АРХИВ КУРСА'})]},
      {n: 27, plans: [pg('A42', 'article', 600, {tag: 'ARS TECHNICA · 20.07.2016'})]},
      {n: 28, plans: [pg('A78_market_cases_today', 'center', 700, {tag: 'STEAM MARKET · СЕГОДНЯ'})]},
    ],
  },
  {
    id: 'Ch05-SteamGuard',
    title: 'Steam Guard и 15-дневные задержки',
    scenes: [
      {n: 29, plans: [pg('A40', 'blog', 760, {tag: 'VALVE · 2016'})]},
      {n: 30, plans: [pg('A41', 'support', 520)]},
      {n: 31, plans: [loc(G('05_Трейдлок_и_оборот_капитала'), 'G05')]},
      {n: 32, plans: [pg('A39', 'steam', 620, {tag: 'VALVE · 2015'})]},
    ],
  },
  {
    id: 'Ch06-Pubg',
    title: 'Эра PUBG',
    scenes: [
      {n: 33, plans: [ph('A85_pubg_keyart_2017', 1500, {tag: 'EARLY ACCESS · 23.03.2017'})]},
      {n: 34, plans: [ph('A45_pubg_trailer_2017', 1400, {tag: 'PUBG · 2017'})]},
      {n: 35, plans: [pg('A48', 'article', 640, {dur: 3.5}), ph('A49_pubg_trenchcoat_market', 1100, {dur: 3.5, tag: 'TRENCH COAT · STEAM MARKET'})]},
      {n: 36, plans: [loc(K('06_PUBG_Trenchcoat_цена_архив_курса'), 'K06', {dur: 3.5, tag: 'АРХИВ КУРСА'}), loc(G('04_PUBG_Trenchcoat_рост'), 'G04', {dur: 3.5})]},
      {n: 37, plans: [pg('A51', 'blog', 560, {dur: 3.5, tag: '29.03.2018'}), pg('A52', 'event', 520, {dur: 3.5, tag: '03.05.2018'})]},
    ],
  },
  {
    id: 'Ch07-WorstSpring',
    title: 'Худшая весна для трейдеров',
    scenes: [
      {n: 38, plans: [pg('A51', 'blog', 1150, {dur: 6.5})]},
      {n: 39, plans: [loc(G('05_Трейдлок_и_оборот_капитала'), 'G05', {to: [700, 540, 1.12]})]},
      {n: 40, plans: [loc(G('05_Трейдлок_и_оборот_капитала'), 'G05', {to: [1250, 600, 1.12]})]},
      {n: 41, plans: [pg('A52', 'event', 860, {dur: 6.5, tag: 'PUBG · 03.05.2018'})]},
      {n: 42, plans: [pg('A51', 'blog', 560, {dur: 3.5, tag: '29.03.2018'}), pg('A52', 'event', 520, {dur: 3.5, tag: '03.05.2018'})]},
    ],
  },
  {
    id: 'Ch08-InvestBoom',
    title: 'Инвестиционный бум',
    scenes: [
      {n: 43, plans: [pg('A78_market_cases_today', 'center', 640, {tag: 'STEAM MARKET · СЕГОДНЯ'})]},
      {n: 44, plans: [loc(G('01_Glove_Case_архивные_точки'), 'G01', {to: [700, 560, 1.1]})]},
      {n: 45, plans: [loc(G('01_Glove_Case_архивные_точки'), 'G01', {dur: 5, to: [1300, 520, 1.12]})]},
      {n: 46, plans: [loc(G('02_Breakout_Case_архивные_точки'), 'G02')]},
      {n: 47, plans: [loc(G('03_Gamma_2_архивные_точки'), 'G03')]},
      {n: 48, plans: [pg('A78_market_listing_today', 'center', 760, {tag: 'ПРИМЕР · СЕГОДНЯ'})]},
      {n: 49, plans: [pg('A10', 'csnet', 2700, {startY: 2500, z: 1.3})]},
      {n: 50, plans: [steps('ПОЧЕМУ СТАРЫЕ КЕЙСЫ ДОРОЖАЮТ', ['Кейс перестаёт регулярно выпадать', 'Игроки продолжают открывать', 'Инвесторы скупают в расчёте на рост'], 'Упрощённая схема.')]},
      {n: 51, plans: [loc(G('01_Glove_Case_архивные_точки'), 'G01', {dur: 2.5}), loc(G('02_Breakout_Case_архивные_точки'), 'G02', {dur: 2.5}), loc(G('03_Gamma_2_архивные_точки'), 'G03', {dur: 2.5, tag: 'ИСТОРИЧЕСКИЕ ТОЧКИ КУРСА'})]},
    ],
  },
  {
    id: 'Ch09-Stickers',
    title: 'Наклейки RMR и Stockholm',
    scenes: [
      {n: 52, plans: [pg('A55', 'blog', 760, {tag: 'VALVE · 06.04.2021'})]},
      {n: 53, plans: [pg('A54', 'event', 700, {dur: 6.5, tag: '27.01.2021'})]},
      {n: 54, plans: [loc(K('08_Старые_командные_наклейки_архив_курса'), 'K08', {tag: 'АРХИВ КУРСА'})]},
      {n: 55, plans: [loc(K('09_RMR_капсула_архив_курса'), 'K09', {tag: 'АРХИВ КУРСА'})]},
      {n: 56, plans: [loc(K('09_RMR_капсула_архив_курса'), 'K09', {to: [516, 360, 1.25]})]},
      {n: 57, plans: [loc(K('10_RMR_график_после_продаж_архив_курса'), 'K10', {tag: 'АРХИВ КУРСА'})]},
      {n: 58, plans: [pg('A56', 'blog', 760, {dur: 3.5, tag: '21.10.2021'}), loc(K('11_Stockholm_2021_архив_курса'), 'K11', {dur: 3.5})]},
    ],
  },
  {
    id: 'Ch10-CS2',
    title: 'Выход Counter-Strike 2',
    scenes: [
      {n: 59, plans: [ph('A58_cs2_tickrate_2023', 1400, {tag: 'АНОНС · 22.03.2023'})]},
      {n: 60, plans: [pg('A57', 'csnet', 420, {startY: 450, fx: 560, z: 1.45})]},
      {n: 61, plans: [loc(G('02_Breakout_Case_архивные_точки'), 'G02', {to: [1300, 520, 1.12], tag: '2023 · АРХИВ КУРСА'})]},
      {n: 62, plans: [pg('A57', 'csnet', 450, {startY: 450, z: 1.2, tag: 'РЕЛИЗ · 27.09.2023'})]},
      {n: 63, plans: [quote('[ INVENTORY & ITEMS ]', 'All items acquired from the in-game store (including the Armory), Trade Offers, and Steam Community Market are now subject to a 7 day re-trade and re-market restriction', 'Counter-Strike 2 · Release Notes for 10/2/2024 · Valve')]},
    ],
  },
  {
    id: 'Ch11-NewEconomy',
    title: 'Новая экономика CS2',
    scenes: [
      {n: 64, plans: [pg('A61', 'support', 560, {tag: 'STEAM SUPPORT · 2025'})]},
      {n: 65, plans: [pg('A61', 'support', 1300, {startY: 900})]},
      {n: 66, plans: [steps('TRADE PROTECTION', ['Предмет получен через обмен', '7 дней защиты: обмен можно отменить', 'Сделка окончательная'], 'Схема механики Steam Trade Protection.')]},
      {n: 67, plans: [ph('A63_genesis_collection', 1300, {tag: 'GENESIS COLLECTION · 2025'})]},
      {n: 68, plans: [ph('A63_genesis_terminal', 1300)]},
      {n: 69, plans: [pg('A66', 'csnet', 1150, {dur: 6.5, tag: '22.10.2025'})]},
      {n: 70, plans: [loc(G('07_Пять_Covert_контракт'), 'G07')]},
      {n: 71, plans: [loc(G('07_Пять_Covert_контракт'), 'G07', {to: [1300, 540, 1.12]})]},
      {n: 72, plans: [pg('A78_market_listing_today', 'center', 520, {tag: 'STEAM MARKET · СЕГОДНЯ'})]},
      {n: 73, plans: [pg('A69', 'csnet', 900, {dur: 3.5, tag: 'COLOGNE 2026'}), ph('A70_major_shop_2026', 1500, {dur: 3.5})]},
      {n: 74, plans: [ph('A70_souvenir_2026', 1500, {dur: 3.5}), pg('A71', 'center', 560, {dur: 3.5})]},
    ],
  },
  {
    id: 'Final',
    title: 'Финал',
    scenes: [
      {n: 75, plans: [pg('A37', 'event', 560, {gray: true, tag: '2017'})]},
      {n: 76, plans: [pg('A51', 'blog', 560, {dur: 3.5, gray: true, tag: '2018'}), pg('A52', 'event', 520, {dur: 3.5, gray: true})]},
      {n: 77, plans: [pg('A54', 'event', 700, {dur: 3.5, tag: '2021'}), pg('A66', 'csnet', 1150, {dur: 3.5, tag: '2025'})]},
      {n: 78, plans: [pg('A01', 'center', 700, {dur: 3, gray: true}), loc(W, 'K04', {dur: 3}), pg('A57', 'csnet', 560, {dur: 3, startY: 450, z: 1.25})]},
    ],
  },
];
