import { Api } from '../../services';
import React from 'react';
import { useEffectOnce } from 'react-use';
import { drawChart } from './draw';
import { PageContainer } from '@ant-design/pro-components';

function formatData(data: any[]) {
  const nodes = data
    .map((node) => {
      return {
        id: String(node.id),
        data: {
          ...node,
          email: 'rking@yoyodyne.com',
          fax: '555-0145',
          name: node.name,
          phone: '555-0144',
          position: 'Chief Operating Officer',
          status: 'online',
        },
      };
    })
    .filter(Boolean);
  const edges = data
    .map((node) => {
      if (node.parentId === -1) {
        return null;
      }
      return {
        source: String(node.parentId),
        target: String(node.id),
      };
    })
    .filter(Boolean);
  return { nodes, edges };
}

const Welcome: React.FC = () => {
  const divRef = React.useRef<HTMLDivElement>(null);
  useEffectOnce(() => {
    if (divRef.current) {
      let instance: any = null;
      Api.queryMemberTree().then((data) => {
        console.log(data);
        instance = drawChart(divRef.current!, formatData(data));
      });
      return () => {
        instance?.destroy();
      };
    }
  });
  return (
    <PageContainer title={false} childrenContentStyle={{ padding: 0 }}>
      <div ref={divRef} style={{ width: '100%', height: '100vh' }}></div>
    </PageContainer>
  );
};

export default Welcome;
