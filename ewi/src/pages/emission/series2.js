import { fixedRate, fixedRatePeriod, epochLength, oneEpochReduction } from './constants';


// const rateSeries = [{ h: 0, r: fixedRate }, { h: fixedRatePeriod - 1, r: fixedRate }]
// const emissionSeries = [{ h: 0, e: 0 }, { h: fixedRatePeriod - 1, e: (fixedRatePeriod - 1) * fixedRate / 1000000 }]
// var height = fixedRatePeriod;
// var rate = fixedRate - oneEpochReduction;
// var emitted = (fixedRatePeriod - 1) * fixedRate / 1000000.
// while (rate > 0) {
//   rateSeries.push({ h: height, r: rate })
//   rateSeries.push({ h: height + epochLength - 1, r: rate });
//   emitted = emitted + epochLength * rate / 1000000.
//   emissionSeries.push({ h: height + epochLength - 1, e: emitted })
//   height = height + epochLength;
//   rate = rate - oneEpochReduction;
// }
// rateSeries.push({ h: height + 1, r: rate });

// -----------------------
const heights = [0, fixedRatePeriod - 1]
const rates = [fixedRate, fixedRate]
const emission = [0, (fixedRatePeriod - 1) * fixedRate]

let height = fixedRatePeriod;
let rate = fixedRate - oneEpochReduction;
let emitted = (fixedRatePeriod - 1) * fixedRate

while (rate > 0) {
  heights.push(height);
  heights.push(height + epochLength - 1);
  rates.push(rate);
  rates.push(rate);
  emission.push(emitted + rate)
  emission.push(emitted + (epochLength - 1) * rate)
  height = height + epochLength;
  rate = rate - oneEpochReduction;
  emitted = emitted + epochLength * rate
}

const series = [heights, emission, rates]

export { series }