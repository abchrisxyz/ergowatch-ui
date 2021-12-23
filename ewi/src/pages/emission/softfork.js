import { series } from './softfork-series';

import UPlot from '../../components/uplot';
import colors from "../../config/colors";

const EmissionChart = ({ currentHeight, data }) => {
  if (!data) return "";

  const options = {
    width: 0, // will be set by UPlot
    height: 400,
    scales: {
      x: {
        time: false,
      },
      y: {
        // distr: logScale ? 3 : 1,
      },
    },
    axes: [
      {
        scale: 'x'
      },
      {
        label: "Circulating Supply",
        size: 80,
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
      {label: 'Height'},
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
      {<UPlot options={options} data={data} />}
    </div>
  );
}


const SoftFork = ({currentHeight}) => {
 
  return (
    <div>
      <EmissionChart currentHeight={currentHeight} data={series} />
    </div>
  )
}

export default SoftFork;