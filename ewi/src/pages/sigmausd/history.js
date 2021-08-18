import { useState, useEffect, useLayoutEffect, useRef } from "react";
import uPlot from "uplot";
import 'uplot/dist/uPlot.min.css';

import { API_ROOT } from "../../config";
import './history.css';

function generateTicks(lo, hi, maxTicks = 4) {
  if (lo === hi) {
    console.log(lo, hi)
    return lo < 0 ? [lo, 0] : [0, hi];
  }
  const normalizedCandidates = [1, 2, 5, 10, 20, 100]
  const interval = hi - lo;
  const power = Math.floor(Math.log10(interval)) - 1;
  const order = 10 ** power;
  let step, firstTick, nTicks;
  normalizedCandidates.every(nc => {
    step = nc * order;
    firstTick = Math.ceil(lo / step) * step;
    const lastTick = Math.floor(hi / step) * step;
    nTicks = Math.round((lastTick - firstTick) / step);
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
    (v) => (v * 10 ** (-6)).toFixed(3) + "M", // Liabs
    (v) => (v * 10 ** (-6)).toFixed(2) + "M", // Circ. SigUSD
    (v) => v.toFixed(6), // RSV price
    (v) => (v * 10 ** (-6)).toFixed(3) + "M", // Equity
    (v) => (v * 10 ** (-6)).toFixed(0) + "M", // Circ. SigRSV
    (v) => (v).toFixed(0) + "%", // RR
    (v) => (v * 10 ** (-6)).toFixed(2) + "M", // Reserves
  ];

  const legendFormatters = [
    (v) => "$" + v.toFixed(2), // Oracle price
    (v) => Number(v.toFixed(0)).toLocaleString('en') + " ERG", // Liabs
    (v) => Number(v.toFixed(0)).toLocaleString('en'), // Circ. SigUSD
    (v) => v.toFixed(6), // RSV price
    (v) => Number(v.toFixed(0)).toLocaleString('en') + " ERG", // Equity
    (v) => Number(v.toFixed(0)).toLocaleString('en'), // Circ. SigRSV
    (v) => Number(v.toFixed(0)).toLocaleString('en') + "%", // RR
    (v) => Number(v.toFixed(0)).toLocaleString('en') + " ERG", // Reserves
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
    const d = ss.lo === ss.hi ? ss.hi : ss.hi - ss.lo;
    const f = inc / d
    const h = inc + space;
    console.log(d, f, h)
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


const UPlot = ({ options, data, width }) => {
  const divRef = useRef(null);
  const plotRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(500);

  useEffect(() => {
    // console.log('create')
    plotRef.current = new uPlot(Object.assign(options, { width: chartWidth }), data, divRef.current);

    return () => {
      // console.log('destroy')
      plotRef.current.destroy();
      plotRef.current = null;
    };
  }, [options, data, chartWidth]);

  useLayoutEffect(() => {
    if (divRef.current != null) {
      // console.log('observer')
      new ResizeObserver(entries => {
        if (entries.length === 0 || entries[0].target !== divRef.current) {
          return;
        }
        const newRect = entries[0].contentRect;
        setChartWidth(newRect.width - 25);
      }).observe(divRef.current);
    }
  }, []);

  return <div ref={divRef}></div>;
}


const HistoryChart = ({ window }) => {
  const [options, setOptions] = useState(undefined);
  const [data, setData] = useState(undefined);

  useEffect(() => {
    setData(undefined);
    const qry = API_ROOT + `/sigmausd/history/${window}`;
    fetch(qry)
      .then(res => res.json())
      .then(res => {
        const liabs = res.circ_sigusd.map((c, i) => c / res.oracle_prices[i]);
        const equity = res.reserves.map((r, i) => r - liabs[i]);
        const rsv_price = res.circ_sigrsv.map((c, i) => equity[i] / c);
        const rr = equity.map((e, i) => liabs[i] > 0 ? e / liabs[i] * 100 + 100 : res.reserves[i] * 100 / res.oracle_prices[i]);
        const series = [
          res.timestamps,
          res.oracle_prices,
          liabs,
          res.circ_sigusd,
          rsv_price,
          equity,
          res.circ_sigrsv,
          rr,
          res.reserves,
        ];
        const shifted = generateShiftConfig(series);
        const options = {
          width: 0, // will be set by UPlot
          height: 600,
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
              stroke: "rgb(42, 45, 52)",
              width: 1,
              fillTo: shifted.fillTo,
              value: shifted.value,
            },
            {
              label: 'Liabilities',
              // stroke: "rgb(249, 65, 68)",
              // fill: "rgba(249, 65, 68, 0.3)",
              stroke: "rgba(47, 94, 246, 0.8)",
              fill: "rgba(47, 94, 246, 0.5)",
              width: 1,
              fillTo: shifted.fillTo,
              value: shifted.value,
            },
            {
              label: 'Circ. SigUSD',
              stroke: "rgba(47, 94, 246, 0.8)",
              fill: "rgba(47, 94, 246, 0.5)",
              width: 1,
              fillTo: shifted.fillTo,
              value: shifted.value,
            },
            {
              label: 'SigRSV price',
              stroke: "rgb(42, 45, 52)",
              width: 1,
              markers: { show: false },
              fillTo: shifted.fillTo,
              value: shifted.value,
            },
            {
              label: 'Equity',
              stroke: "rgba(2, 167, 114, 0.8)",
              fill: "rgba(11, 252, 174, 0.5)",
              width: 1,
              fillTo: shifted.fillTo,
              value: shifted.value,
            },
            {
              label: 'Circ. SigRSV',
              stroke: "rgba(2, 167, 114, 0.8)",
              fill: "rgba(11, 252, 174, 0.5)",
              width: 1,
              fillTo: shifted.fillTo,
              value: shifted.value,
            },
            {
              label: 'RR',
              stroke: "rgb(42, 45, 52)",
              fill: "rgba(42, 45, 52, 0.3)",
              width: 1,
              fillTo: shifted.fillTo,
              value: shifted.value,
            },
            {
              label: 'Reserves',
              stroke: "rgb(42, 45, 52)",
              fill: "rgba(42, 45, 52, 0.3)",
              width: 1,
              fillTo: shifted.fillTo,
              value: shifted.value,
            },
          ]
        };
        console.log(res)
        const data = shifted.transformData(series);
        setOptions(options);
        setData(data);
      })
      .catch(err => console.error(err));
  }, [window]);

  if (data === undefined) return <div style={{ height: "610px" }}>Loading...</div>;

  return (
    <div>
      <YLabels labels={['Reserves', 'RR', 'Circ. RSV', 'Equity', 'RSV Price', 'Circ. USD', 'Liabilities', 'Oracle']} />
      <UPlot options={options} data={data} />
    </div>
  );
}


const YLabels = ({ labels }) => {
  return (
    <div className="ylabels">
      {/* {labels.map((lbl, i) => <div key={lbl} style={{ right: (i - 7) * 60 - 10 + 'px', top: 50 + i * 67 + 'px' }}>{lbl}</div>)} */}
      {/* {labels.map((lbl, i) => <div key={lbl} style={{ right: (i - 7) * 10 + 10 + 'px', top: 50 + i * 67 + 'px' }}>{lbl}</div>)} */}
      {labels.map((lbl, i) => <div key={lbl} style={{ right: (i - 7) * 10 + 35 + 'px', top: 40 + i * 67 + 'px' }}>{lbl}</div>)}

    </div>
  )
}


const History = () => {
  const [window, setWindow] = useState('1d');
  return (
    <div className="history">
      <ul className="window-selector">
        <li className={window === '1d' ? 'active' : null} onClick={() => setWindow('1d')}>1d</li>
        <li className={window === '5d' ? 'active' : null} onClick={() => setWindow('5d')}>5d</li>
        <li className={window === '30d' ? 'active' : null} onClick={() => setWindow('30d')}>30d</li>
        <li className={window === '90d' ? 'active' : null} onClick={() => setWindow('90d')}>90d</li>
        <li className={window === 'all' ? 'active' : null} onClick={() => setWindow('all')}>all</li>
      </ul>
      <HistoryChart window={window} />
    </div>
  );
}


export default History;