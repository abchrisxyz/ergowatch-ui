/* Responsive container around uPlot element */
import { useState, useRef, useEffect, useLayoutEffect } from "react";

import uPlot from "uplot";
import 'uplot/dist/uPlot.min.css';

const UPlot = ({ options, data }) => {
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

export default UPlot;