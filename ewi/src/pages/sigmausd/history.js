import { useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import uPlot from "uplot";
import 'uplot/dist/uPlot.min.css';

import { API_ROOT } from "../../config";
import './history.css';

function generateTicks(lo, hi, maxTicks = 5) {
  const normalizedCandidates = [1, 2, 5, 10, 20, 100]
  const interval = hi - lo;
  const power = Math.floor(Math.log10(interval)) - 1;
  const order = 10 ** power;
  let step, firstTick, nTicks;
  normalizedCandidates.every(nc => {
    step = nc * order;
    firstTick = Math.ceil(lo / step) * step;
    const lastTick = Math.floor(hi / step) * step;
    nTicks = ((lastTick - firstTick) / step);
    return nTicks > maxTicks;
  });
  return [...Array(nTicks + 1).keys()].map(i => firstTick + i * step);
}


function generateShiftConfig(series) {
  if (series === undefined) return undefined;

  /* number of shifted charts */
  const nbOfCharts = series.length - 1;
  /* chart height of each series (in y-axis units) */
  const inc = 10;
  /* spacing between each series (in y-axis units) */
  const space = 2;
  /* chart range (in y-axis units) - add 0.1 to distinguish top chart max */
  const range = [0, 0.1 + nbOfCharts * inc + (nbOfCharts - 1) * space];

  const tickFormatters = [
    (v) => "$" + v.toFixed(2), // Oracle price
    (v) => (v * 10 ** (-6)).toFixed(0) + "M", // Circ. SigUSD
    (v) => (v * 10 ** (-6)).toFixed(0) + "M", // Circ. SigRSV
    (v) => (v * 10 ** (-6)).toFixed(2) + "M", // Reserves
  ];

  const legendFormatters = [
    (v) => "$" + v.toFixed(2), // Oracle price
    (v) => Number(v.toFixed(0)).toLocaleString('en'), // Circ. SigUSD
    (v) => v,//Number(v.toFixed(0)).toLocaleString('en'), // Circ. SigRSV
    (v) => Number(v.toFixed(0)).toLocaleString('en'), // Reserves
  ];

  const fillTo = (u, seriesIdx) => inc * (seriesIdx - 1) + space * (seriesIdx - 1);

  // min max of each series (skipping first series with x-axis values)
  const stats = series.slice(1).map(s => Object({
    lo: Math.min(...s),
    hi: Math.max(...s),
  }));

  // For each series, custom mappers to convert
  // values to and from y coordinates
  const mappers = stats.map((ss, idx) => {
    const d = ss.hi - ss.lo;
    const f = inc / d
    const h = inc + space;
    return {
      to: (v) => (v - ss.lo) * f + h * idx,
      from: (v) => ss.lo + (v - h * idx) / f,
    };
  });

  // min and max y coordinates for each series
  // needed to retrieve series index from y-coordinate
  const bounds = stats.map((ss, idx) => {
    return { lo: mappers[idx].to(ss.lo), hi: mappers[idx].to(ss.hi) }
  });

  // maps y-axis tick coordinates to series value
  const values = (u, splits) => {
    return splits.map(v => {
      // Derive series index from bounds
      let n;
      bounds.every((bnds, idx) => {
        n = idx;
        return v > bnds.hi;
      })

      return tickFormatters[n](mappers[n].from(v))
    });
  }

  // maps y-axis coordinates to legend value
  const value = (u, v, seriesIdx) => {
    const n = seriesIdx - 1;
    return legendFormatters[n](mappers[n].from(v));
  };

  // transforms data to y-axis coordinates
  const transformData = (data) => data.map((vals, seriesIdx) => {
    return seriesIdx === 0
      ? vals
      : vals.map(v => mappers[seriesIdx - 1].to(v))
  });

  // y-axis ticks, series specific
  const splits = () => stats.reduce((acc, ss, idx) => [
    ...acc,
    ...generateTicks(ss.lo, ss.hi).map(v => mappers[idx].to(v))
  ], []);

  return { range, values, value, splits, fillTo, transformData };
}


const HistoryChart = ({ window }) => {
  const divRef = useRef(null);
  const plotRef = useRef(null);
  const [series, setSeries] = useState(undefined);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const qry = API_ROOT + `/sigmausd/history/${window}`;
    console.log('qry', window)
    fetch(qry)
      .then(res => res.json())
      .then(res => {
        setSeries([res.timestamps, res.oracle_prices, res.circ_sigusd, res.circ_sigrsv, res.reserves]);
      })
      .catch(err => console.error(err));
  }, [window]);

  useLayoutEffect(() => {
    if (series === undefined) return;
    console.log('observer')
    new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== divRef.current) {
        return;
      }
      const newRect = entries[0].contentRect;
      setChartWidth(newRect.width - 5);
    }).observe(divRef.current);
  }, [series]);

  const shifted = useMemo(() => generateShiftConfig(series), [series]);

  if (series === undefined) return "Loading...";

  const options = {
    width: chartWidth,
    height: 400,
    scales: {
      x: {
        time: true,
      },
      y: {
        range: shifted.range,
      },
    },
    axes: [
      {},
      {
        size: 70,
        values: shifted.values,
        splits: shifted.splits,
      }
    ],
    series: [
      {},
      {
        label: 'Oracle Price',
        stroke: "gray",
        width: 1,
        fillTo: shifted.fillTo,
        value: shifted.value,
      },
      {
        label: 'Circ. SigUSD',
        stroke: "red",
        width: 1,
        fill: "rgba(255, 0, 0, 0.3)",
        fillTo: shifted.fillTo,
        value: shifted.value,
      },
      {
        label: 'Circ. SigRSV',
        stroke: "green",
        width: 1,
        fill: "rgba(0, 255, 0, 0.3)",
        fillTo: shifted.fillTo,
        value: shifted.value,
      },
      {
        label: 'Reserves',
        stroke: "blue",
        width: 1,
        fill: "rgba(0, 0, 255, 0.3)",
        fillTo: shifted.fillTo,
        value: shifted.value,
      },
    ]
  }

  if (plotRef.current != null) {
    console.log('destroy')
    plotRef.current.destroy();
    plotRef.current = null;
  }
  plotRef.current = new uPlot(options, shifted.transformData(series), divRef.current);

  return (
    <div ref={divRef}>
    </div>
  );
}

const History = () => {
  const [window, setWindow] = useState('5d');
  return (
    <div className="history">
      <ul className="window-selector">
        {/* <li className={window === '1d' ? 'active' : null}>1d</li> */}
        <li className={window === '5d' ? 'active' : null} onClick={() => setWindow('5d')}>5d</li>
        <li className={window === '30d' ? 'active' : null} onClick={() => setWindow('30d')}>30d</li>
        {/* <li className={window === 'all' ? 'active' : null}>all</li> */}
      </ul>
      <HistoryChart window={window} />
    </div>
  );
}


export default History;