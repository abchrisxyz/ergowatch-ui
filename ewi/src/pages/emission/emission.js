import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";

import BreadCrumbs from '../../components/breadcrumbs';
import Card from '../../components/card';
import { StatGroup, Stat } from '../../components/stats';
import { API_ROOT } from '../../config';
import './emission.css';

import { fixedRatePeriod, epochLength } from './constants';
import { rateSeries, emissionSeries } from './series';
import SoftFork from './softfork';
import { emissionAt } from './softfork-series';

function blocksToDuration(blocks) {
  const secs = blocks * 120;
  const days = Math.trunc(secs / 86400);
  const hours = Math.trunc(secs % 86400 / 3600);
  const minutes = Math.trunc(secs % 3600 / 60)
  return { 'days': days, 'hours': hours, 'minutes': minutes }
}

const Settings = () => {
  return (
    <StatGroup>
      <Stat label="Initial rate" value="75 ERG / block" />
      <Stat label="Fixed-rate period" value={fixedRatePeriod} blocks />
      <Stat label="Reduction rate" value="3 ERG / epoch" />
      <Stat label="Epoch length" value="64800 blocks" />
      <Stat label={<span><a href="https://github.com/ergoplatform/eips/blob/eip27/eip-0027.md">EIP-27</a> activation height</span>} value="777217" />
    </StatGroup>
  );
}

const CurrentEpoch = ({ epoch, rate, rateToREC, blocksRemaining, timeRemaining }) => {
  if (!epoch) return "";
  const expectedEnd = new Date();
  expectedEnd.setDate(expectedEnd.getDate() + timeRemaining.days)
  expectedEnd.setHours(expectedEnd.getHours() + timeRemaining.hours)
  expectedEnd.setMinutes(expectedEnd.getMinutes() + timeRemaining.minutes)

  return (
    <StatGroup>
      <Stat label="Number" value={epoch} />
      <Stat label="Original emission rate" value={rate + " ERG / block"} />
      <Stat label="Current block reward" value={rate - rateToREC + " ERG / block"} />
      <Stat label="Reserved for re-emission" value={rateToREC + " ERG / block"} />
      <Stat label="Blocks remaining" value={blocksRemaining} />
      <Stat label="Time remaining" value={`~${timeRemaining.days} days ${timeRemaining.hours}h${timeRemaining.minutes}m`} />
      <Stat label="Expected end" value={expectedEnd.toLocaleString()} />
    </StatGroup>
  );
}

const Supply = ({ circSupply, RECSupply }) => {
  const totalSupply = 97739925;
  const circSupplyPercentage = circSupply / totalSupply * 100;
  return (
    <StatGroup>
      <Stat label="Total" value={totalSupply.toLocaleString('en')} />
      <Stat label="Circulating" value={circSupply.toLocaleString('en')} />
      <Stat label="Circulating %" value={`${circSupplyPercentage.toFixed(2)} %`} />
      <Stat label="Re-emission contract" value={RECSupply.toLocaleString('en')} />
    </StatGroup>
  );
}

const EmissionChart = ({ currentHeight, rate }) => {
  if (!currentHeight) return "";
  const xticks = [0, currentHeight, 2080800]
  const eticks = [0, 97.74]
  const rticks = [0, rate, 75]
  return (
    <div className="chart">
      <div className="legend">
        <div style={{ color: "#35a7ff" }}>Emitted Amount [M]</div>
        <div style={{ color: "#ff5964" }}>Emission Rate [ERG/block]</div>
      </div>
      <ResponsiveContainer width="99%" height={350}>
        <LineChart margin={{ top: 5, right: -35, left: -14, bottom: 5 }}>
          <Line yAxisId="left" type="monotone" data={emissionSeries} dataKey="e" dot={false} stroke="#35a7ff" strokeWidth="1" />
          <Line yAxisId="right" type="monotone" data={rateSeries} dataKey="r" dot={false} stroke="#ff5964" strokeWidth="1" />
          <YAxis yAxisId="left" stroke="#35a7ff" domain={[0, 97.74]} ticks={eticks} />
          <YAxis yAxisId="right" orientation="right" stroke="#ff5964" name="Rate" domain={[0, 75]} ticks={rticks} />
          <ReferenceLine x={currentHeight} yAxisId="left" stroke="black" strokeWidth="1" opacity="0.5" />
          <CartesianGrid stroke="#ccc" strokeDasharray="2 2" vertical={false} />
          <XAxis dataKey="h" type="number" domain={['dataMin', 'dataMax']} ticks={xticks} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


const Emission = () => {
  var [height, setHeight] = useState(undefined);

  useEffect(() => {
    const qry = API_ROOT + "/height";
    fetch(qry)
      .then(res => res.json())
      .then(res => setHeight(res))
      .catch(err => console.error(err));
  }, [])

  const epoch = Math.trunc((height - fixedRatePeriod) / epochLength) + 1;
  // const rate = fixedRate - epoch * oneEpochReduction;
  const blocksRemaining = epochLength - (height - fixedRatePeriod) % epochLength
  const timeRemaining = blocksToDuration(blocksRemaining);

  const emissionState = emissionAt(height);
  const rate = emissionState[1];
  const RECSupply = emissionState[2];
  const circSupply = emissionState[3];
  const rateToREC = emissionState[4];

  return (
    <main>
      <h1>Emission</h1>
      <BreadCrumbs>
        <Link to="/">Home</Link>
        <Link to="/emission">Emission</Link>
      </BreadCrumbs>
      <div className="emission">
        <Card title="Parameters">
          <Settings />
        </Card>
        <Card title="Current Epoch">
          <CurrentEpoch
            epoch={epoch}
            rate={rate}
            rateToREC={rateToREC}
            blocksRemaining={blocksRemaining}
            timeRemaining={timeRemaining}
          />
        </Card>
        <Card title="Supply">
          <Supply circSupply={circSupply} RECSupply={RECSupply} />
        </Card>
      </div>

      <Card title="Emission Curve">
        <SoftFork currentHeight={height} />
      </Card>
      {/* <Card title="Initial Emission Curve (pre-EIP27)">
        <EmissionChart currentHeight={height} rate={rate} />
      </Card> */}
    </main>
  )
}

export default Emission;
