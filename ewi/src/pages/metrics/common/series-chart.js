import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component"

import UPlot from "../../../components/uplot";
import { Selector, SelectorOption } from "../../../components/controls/selector";
import { API_ROOT } from "../../../config";

import './series-chart.css';


const SeriesChart = ({ id, api, seriesOptions, initialOptions, toFixed = 0, relative = false, relativeTo = null, setRelative, yLabel = null, ySize = 80, units = '', markLast }) => {
  // relative: scales values to data[relativeTo]
  // markLast: color of last datapoint
  const [window, setWindow] = useState('30d');
  const [logScale, setLogScale] = useState(false);
  const [data, setData] = useState(undefined);

  const [selectedOpts, setSelectedOpts] = useState(
    initialOptions.map((i) => seriesOptions[i])
  );

  function sortAndSetSelectedOpts(opts) {
    setSelectedOpts(opts.sort((a, b) => {
      return a.index - b.index;
    }));
  }

  useEffect(() => {
    setData(undefined);
    const qry = API_ROOT + `${api}/${window}`;
    fetch(qry)
      .then(res => res.json())
      .then(res => setData(res))
      .catch(err => console.error(err));
  }, [api, window]);

  if (data === undefined) return <div style={{ height: "610px" }}>Loading...</div>;

  const filteredData = relative && relativeTo ? [
    data.timestamps,
    ...selectedOpts.map((opt) => data[opt.value].map((v, i) => v / data[relativeTo][i] * 100)),
    data.ergusd,
  ] : [
    data.timestamps,
    ...selectedOpts.map((opt) => data[opt.value]),
    data.ergusd,
  ]

  let can = document.createElement("canvas");
  let ctx = can.getContext("2d");

  function makeMarkLastGradient(u, baseColor, lastColor) {
    const t0 = data.timestamps[0];
    const t1 = data.timestamps.at(-1);
    const t = data.timestamps.at(-2);
    const scaleKey = 'x';
    const x0 = u.valToPos(t0, scaleKey, true);
    const x1 = u.valToPos(t1, scaleKey, true);
    const [y0, y1] = [0, 0];
    if (!x0 || !x1) return baseColor;
    let grd = ctx.createLinearGradient(x0, y0, x1, y1);
    grd.addColorStop((t - t0) / (t1 - t0), baseColor);
    grd.addColorStop(1, lastColor);
    return grd;
  }

  const filteredSeries = selectedOpts.map((opt) => {
    const decimals = opt.toFixed ? opt.toFixed : toFixed;
    const stroke = !markLast ? opt.color : (u) => makeMarkLastGradient(u, opt.color, markLast);
    return {
      label: opt.label,
      stroke: stroke,
      width: 1,
      value: (u, val) => val !== null ? Number(val.toFixed(decimals)).toLocaleString('en') + units : 'N/A',
    }
  });

  const options = {
    width: 0, // will be set by UPlot
    height: 400,
    scales: {
      x: {
        time: true,
      },
      y: {
        distr: logScale ? 3 : 1,
      },
    },
    axes: [
      {
        scale: 'x'
      },
      {
        label: yLabel,
        size: ySize,
        // labelFont: "bold 14px Arial",
        labelFont: "14px Arial",
        labelSize: 20,
        values: (u, vals) => vals.map(v => v !== null ? Number(v.toFixed(toFixed)).toLocaleString('en') + units : ''),
      },
      {
        label: "ERG / USD",
        side: 1,
        scale: "$",
        values: (u, vals) => vals.map(v => "$" + v.toFixed(2)),
        grid: { show: false },
        stroke: "rgba(122, 122, 122, 0.8)",
        ticks: { show: false },
        labelFont: "14px Arial",
        labelSize: 20,
      },
    ],
    series: [
      {},
      ...filteredSeries,
      {
        label: 'ERG/USD',
        stroke: "rgba(122, 122, 122, 0.6)",
        width: 1,
        scale: "$",
      },
    ]
  };

  return (
    <div id={`${id}-chart`} className="chart">
      <div className="chart-options">
        <Selector>
          <SelectorOption label='1m' active={window === '30d'} onClick={() => setWindow('30d')} />
          <SelectorOption label='3m' active={window === '90d'} onClick={() => setWindow('90d')} />
          <SelectorOption label='1y' active={window === '1y'} onClick={() => setWindow('1y')} />
          <SelectorOption label='all' active={window === 'all'} onClick={() => setWindow('all')} />
        </Selector>
        {seriesOptions.length < 2 ? null :
          <MultiSelect
            className="series-select"
            options={seriesOptions}
            value={selectedOpts}
            onChange={sortAndSetSelectedOpts}
            // labelledBy="Select"
            hasSelectAll={false}
            disableSearch={true}
            ClearIcon=''
          />
        }
        {!relativeTo ? null :
          <Selector>
            <SelectorOption label='Absolute' active={!relative} onClick={() => setRelative(false)} />
            <SelectorOption label='Relative' active={relative} onClick={() => setRelative(true)} />
          </Selector>
        }
        <Selector>
          <SelectorOption label='Linear' active={!logScale} onClick={() => setLogScale(false)} />
          <SelectorOption label='Log' active={logScale} onClick={() => setLogScale(true)} />
        </Selector>
      </div>
      {<UPlot options={options} data={filteredData} />}
    </div>
  );
}

export default SeriesChart;