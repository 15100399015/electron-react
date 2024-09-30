import { Api } from '../../services';
import React, { useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { BloodlineGraph } from './graph';
import {
  PageContainer,
  ProCard,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Button, Input, List, Space, Statistic, Typography } from 'antd';
import RcResizeObserver from 'rc-resize-observer';
import { Graph, GraphData } from '@antv/g6';
import { queryMembers } from '../../services/api';

Input.Group;

function formatData(data: any[]): GraphData {
  const nodes: GraphData['nodes'] = data
    .map((node) => {
      return {
        id: String(node.id),
        data: { ...node },
      };
    })
    .filter((item) => !!item);
  const edges: GraphData['edges'] = data
    .map((node) => {
      if (node.parentId === -1) {
        return null;
      }
      return {
        source: String(node.parentId),
        target: String(node.id),
      };
    })
    .filter((item) => !!item);
  return { nodes, edges };
}
const selectMembers = (name: string) =>
  queryMembers({ name: name, current: 1, pageSize: 10 }, {});

const Welcome: React.FC = () => {
  const graphRef = useRef<{ graph?: Graph }>(null);
  const [graphData, setGraphData] = useState<any>(null);

  const [focusId, setFocusId] = useState<number>();

  useEffectOnce(() => {
    Api.queryMemberTree().then((data) => {
      setGraphData(formatData(data));
    });
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
              </ProCard>
              <ProCard title="世代信息">
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
            <ProCard title="生育趋势">
              {/* <Column data={data?.generationGroup}></Column> */}
            </ProCard>
          </ProCard>
          <ProCard
            title="图谱"
            headerBordered
            extra={
              <Space.Compact>
                <ProFormSelect
                  showSearch
                  onChange={setFocusId}
                  request={async (params) => {
                    const res = await selectMembers(params.keyWords);
                    if (res.total) {
                      return res.data.map((member) => ({
                        value: member.id,
                        label: member.name,
                      }));
                    } else {
                      return [];
                    }
                  }}
                  name={'name'}
                  style={{ width: 200 }}
                />
                <Button
                  type="primary"
                  onClick={() => {
                    if (focusId) {
                      graphRef.current?.graph?.focusElement(String(focusId));
                    }
                  }}
                >
                  聚焦
                </Button>
              </Space.Compact>
            }
          >
            <BloodlineGraph ref={graphRef} data={graphData}></BloodlineGraph>
          </ProCard>
        </ProCard>
      </RcResizeObserver>
    </PageContainer>
  );
};

export default Welcome;
