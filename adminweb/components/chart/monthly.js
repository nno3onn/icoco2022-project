import React from 'react';
import { Bar, defaults } from 'react-chartjs-2';

require('./roundedBar');

const arbitraryStackKey = 'stack1';
defaults.global.defaultFontFamily = 'Poppins';
defaults.global.defaultFontColor = '#6C687D';
defaults.global.defaultFontSize = 10;

const MonthlyChart = ({ chartData }) => {
  const options = {
    responsive: true,
    scales: {
      xAxes: [
        {
          stacked: true,
          gridLines: { display: false },
        },
      ],
      yAxes: [
        {
          stacked: false,
          ticks: {
            beginAtZero: true,
            stepSize: 10,
            max: 40,
            min: 0,
          },
          gridLines: { color: '#F5F4F7', zeroLineColor: '#ECEBF0' },
        },
      ],
      dataset: { maxBarThickness: 16 },
    },
    animation: {
      duration: 1330,
    },
    legend: {
      display: false,
    },
    cornerRadius: 8,
    maintainAspectRatio: false,
  };

  const data = {
    labels: chartData.map((v, i) => {
      if (i < 10) return `0${i}`;
      return i;
    }),
    datasets: [
      {
        stack: arbitraryStackKey,
        label: '월간 예약 통계',
        backgroundColor: '#9C8AE6',
        data: chartData.map((v) => v),
      },
    ],
  };

  return (
    <div style={{ height: '220px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyChart;
