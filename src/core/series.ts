// The experiment: buy Fracture Cases for 30 days, 20 on day 1 and 5 more each next day (20, 25, 30 … 165).
export const SERIES = {
  title: 'FRACTURE CASE',
  kicker: 'ЭКСПЕРИМЕНТ TRUEDAD',
  totalDays: 30,
  firstDay: 20,
  step: 5,
};

/** Cases bought on day n (1-based): 20 + 5·(n−1). */
export const casesForDay = (n: number) => SERIES.firstDay + SERIES.step * (n - 1);

/** Cases bought on days 1..n. 2775 after day 30. */
export const casesThrough = (n: number) => Array.from({length: n}, (_, i) => casesForDay(i + 1)).reduce((a, b) => a + b, 0);
