import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { Chart } from '@antv/g2';

interface ColumnChartProps {
  data: any;
}

export const ColumnChart = React.forwardRef<
  { graph?: Chart },
  ColumnChartProps
>((props, ref) => {
  const container = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart>();

  useImperativeHandle(ref, () => {
    return {
      graph: chartInstance,
    };
  });

  useEffectOnce(() => {
    if (!container.current) return;

    const chart = new Chart({
      container: container.current,
      autoFit: true,
      theme: 'classic',
    });

    setChartInstance(chart);
    chart
      .interval()
      .data([])
      .encode('x', 'generation')
      .encode('y', 'avgOffspringNum')
      .axis('x', { title: '世代' })
      .axis('y', { title: '平均后代' });

    chart.render();

    return () => {
      chart.destroy();
    };
  });

  useEffect(() => {
    if (props.data && chartInstance) {
      chartInstance.changeData(props.data);
    }
  }, [props.data, chartInstance]);

  return <div ref={container} style={{ height: 500 }}></div>;
});

export default ColumnChart;
