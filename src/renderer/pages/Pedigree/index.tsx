import { Api } from '../../services';
import React, { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { drawChart } from './draw';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Divider, List, Statistic, Typography } from 'antd';
import RcResizeObserver from 'rc-resize-observer';

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
        instance = drawChart(divRef.current!, formatData(data));
      });
      return () => {
        instance?.destroy();
      };
    }
  });

  const [data, setData] = useState({});

  useEffectOnce(() => {
    window.bridge.request('/member/dataScreen', {}).then((data) => {
      console.log(data);
      setData(data);
    });
  });

  return (
    <PageContainer
      title={'家谱系统'}
      extra={[
        <Button key="1">次要按钮</Button>,
        <Button key="3" type="primary">
          主要按钮
        </Button>,
      ]}
      childrenContentStyle={{ padding: 0 }}
    >
      <RcResizeObserver key="resize-observer" onResize={(offset) => {}}>
        <ProCard split={'horizontal'}>
          <ProCard
            title="概要信息"
            extra="2019年9月28日"
            bordered
            headerBordered
            split={'vertical'}
          >
            <ProCard split="horizontal">
              <ProCard split="vertical">
                <ProCard>
                  <Statistic title="总人数" value={data?.total} suffix={'人'} />
                </ProCard>
                <ProCard>
                  <Statistic
                    title="世代"
                    value={data?.generationTotal}
                    suffix="代"
                  />
                </ProCard>
                <ProCard>
                  <Statistic
                    title="平均后代数"
                    value={data?.avgOffspringNum}
                    suffix="人"
                  />
                </ProCard>
                <ProCard>
                  <Statistic title="冻结金额" value={112893.0} />
                </ProCard>
              </ProCard>
              <ProCard title="世代信息 饼图">
                <List
                  size="small"
                  dataSource={data?.generationGroup || []}
                  renderItem={(item) => (
                    <List.Item>
                      <Typography.Text>第{item.generation}世代</Typography.Text>
                      <Typography.Text>共{item.member_count}人</Typography.Text>
                    </List.Item>
                  )}
                />
              </ProCard>
            </ProCard>
            <ProCard title="生育趋势">柱状图</ProCard>
          </ProCard>
          <ProCard title="图谱" headerBordered extra="sssss">
            <div ref={divRef} style={{ width: '100%', height: '100vh' }}></div>
          </ProCard>
        </ProCard>
      </RcResizeObserver>
    </PageContainer>
  );
};

export default Welcome;
