import React from 'react';
import {G, I, L, P, Scene} from './film';
import {BREAKOUT, BotScan, CaseChart, CaseFlow, Chronicle, CovertMerge, DayCells, DemandShift, Frozen, GAMMA2, GLOVE, ListedUse, Liquidity, Online, Prepay, PriceJump, Protection, RegionalPrice, Spread, ThreeCases, Trust, Turnover} from './graphics';
import {Quote} from './quote';

/*
 * Кадры 14–78. Длительность каждой сцены — по её тексту в сценарии (src/narration.json),
 * внутри сцены время делится между планами по весам w. Переходы и движения камеры чередуются.
 */
const K = (n: string) => `Архив_курса/${n}.png`;
const W04 = K('04_Steam_Winter_Sale_75pct_архив_курса');

export const CHAPTERS: {id: string; title: string; scenes: Scene[]}[] = [
  {
    id: 'Ch02-Tail',
    title: 'Появление CS:GO — коллекционные истории',
    scenes: [
      {n: 14, plans: [I('A11_armsdeal_collection_2013', {mode: 'card', width: 1300, dir: 'in'}), P('A27_skinory_ak661', 'push', {fx: 560, fy: 420, z: 1.4}), P('A26_dexerto_2024', 'tilt', {fx: 560, fy: 520, z: 1.35}), P('A25_pcgamer_howl_2014', 'pull', {fx: 760, fy: 700})]},
      {n: 15, plans: [L(W04, 'K04', {dir: 'up', mode: 'full'}), P('A30_steam_holiday_day3_2013', 'push', {fx: 560, fy: 520})]},
    ],
  },
  {
    id: 'Ch03-Regional',
    title: 'Торговля региональными играми',
    scenes: [
      {n: 16, plans: [P('A02_steam_trading_2011', 'tilt', {fx: 640, fy: 420}), P('A02_steam_trading_2011', 'scroll', {fx: 640, fy: 600})]},
      {n: 17, plans: [P('A38', 'scroll', {fx: 640, fy: 700}), G(() => <RegionalPrice stage="prices" />)]},
      {n: 18, plans: [G(() => <RegionalPrice />, {w: 2.2}), I('A31_holiday_sale_2014', {mode: 'card', width: 1400, dir: 'right'})]},
      {n: 19, plans: [L(W04, 'K04', {dir: 'in', mode: 'full'}), P('A30', 'push', {fx: 560, fy: 520}), I('A31_holiday_sale_2014', {dir: 'left', mode: 'card', width: 1500}), P('A76', 'scroll', {fx: 560, fy: 520})]},
      {n: 20, plans: [P('A02_steam_trading_2011', 'panR', {fx: 640, fy: 560, z: 1.35}), G(Trust, {w: 1.6}), G(Prepay, {w: 1.3}), P('A38', 'drift', {fx: 640, fy: 520, w: 0.9})]},
      {n: 21, plans: [P('A36', 'push', {fx: 640, fy: 520}), P('A38', 'pull', {fx: 640, fy: 520})]},
      {n: 22, plans: [P('A37', 'tilt', {fx: 640, fy: 420}), P('A37', 'scroll', {fx: 640, fy: 700}), P('A51', 'drift', {fx: 560, fy: 520, gray: true, w: 0.7})]},
    ],
  },
  {
    id: 'Ch04-Markets',
    title: 'Сторонние маркеты, рулетки и боты',
    scenes: [
      {n: 23, plans: [I('A23_market_2016', {mode: 'card', width: 1250, dir: 'right'}), P('A80', 'push', {fx: 640, fy: 600}), I('A43_csgolounge', {mode: 'card', width: 1400, dir: 'in'})]},
      {n: 24, plans: [I('A23_market_2016', {mode: 'full', dir: 'left', w: 0.7}), G(Spread, {w: 1.4})]},
      {n: 25, plans: [P('A51', 'scroll', {fx: 560, fy: 1000}), G(BotScan, {w: 1.6}), I('A74_market_2016', {mode: 'card', width: 1250, dir: 'left'}), P('A78_market_cases_today', 'panR', {fx: 800, fy: 600})]},
      {n: 26, plans: [L(K('05_CSGODouble_архив_курса'), 'K05', {dir: 'in', mode: 'full', w: 1.3}), I('A43_csgolounge', {mode: 'card', width: 1400, dir: 'right'}), P('A80', 'scroll', {fx: 640, fy: 900})]},
      {n: 27, plans: [P('A42', 'push', {fx: 640, fy: 520}), P('A42', 'scroll', {fx: 640, fy: 1000})]},
      {n: 28, plans: [P('A51', 'pull', {fx: 560, fy: 800}), P('A39', 'tilt', {fx: 640, fy: 420})]},
    ],
  },
  {
    id: 'Ch05-SteamGuard',
    title: 'Steam Guard и 15-дневные задержки',
    scenes: [
      {n: 29, plans: [P('A40', 'push', {fx: 560, fy: 640})]},
      {n: 30, plans: [P('A41', 'scroll', {fx: 640, fy: 600}), G(() => <DayCells label="STEAM GUARD · 09.03.2016" title="Без мобильного аутентификатора" days={15} sub="Обмен и продажа — задержка до 15 дней" />, {w: 1.3})]},
      {n: 31, plans: [I('A74_market_2016', {mode: 'card', width: 1250, dir: 'in'}), G(() => <PriceJump label="ЕДИНИЧНЫЙ ПРИМЕР ИЗ ТОГО ПЕРИОДА" title="Перекос цен между площадками" from={3} to={30} unit=" ₽" fromLabel="На одной площадке" toLabel="На другой" badge="×10" />, {w: 1.3}), P('A78_market_cases_today', 'panL', {fx: 800, fy: 600, w: 0.8})]},
      {n: 32, plans: [P('A39', 'scroll', {fx: 640, fy: 800}), P('A40', 'pull', {fx: 560, fy: 640})]},
    ],
  },
  {
    id: 'Ch06-Pubg',
    title: 'Эра PUBG',
    scenes: [
      {n: 33, plans: [I('A85_pubg_keyart_2017', {mode: 'full', dir: 'in', tr: 'dip'})]},
      {n: 34, plans: [G(Online)]},
      {n: 35, plans: [I('A50_pubg_market', {mode: 'card', width: 1150, dir: 'right'}), P('A48', 'push', {fx: 640, fy: 600}), I('A49_pubg_trenchcoat_market', {mode: 'card', width: 1350, dir: 'in'})]},
      {n: 36, plans: [L(K('06_PUBG_Trenchcoat_цена_архив_курса'), 'K06', {mode: 'card', dir: 'right'}), G(() => <PriceJump label="PUBG · TRENCH COAT" title="За полгода в отдельный период" from={3000} to={53000} unit=" ₽" fromLabel="Было" toLabel="Стало" badge="×18" />, {w: 1.2}), I('A85_pubg_keyart_2017', {mode: 'full', dir: 'out', w: 0.8})]},
      {n: 37, plans: [P('A51', 'push', {fx: 560, fy: 520}), P('A52', 'push', {fx: 720, fy: 380, tr: 'whip'})]},
    ],
  },
  {
    id: 'Ch07-WorstSpring',
    title: 'Худшая весна для трейдеров',
    scenes: [
      {n: 38, plans: [P('A51', 'scroll', {fx: 560, fy: 1100, tr: 'dip'})]},
      {n: 39, plans: [P('A51', 'push', {fx: 560, fy: 760, w: 0.8}), G(() => <DayCells label="CS:GO · 29.03.2018" title="После обмена — ждать неделю" days={7} sub="Повторная передача — через 7 дней" />)]},
      {n: 40, plans: [G(Turnover, {w: 1.5}), G(Frozen, {w: 1.5}), P('A51', 'scroll', {fx: 560, fy: 1250, w: 0.8})]},
      {n: 41, plans: [P('A52', 'tilt', {fx: 720, fy: 380}), P('A52', 'scroll', {fx: 720, fy: 860})]},
      {n: 42, plans: [P('A51', 'pull', {fx: 560, fy: 520, gray: true}), P('A52', 'pull', {fx: 720, fy: 380, gray: true}), P('A78_market_listing_today', 'drift', {fx: 800, fy: 600})]},
    ],
  },
  {
    id: 'Ch08-InvestBoom',
    title: 'Инвестиционный бум',
    scenes: [
      {n: 43, plans: [P('A10', 'drift', {fx: 800, fy: 700, tr: 'dip', w: 0.8}), P('A78_market_cases_today', 'panR', {fx: 800, fy: 520})]},
      {n: 44, plans: [G(() => <PriceJump label="ПЕРЧАТОЧНЫЙ КЕЙС · GLOVE CASE" title="За два с половиной года" from={0.25} to={200} unit=" ₽" fromLabel="Январь 2019" toLabel="Июнь 2021" badge="×800" />, {w: 1.2}), G(() => <CaseChart name="Перчаточный кейс (Glove Case)" pts={GLOVE} show={2} />)]},
      {n: 45, plans: [P('A57', 'push', {fx: 800, fy: 450, w: 0.6}), G(() => <CaseChart name="Перчаточный кейс (Glove Case)" pts={GLOVE} hi={2} />, {w: 1.4})]},
      {n: 46, plans: [G(() => <PriceJump label="КЕЙС ОПЕРАЦИИ «ПРОРЫВ»" title="Январь 2019 → июнь 2021" from={1.5} to={220} unit=" ₽" fromLabel="Январь 2019" toLabel="Июнь 2021" badge="≈×150" />), G(() => <CaseChart name="Кейс операции «Прорыв»" pts={BREAKOUT} hi={2} />, {w: 1.3})]},
      {n: 47, plans: [G(() => <PriceJump label="GAMMA 2" title="Январь 2019 → сентябрь 2021" from={0.25} to={47} unit=" ₽" fromLabel="Январь 2019" toLabel="Сентябрь 2021" badge="≈×190" />), G(() => <CaseChart name="Gamma 2" pts={GAMMA2} hi={2} />, {w: 1.3})]},
      {n: 48, plans: [P('A78_market_listing_today', 'scroll', {fx: 800, fy: 700}), P('A78_market_listing_today', 'panL', {fx: 800, fy: 560})]},
      {n: 49, plans: [P('A10', 'tilt', {fx: 800, fy: 2700}), G(() => <CaseFlow part="supply" />, {w: 1.5})]},
      {n: 50, plans: [P('A78_market_listing_today', 'tilt', {fx: 800, fy: 600, w: 0.6}), G(() => <CaseFlow part="investors" />, {w: 1.4})]},
      {n: 51, plans: [G(Liquidity, {w: 2.2}), P('A78_market_listing_today', 'scroll', {fx: 800, fy: 700}), G(ThreeCases, {w: 1.3}), P('A78_market_cases_today', 'drift', {fx: 800, fy: 700, w: 0.9}), L(K('09_RMR_капсула_архив_курса'), 'K09', {mode: 'full', dir: 'in', w: 0.8})]},
    ],
  },
  {
    id: 'Ch09-Stickers',
    title: 'Наклейки RMR и Stockholm',
    scenes: [
      {n: 52, plans: [P('A55', 'push', {fx: 560, fy: 600, tr: 'dip'}), P('A55', 'scroll', {fx: 560, fy: 800})]},
      {n: 53, plans: [P('A54', 'tilt', {fx: 720, fy: 520})]},
      {n: 54, plans: [L(K('08_Старые_командные_наклейки_архив_курса'), 'K08', {mode: 'full', dir: 'left'}), G(() => <PriceJump label="СТАРЫЙ ФОРМАТ · КОМАНДНЫЕ НАКЛЕЙКИ" title="Фиксированная цена" from={64} to={16} unit=" ₽" fromLabel="Обычная цена" toLabel="На распродаже" badge="−75%" />)]},
      {n: 55, plans: [L(K('09_RMR_капсула_архив_курса'), 'K09', {mode: 'card', dir: 'in'}), G(() => <PriceJump label="RMR 2020 · КАПСУЛЫ" title="Случайная наклейка из капсулы" from={76} to={19} unit=" ₽" fromLabel="Капсула" toLabel="Во время скидки" badge="−75%" />)]},
      {n: 56, plans: [L(K('09_RMR_капсула_архив_курса'), 'K09', {mode: 'full', dir: 'out'}), P('A53', 'scroll', {fx: 560, fy: 800})]},
      {n: 57, plans: [L(K('10_RMR_график_после_продаж_архив_курса'), 'K10', {mode: 'card', dir: 'right'}), P('A55', 'pull', {fx: 560, fy: 700, w: 0.8})]},
      {n: 58, plans: [P('A56', 'push', {fx: 560, fy: 640}), L(K('11_Stockholm_2021_архив_курса'), 'K11', {mode: 'full', dir: 'left', w: 1.2}), P('A56', 'scroll', {fx: 560, fy: 900}), P('A54', 'pull', {fx: 720, fy: 520}), L(K('09_RMR_капсула_архив_курса'), 'K09', {mode: 'card', dir: 'out'})]},
    ],
  },
  {
    id: 'Ch10-CS2',
    title: 'Выход Counter-Strike 2',
    scenes: [
      {n: 59, plans: [I('A58_cs2_tickrate_2023', {mode: 'card', width: 1500, dir: 'in', tr: 'dip'})]},
      {n: 60, plans: [P('A57', 'drift', {fx: 560, fy: 420, z: 1.45}), I('A58_cs2_tickrate_2023', {mode: 'full', dir: 'out'})]},
      {n: 61, plans: [G(() => <CaseChart name="Кейс операции «Прорыв» — 2023" pts={BREAKOUT} hi={2} />), P('A78_market_listing_today', 'push', {fx: 800, fy: 600})]},
      {n: 62, plans: [P('A57', 'pull', {fx: 800, fy: 450}), G(ThreeCases)]},
      {n: 63, plans: [G(() => <Quote head="[ INVENTORY & ITEMS ] · 02.10.2024" text="All items acquired from the in-game store (including the Armory), Trade Offers, and Steam Community Market are now subject to a 7 day re-trade and re-market restriction" />, {w: 1.3}), G(() => <DayCells label="CS2 · 02.10.2024" title="Купил на Steam Market — 7 дней до перепродажи" days={7} color="#D9A93D" />), P('A41', 'scroll', {fx: 640, fy: 700})]},
    ],
  },
  {
    id: 'Ch11-NewEconomy',
    title: 'Новая экономика CS2',
    scenes: [
      {n: 64, plans: [P('A61', 'push', {fx: 640, fy: 520, tr: 'dip'})]},
      {n: 65, plans: [P('A61', 'scroll', {fx: 640, fy: 700, w: 0.9}), G(() => <Protection part="rule" />, {w: 1.2})]},
      {n: 66, plans: [G(() => <Protection part="risk" />, {w: 1.3}), P('A78_market_listing_today', 'drift', {fx: 800, fy: 600, w: 0.7})]},
      {n: 67, plans: [I('A63_genesis_collection', {mode: 'card', width: 1450, dir: 'in'})]},
      {n: 68, plans: [I('A63_genesis_terminal', {mode: 'full', dir: 'right'}), I('A63_genesis_collection', {mode: 'full', dir: 'out'})]},
      {n: 69, plans: [P('A66', 'tilt', {fx: 800, fy: 500, w: 0.7}), P('A66', 'scroll', {fx: 800, fy: 1150})]},
      {n: 70, plans: [P('A66', 'push', {fx: 800, fy: 900, w: 0.6}), G(CovertMerge, {w: 1.6})]},
      {n: 71, plans: [P('A78_market_cases_today', 'panL', {fx: 800, fy: 560}), G(DemandShift, {w: 1.6}), P('A78_market_listing_today', 'drift', {fx: 800, fy: 600, w: 0.8}), P('A66', 'pull', {fx: 800, fy: 1200, w: 0.8})]},
      {n: 72, plans: [G(ListedUse, {w: 1.3}), P('A78_market_listing_today', 'push', {fx: 900, fy: 420, w: 0.8})]},
      {n: 73, plans: [P('A69', 'tilt', {fx: 800, fy: 900}), I('A70_major_shop_2026', {mode: 'full', dir: 'in'})]},
      {n: 74, plans: [I('A70_souvenir_2026', {mode: 'full', dir: 'left'}), P('A71', 'push', {fx: 800, fy: 500}), I('A70_cologne_coin_tokens_2026', {mode: 'full', dir: 'out'}), P('A01', 'pull', {fx: 800, fy: 700, gray: true})]},
    ],
  },
  {
    id: 'Final',
    title: 'Финал',
    scenes: [
      {n: 75, plans: [L(W04, 'K04', {mode: 'full', dir: 'out', gray: true, tr: 'dip', w: 0.8}), P('A37', 'push', {fx: 640, fy: 420, gray: true})]},
      {n: 76, plans: [P('A51', 'push', {fx: 560, fy: 520, gray: true})]},
      {n: 77, plans: [G(() => <Chronicle items={[{y: '2017', txt: 'подарочные игры', img: 'sources/A37.jpg'}, {y: '2018', txt: 'скорость обменов', img: 'sources/A51.jpg'}, {y: '2021', txt: 'наклейки RMR', img: 'sources/A54.jpg'}, {y: '2025', txt: 'ножи и контракты', img: 'sources/A66.jpg'}, {y: '2026', txt: 'сувениры и стикеры', img: 'sources/A69.jpg'}]} />)]},
      {n: 78, plans: [P('A78_market_listing_today', 'panR', {fx: 800, fy: 600}), G(ThreeCases), P('A10', 'drift', {fx: 800, fy: 500}), P('A01', 'pull', {fx: 800, fy: 700, gray: true}), L(W04, 'K04', {mode: 'full', dir: 'up', gray: true}), P('A57', 'push', {fx: 800, fy: 450})]},
    ],
  },
];
