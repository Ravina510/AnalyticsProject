import React, { useEffect, useRef } from 'react';
// import Chart from 'chart.js';
import Chart from 'chart.js/auto'
const StepChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartOptions = {
      responsive: true,
      scales: {
        x: {
          type: 'linear',
          display: true,
          position: 'bottom',
        },
        y: {
          display: true,
          ticks: {
            max: 1,
            min: 0,
            stepSize: 1,
            callback: (value) => (value === 1 ? 'On' : 'Off'),
          },
        },
      },
    };

    const chartData = {
      labels: ['A', 'B', 'C', 'D', 'E'],
      datasets: [
        {
          label: 'Step Chart',
          data: [0, 1, 1, 0, 1],
          borderColor: 'blue',
          backgroundColor: 'transparent',
          tension: 0.5,
          stepped: 'before',
        },
      ],
    };

    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });
  }, []);

  return <canvas ref={chartRef} />;
};

export default StepChart;
