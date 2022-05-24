import { fixedRate, fixedRatePeriod, epochLength, oneEpochReduction } from './constants';


// Get emission rate applying to given epoch.
// This is not a network epoch but the epoch count
// after fixed emission period ended.
// Epoch 1 starts at block 525600 etc...
function emissionRateFromEpoch(epoch) {
  return Math.max(0, fixedRate - oneEpochReduction * epoch);
}

// Convert original emission rate to soft fork re-emission contract filling rate
function reserveRate(emissionRate) {
  return emissionRate >= 15 ? 12 : Math.max(0, emissionRate - 3);
}

function emissionAt(height) {

  const step = oneEpochReduction;
  const softForkHeight = 777217;

  // At current height
  const completedEpochs = Math.floor(Math.max(0, height - fixedRatePeriod) / epochLength)
  const currentEpoch = height < fixedRatePeriod ? 0 : completedEpochs + 1
  const blocksInCurrentEpoch = height < fixedRatePeriod ? 0 : (height - fixedRatePeriod) % epochLength + 1
  const currentRate = Math.max(0, fixedRate - currentEpoch * step)

  // Original emission components
  const fixedPeriodCS = Math.min(fixedRatePeriod - 1, height) * fixedRate
  const completedEpochsCS = [...Array(completedEpochs).keys()]
    .map(i => epochLength * emissionRateFromEpoch(i + 1))
    .reduce((acc, erg) => acc + erg, 0);
  const currentEpochCS = blocksInCurrentEpoch * currentRate

  // Reserved to re-emission contract - i.e. what goes into the contract
  let reserved = 0
  if (height >= softForkHeight) {
    // Soft fork kicks somewhere halfway in 4th epoch, when emission rate is 63 ERG/block.
    const last_block_at_63 = 784799;
    const blocks = Math.min(height - softForkHeight + 1, last_block_at_63 - softForkHeight + 1)
    reserved += 12 * blocks;

    // Completed epochs
    [...Array(completedEpochs).keys()].forEach((i) => {
      const epoch = i + 1
      if (epoch > 4) {
        reserved += reserveRate(emissionRateFromEpoch(epoch)) * epochLength;
      }
    });


    // Current epoch (if in 4th, then already handled above)
    if (currentEpoch > 4) {
      reserved += blocksInCurrentEpoch * reserveRate(currentRate);
    }
  }

  // Re-emitted supply - what goes out of the contract
  const reemissionRate = 3
  const reemitted = Math.max(0, height - 2080800 + 1) * reemissionRate
  reserved -= Math.min(reserved, reemitted)

  // Original circulating supply
  const originalCS = fixedPeriodCS + completedEpochsCS + currentEpochCS;

  // New circulating supply
  const modifiedCS = originalCS - reserved;

  return [originalCS, currentRate, reserved, modifiedCS];
}

const heights = [
  0,
  525599,
  525600,
  590399,
  590400,
  655199,
  655200,
  719999,
  720000,
  777217,
  784799,
  784800,
  849599,
  849600,
  914399,
  914400,
  979199,
  979200,
  1043999,
  1044000,
  1108799,
  1108800,
  1173599,
  1173600,
  1238399,
  1238400,
  1303199,
  1303200,
  1367999,
  1368000,
  1432799,
  1432800,
  1497599,
  1497600,
  1562399,
  1562400,
  1627199,
  1627200,
  1691999,
  1692000,
  1756799,
  1756800,
  1821599,
  1821600,
  1886399,
  1886400,
  1951199,
  1951200,
  2015999,
  2016000,
  2080799,
  2080800,
  3000000,
  4000000,
  5000000,
  6000000,
  6958427,
]

const data = heights.map(h => emissionAt(h));
const series = [
  heights,
  data.map(d => d[0]), // original circulating supply
  data.map(d => d[1]), // original emission rate
  data.map(d => d[3]), // modified circulating supply
  data.map(d => d[2]), // reserved supply
];

export { series }