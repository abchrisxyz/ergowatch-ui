import { useState, useEffect } from 'react';

import './general.css';

const fixedRatePeriod = 525600;
const epochLength = 64800;
// const fixedRate = 75; // ERG
// const oneEpochReduction = 3; //ERG


function blocksToDuration(blocks) {
  const secs = blocks * 120;
  const days = Math.trunc(secs / 86400);
  const hours = Math.trunc(secs % 86400 / 3600);
  const minutes = Math.trunc(secs % 3600 / 60)
  return { 'days': days, 'hours': hours, 'minutes': minutes }
}

const General = () => {
  var [height, setHeight] = useState(undefined);

  useEffect(() => {
    const qry = "http://192.168.1.72:8000/height";
    fetch(qry)
      .then(res => res.json())
      .then(res => setHeight(res))
      .catch(err => console.error(err));
  }, [])

  const blocksTillNextReduction = height > fixedRatePeriod ?
    epochLength - (height - fixedRatePeriod) % epochLength
    : fixedRatePeriod - height;
  const timeTillNextReduction = blocksToDuration(blocksTillNextReduction);
  // const currentEpoch = Math.trunc(height / epochLength);
  // const blocksTillNextEpoch = (currentEpoch + 1) * epochLength - height;

  return (
    <main>
      <h1>General</h1>
      <div className="general-wrapper">
        <h2>Blocks</h2>
        <div>
          <h3>Current height: {height}</h3>
        </div>
        <div>
          <h3>Blocks till next reduction: {blocksTillNextReduction} (~{timeTillNextReduction.days} days {timeTillNextReduction.hours} hours {timeTillNextReduction.minutes} minutes)</h3>
        </div>
        {/* <div>Current epoch: {Math.trunc(height / epochLength) }</div> */}
        {/* <div>Blocks till next epoch: {blocksTillNextEpoch}</div> */}
      </div>
    </main>
  )
}

export default General;