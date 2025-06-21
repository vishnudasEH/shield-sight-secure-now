
import { darkTheme } from '@/theme/darkTheme';

// ApexCharts dark theme configuration
export const apexChartsConfig = {
  theme: {
    mode: 'dark' as const,
    palette: 'palette4',
  },
  chart: {
    background: 'transparent',
    foreColor: '#ffffff',
    fontFamily: 'Inter, sans-serif',
    toolbar: {
      theme: 'dark' as const,
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
    },
  },
  grid: {
    borderColor: '#333333',
    strokeDashArray: 3,
  },
  xaxis: {
    labels: {
      style: {
        colors: '#b0b0b0',
      },
    },
    axisBorder: {
      color: '#333333',
    },
    axisTicks: {
      color: '#333333',
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#b0b0b0',
      },
    },
  },
  tooltip: {
    theme: 'dark' as const,
    style: {
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif',
    },
  },
  legend: {
    labels: {
      colors: '#ffffff',
    },
  },
  colors: [
    '#4e73df',
    '#6f42c1', 
    '#1cc88a',
    '#f6c23e',
    '#e74a3b',
    '#36b9cc',
    '#fd7e14',
    '#20c997',
    '#6f42c1',
    '#17a2b8'
  ],
};

// ECharts dark theme configuration
export const echartsConfig = {
  backgroundColor: 'transparent',
  textStyle: {
    color: '#ffffff',
    fontFamily: 'Inter, sans-serif',
  },
  grid: {
    borderColor: '#333333',
    backgroundColor: 'transparent',
  },
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: '#333333',
      },
    },
    axisTick: {
      lineStyle: {
        color: '#333333',
      },
    },
    axisLabel: {
      textStyle: {
        color: '#b0b0b0',
      },
    },
    splitLine: {
      lineStyle: {
        color: '#333333',
        type: 'dashed',
      },
    },
  },
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: '#333333',
      },
    },
    axisTick: {
      lineStyle: {
        color: '#333333',
      },
    },
    axisLabel: {
      textStyle: {
        color: '#b0b0b0',
      },
    },
    splitLine: {
      lineStyle: {
        color: '#333333',
        type: 'dashed',
      },
    },
  },
  timeline: {
    lineStyle: {
      color: '#333333',
    },
    itemStyle: {
      color: '#4e73df',
    },
    controlStyle: {
      color: '#4e73df',
    },
    label: {
      textStyle: {
        color: '#b0b0b0',
      },
    },
  },
  toolbox: {
    iconStyle: {
      borderColor: '#b0b0b0',
    },
  },
  tooltip: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderColor: '#4e73df',
    textStyle: {
      color: '#ffffff',
    },
  },
  legend: {
    textStyle: {
      color: '#ffffff',
    },
  },
  color: [
    '#4e73df',
    '#6f42c1',
    '#1cc88a', 
    '#f6c23e',
    '#e74a3b',
    '#36b9cc',
    '#fd7e14',
    '#20c997',
    '#6f42c1',
    '#17a2b8'
  ],
};

// Highcharts dark theme configuration
export const highchartsConfig = {
  chart: {
    backgroundColor: 'transparent',
    style: {
      fontFamily: 'Inter, sans-serif',
    },
    plotBorderColor: '#333333',
  },
  title: {
    style: {
      color: '#ffffff',
      fontSize: '16px',
    },
  },
  subtitle: {
    style: {
      color: '#b0b0b0',
    },
  },
  xAxis: {
    gridLineColor: '#333333',
    labels: {
      style: {
        color: '#b0b0b0',
      },
    },
    lineColor: '#333333',
    minorGridLineColor: '#333333',
    tickColor: '#333333',
    title: {
      style: {
        color: '#b0b0b0',
      },
    },
  },
  yAxis: {
    gridLineColor: '#333333',
    labels: {
      style: {
        color: '#b0b0b0',
      },
    },
    lineColor: '#333333',
    minorGridLineColor: '#333333',
    tickColor: '#333333',
    title: {
      style: {
        color: '#b0b0b0',
      },
    },
  },
  tooltip: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderColor: '#4e73df',
    style: {
      color: '#ffffff',
    },
  },
  legend: {
    itemStyle: {
      color: '#ffffff',
    },
    itemHoverStyle: {
      color: '#4e73df',
    },
    itemHiddenStyle: {
      color: '#666666',
    },
  },
  credits: {
    style: {
      color: '#666666',
    },
  },
  labels: {
    style: {
      color: '#b0b0b0',
    },
  },
  drilldown: {
    activeAxisLabelStyle: {
      color: '#4e73df',
    },
    activeDataLabelStyle: {
      color: '#4e73df',
    },
  },
  navigation: {
    buttonOptions: {
      symbolStroke: '#b0b0b0',
      theme: {
        fill: '#333333',
      },
    },
  },
  rangeSelector: {
    buttonTheme: {
      fill: '#333333',
      stroke: '#666666',
      style: {
        color: '#b0b0b0',
      },
      states: {
        hover: {
          fill: '#4e73df',
          stroke: '#4e73df',
          style: {
            color: '#ffffff',
          },
        },
        select: {
          fill: '#4e73df',
          stroke: '#4e73df',
          style: {
            color: '#ffffff',
          },
        },
      },
    },
    inputBoxBorderColor: '#333333',
    inputStyle: {
      backgroundColor: '#1e1e1e',
      color: '#ffffff',
    },
    labelStyle: {
      color: '#b0b0b0',
    },
  },
  navigator: {
    handles: {
      backgroundColor: '#333333',
      borderColor: '#666666',
    },
    outlineColor: '#666666',
    maskFill: 'rgba(30, 30, 30, 0.3)',
    series: {
      color: '#4e73df',
      lineColor: '#4e73df',
    },
    xAxis: {
      gridLineColor: '#333333',
    },
  },
  scrollbar: {
    barBackgroundColor: '#333333',
    barBorderColor: '#333333',
    buttonArrowColor: '#b0b0b0',
    buttonBackgroundColor: '#333333',
    buttonBorderColor: '#333333',
    rifleColor: '#b0b0b0',
    trackBackgroundColor: '#1e1e1e',
    trackBorderColor: '#333333',
  },
  colors: [
    '#4e73df',
    '#6f42c1',
    '#1cc88a',
    '#f6c23e', 
    '#e74a3b',
    '#36b9cc',
    '#fd7e14',
    '#20c997',
    '#6f42c1',
    '#17a2b8'
  ],
};

// Vulnerability severity colors for charts
export const severityColors = {
  Critical: '#e74a3b',
  High: '#fd7e14',
  Medium: '#f6c23e',
  Low: '#36b9cc',
  Info: '#6c757d',
};

// Gradient definitions for enhanced visuals
export const chartGradients = {
  blue: 'linear-gradient(135deg, #4e73df 0%, #6f42c1 100%)',
  purple: 'linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)',
  success: 'linear-gradient(135deg, #1cc88a 0%, #36b9cc 100%)',
  warning: 'linear-gradient(135deg, #f6c23e 0%, #fd7e14 100%)',
  danger: 'linear-gradient(135deg, #e74a3b 0%, #dc3545 100%)',
  info: 'linear-gradient(135deg, #36b9cc 0%, #1cc88a 100%)',
};
