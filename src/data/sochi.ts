// Lando Norris, 2021 Russian Grand Prix (Sochi, 26 September 2021, 53 laps).
// Running position at the end of each lap, from the Jolpica F1 API (Ergast successor):
// https://api.jolpi.ca/ergast/f1/2021/15/drivers/norris/laps.json
// Pit stops on laps 28 and 51. Started from pole, his first.
// Incidents from the race report (https://en.wikipedia.org/wiki/2021_Russian_Grand_Prix): he passed Sainz
// at turn 12 on lap 13, refused intermediates in the late rain, and aquaplaned off at turn 5 on lap 51.

export const grid = 1;

export const positions: number[] = [
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, // laps 1-12: Sainz leads
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 13-28: passes Sainz at turn 12, leads
  4, 4, 4, 4, 4, // 29-33: after his stop
  3, 3, 2, // 34-36
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 37-50: back in the lead
  4, 8, 7, // 51-53: stays out on slicks, off at turn 5, pits, finishes seventh
];

export const lapsLed = positions.filter((p) => p === 1).length;
export const totalLaps = positions.length;
