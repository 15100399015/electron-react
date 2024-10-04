import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useEffectOnce, useUpdate } from 'react-use';
import { Chart } from '@antv/g2';

interface ColumnChartProps {
  data: API.ResponseBody.queryPinboardData['generationGroup'];
}

export const ColumnChart = React.forwardRef<
  { graph?: Chart },
  ColumnChartProps
>((props, ref) => {
  const container = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Chart>();
  const updater = useUpdate();

  useImperativeHandle(ref, () => {
    return {
      graph: chartInstance.current,
    };
  });

  useEffectOnce(() => {
    if (!container.current) return;

    const chart = new Chart({
      container: container.current,
      autoFit: true,
      theme: 'classic',
    });
    chartInstance.current = chart;
    updater();
    chart.data([]);
    chart
      .interval()
      .encode('x', 'generation')
      .encode('y', 'avgOffspringNum')
      .axis('x', {
        title: '世代',
        labelFormatter: (text: number) => `第${text}代`,
      })
      .axis('y', {
        title: '平均后代',
        labelFormatter: (text: number) => `${text}个`,
      })
      .label([
        {
          text: 'avgOffspringNum',
          fill: '#ffffff',
          fontWeight: 600,
          dy: 5,
          formatter: (text: number) => `平均${text}个`,
        },
      ])
      .tooltip(false);

    chart
      .lineY()
      .transform({ type: 'groupX', y: 'mean' })
      .encode('y', 'avgOffspringNum')
      .style('stroke', '#F4664A')
      .style('strokeOpacity', 1)
      .style('lineWidth', 2)
      .style('lineDash', [3, 3]);

    chart.render();

    return () => {
      chart.destroy();
    };
  });

  useEffect(() => {
    if (props.data && chartInstance.current) {
      chartInstance.current.changeData(props.data);
    }
  }, [props.data, chartInstance]);

  return <div ref={container} style={{ height: 500 }}></div>;
});

export default ColumnChart;
