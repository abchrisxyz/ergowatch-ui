import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, ReferenceLine, Legend } from "recharts";

import BreadCrumbs from '../../components/breadcrumbs';
import Card from '../../components/card';
import { StatGroup, Stat } from '../../components/stats';
import './emission.css';

import { fixedRate, fixedRatePeriod, epochLength, oneEpochReduction } from './constants';
import { rateSeries, emissionSeries } from './series';

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
    </StatGroup>
  );
}

const CurrentEpoch = ({ epoch, rate, blocksRemaining, timeRemaining }) => {
  if (!epoch) return "";
  return (
    <StatGroup>
      <Stat label="Number" value={epoch} />
      <Stat label="Emission rate" value={rate + " ERG / block"} />
      <Stat label="Blocks remaining" value={blocksRemaining} />
      <Stat label="Time remaining" value={`~${timeRemaining.days} days ${timeRemaining.hours}h${timeRemaining.minutes}m`} />
    </StatGroup>
  );
}

const Temp = () => {
  return (
    <StatGroup>
      <Stat label="Circulating" value="35M" />
      <Stat label="Total" value="97.74M" />
      <Stat label="% Of Total" value="33 %" />
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
      <ResponsiveContainer width="99%" height={350}>
        <LineChart>
          <Line yAxisId="left" type="monotone" data={emissionSeries} dataKey="e" dot={false} stroke="#35a7ff" strokeWidth="1" />
          <Line yAxisId="right" type="monotone" data={rateSeries} dataKey="r" dot={false} stroke="#ff5964" strokeWidth="1" />
          <YAxis yAxisId="left" stroke="#35a7ff" domain={[0, 97.74]} ticks={eticks} />
          <YAxis yAxisId="right" orientation="right" stroke="#ff5964" name="Rate" domain={[0, 75]} ticks={rticks} />
          <Legend verticalAlign="top" iconType="line" />
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
    const qry = "http://192.168.1.72:8000/height";
    fetch(qry)
      .then(res => res.json())
      .then(res => setHeight(res))
      .catch(err => console.error(err));
  }, [])

  const epoch = Math.trunc((height - fixedRatePeriod) / epochLength) + 1;
  const rate = fixedRate - epoch * oneEpochReduction;
  const blocksRemaining = epochLength - (height - fixedRatePeriod) % epochLength
  const timeRemaining = blocksToDuration(blocksRemaining);

  return (
    <main>
      <h1>Emission</h1>
      <BreadCrumbs>
        <Link to="/">Home</Link>
        <Link to="/emission">Emission</Link>
      </BreadCrumbs>
      <div className="emission">
        <Card title="Settings">
          <Settings />
        </Card>
        <Card title="Current Epoch">
          <CurrentEpoch
            epoch={epoch}
            rate={rate}
            blocksRemaining={blocksRemaining}
            timeRemaining={timeRemaining}
          />
        </Card>
        <Card title="Coins">
          <Temp />
        </Card>
      </div>
      <Card title="Emission Curve">
        <EmissionChart currentHeight={height} rate={rate} />
      </Card>
    </main>
  )
}

export default Emission;