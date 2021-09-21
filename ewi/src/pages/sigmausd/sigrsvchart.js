import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { createChart, CrosshairMode } from 'lightweight-charts';

import { API_ROOT } from "../../config";


function invertData(data) {
  return data.map(p => (
    {
      time: p.time,
      open: 1 / p.open,
      high: 1 / p.low,
      low: 1 / p.high,
      close: 1 / p.close,
    }
  ));
}


const SigRSVChart = ({ inverted }) => {
  const containerRef = useRef(0);
  const chartRef = useRef(0);
  const [chart, setChart] = useState(undefined);
  const seriesRef = useRef(null);
  const [seriesData, setSeriesData] = useState(undefined);

  // Switch between SigRSV/ERG (normal) and ERG/SigRSV (inverted)
  useEffect(() => {
    if (chart === undefined) return;

    if (inverted) {
      seriesRef.current.setData(invertData(seriesData));
      seriesRef.current.applyOptions({
        upColor: '#ef5350',
        borderUpColor: '#ef5350',
        wickUpColor: '#ef5350',
        downColor: '#26a69a',
        borderDownColor: '#26a69a',
        wickDownColor: '#26a69a',
        priceFormat: {
          precision: 0,
          minMove: 1,
        },
      });
      chart.applyOptions({
        priceFormat: {
          type: 'custom',
          minMove: 0.1,
          formatter: (price) => parseFloat(price).toFixed(1),
        },
        localization: {
          locale: 'en-US',
          priceFormatter: (price) => parseFloat(price).toFixed(1)
        },
      });
    } else {
      seriesRef.current.setData(seriesData);
      seriesRef.current.applyOptions({
        upColor: '#26a69a',
        borderUpColor: '#26a69a',
        wickUpColor: '#26a69a',
        downColor: '#ef5350',
        borderDownColor: '#ef5350',
        wickDownColor: '#ef5350',
        priceFormat: {
          precision: 6,
          minMove: 0.000001,
        },
      });
      chart.applyOptions({
        priceFormat: {
          type: 'custom',
          minMove: 0.00000001,
          formatter: (price) => parseFloat(price).toFixed(6),
        },
        localization: {
          locale: 'en-US',
          priceFormatter: (price) => parseFloat(price).toFixed(6)
        },
      });
    }

  }, [seriesData, chart, inverted]);

  useEffect(() => {
    const qry = API_ROOT + "/sigmausd/ohlc/sigrsv/1d";
    fetch(qry)
      .then(res => res.json())
      .then(res => setSeriesData(res))
      .catch(err => console.error(err));
  }, []);

  useLayoutEffect(() => {
    if (seriesData === undefined) return;

    const chart = createChart(chartRef.current, {
      width: 600,
      height: 300,
      layout: {
        backgroundColor: 'rgb(250 250 250)',
        textColor: '#131021',
      },
      rightPriceScale: {
        borderColor: 'gray',
      },
      timeScale: {
        borderColor: 'gray',
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      // priceFormat: {
      //   type: 'custom',
      //   minMove: 0.00000001,
      //   // precision: 8,
      //   formatter: (price) => parseFloat(price).toFixed(6),
      // },
      // priceScale: {
      //   autoScale: false
      // },
      // localization: {
      //   locale: 'en-US',
      //   priceFormatter: (price) => parseFloat(price).toFixed(6)
      // },
    });

    setChart(chart);

    const series = chart.addCandlestickSeries();
    series.setData(seriesData);

    // series.applyOptions({
    //   priceFormat: {
    //     precision: 6,
    //     minMove: 0.000001,
    //   },
    // });
    seriesRef.current = series;

    // chart.timeScale().fitContent();

    new ResizeObserver(entries => {
      if (entries.length === 0 || entries[0].target !== containerRef.current) {
        return;
      }
      const newRect = entries[0].contentRect;
      chart.applyOptions({ width: newRect.width - 10 });
    }).observe(containerRef.current);

  }, [seriesData]);

  return (
    <div ref={containerRef}>
      <div ref={chartRef}></div>
    </div>
  );
}

export default SigRSVChart;