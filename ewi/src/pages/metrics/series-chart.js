import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component"

import UPlot from "../../components/uplot";
import { API_ROOT } from "../../config";

import './series-chart.css';

const SeriesChart = ({ api, seriesOptions, initialOptions }) => {
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

  const filteredData = [
    data.timestamps,
    ...selectedOpts.map((opt) => data[opt.value]),
    data.ergusd,
  ]

  const filteredSeries = selectedOpts.map((opt) => {
    return {
      label: opt.label,
      stroke: opt.color,
      width: 1,
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
      {},
      {
        size: 80,
      },
      {
        side: 1,
        scale: "$",
        values: (u, vals) => vals.map(v => "$" + v.toFixed(2)),
        grid: { show: false },
        stroke: "rgba(122, 122, 122, 0.8)",
        ticks: { show: false },
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
    <div className="chart">
      <div className="chart-options">
        <ul className="selector">
          <li className={window === '30d' ? 'active' : null} onClick={() => setWindow('30d')}>1m</li>
          <li className={window === '90d' ? 'active' : null} onClick={() => setWindow('90d')}>3m</li>
          <li className={window === '1y' ? 'active' : null} onClick={() => setWindow('1y')}>1y</li>
          <li className={window === 'all' ? 'active' : null} onClick={() => setWindow('all')}>all</li>
        </ul>
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
        <ul className="selector">
          <li className={logScale ? null : 'active'} onClick={() => setLogScale(false)}>Linear</li>
          <li className={logScale ? 'active' : null} onClick={() => setLogScale(true)}>Log</li>
        </ul>
      </div>
      {<UPlot options={options} data={filteredData} />}
    </div>
  );
}

export default SeriesChart;