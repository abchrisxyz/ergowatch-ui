import { useState } from 'react';

import { series } from './softfork-series';

import UPlot from '../../components/uplot';
import colors from "../../config/colors";
import { Selector, SelectorOption } from '../../components/controls/selector';

function heightsToTimes(currentHeight, heights) {
  // Mainnet launch timestamp
  const t0 = Date.UTC(2019, 6, 1) / 1000;
  
  // Current timestamp
  const now = Date.now() / 1000;

  // Mean timestamp delta between consecutive blocks (2 minutes)
  const interval = 120

  return heights.map((h) => h < currentHeight
    ? t0 + h / currentHeight * (now - t0)
    : now + (h - currentHeight) * interval
  );
}


const EmissionChart = ({ currentHeight, data, useTimeScale }) => {
  if (!data) return "";

  const localData = [
    useTimeScale ? heightsToTimes(currentHeight, data[0]) : data[0],
    data[1],
    data[2],
    data[3],
    data[4],
  ];

  const options = {
    width: 0, // will be set by UPlot
    height: 400,
    scales: {
      x: {
        time: useTimeScale,
      },
      y: {
        // distr: logScale ? 3 : 1,
      },
    },
    axes: [
      {
        scale: 'x',
      },
      {
        label: "Circulating Supply",
        size: 90,
        // labelFont: "bold 14px Arial",
        labelFont: "14px Arial",
        labelSize: 20,
        // values: (u, vals) => vals.map(v => v !== null ? Number(v.toFixed(0)).toLocaleString('en') : ''),
      },
      {
        label: "Emission Rate",
        side: 1,
        scale: "rate",
        // values: (u, vals) => vals.map(v => "$" + v.toFixed(2)),
        grid: { show: false },
        stroke: "rgba(122, 122, 122, 0.8)",
        ticks: { show: false },
        labelFont: "14px Arial",
        labelSize: 20,
      },
    ],
    series: [
      {label: useTimeScale ? 'Date' : 'Height'},
      {
        label: 'Original Circ. Supply',
        stroke: colors.black,
        width: 1,

      },
      {
        label: 'Original Rate',
        stroke: "rgba(122, 122, 122, 0.6)",
        width: 1,
        scale: "rate",
      },
      {
        label: 'Proposed Circ. Supply',
        stroke: colors.orange,
        width: 1,

      },
      {
        label: 'Re-emission contract',
        stroke: colors.blue,
        width: 1,
      },
    ]
  };

  return (
    <div className="chart">
      {<UPlot options={options} data={localData} />}
    </div>
  );
}


const SoftFork = ({currentHeight}) => {
  // 'height' or 'time'
  const [xScale, setXScale] = useState('height')
 
  return (
    <div>
      <div className="chart-options">
      <Selector>
        <SelectorOption label='Network Height' active={xScale === 'height'} onClick={() => setXScale('height')} />
        <SelectorOption label='Date (approx.)' active={xScale === 'time'} onClick={() => setXScale('time')} />
      </Selector>
      </div>
      <EmissionChart currentHeight={currentHeight} data={series} useTimeScale={xScale === 'time'} />
    </div>
  )
}

export default SoftFork;