import { Api } from '../../services';
import React, { useState } from 'react';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import { Chart } from '@antv/g2';

interface WelcomeProps {}

const Welcome: React.FC<WelcomeProps> = (props) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const chartRef = React.useRef<Chart>();

  useEffectOnce(() => {
    if (divRef.current) {
      chartRef.current = new Chart({
        container: divRef.current,
        autoFit: true,
        theme: 'classic',
      });

      chartRef.current
        .interval()
        .data([])
        .encode('x', 'generation')
        .encode('y', 'avgOffspringNum');

      chartRef.current.render();
    }
  });

  useUpdateEffect(() => {
    if (Array.isArray(props.data) && chartRef.current) {
      chartRef.current.changeData(props.data);
    }
  }, [props.data]);
  return <div ref={divRef} style={{ height: '100%' }}></div>;
};

export default Welcome;
