import { Api } from '../../services';
import React, { useMemo, useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { BloodlineGraph } from './graph';
import {
  PageContainer,
  ProCard,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Button, List, Space, Statistic, Typography } from 'antd';
import { Graph, GraphData } from '@antv/g6';
import { queryMembers } from '../../services/api';
import ColumnChart from './columnChart';

// 格式化数据
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

const Pinboard: React.FC = () => {
  const graphRef = useRef<{ graph?: Graph }>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [data, setData] = useState<any>({});
  const [focusId, setFocusId] = useState<number>();

  useEffectOnce(() => {
    window.bridge.request('/member/dataScreen', {}).then(setData);
    Api.queryMemberTree().then((data) => {
      setGraphData(formatData(data));
    });
  });

  useEffectOnce(() => {});

  const columnData = useMemo(() => {
    if (!Array.isArray(data.generationGroup)) return [];
    return data.generationGroup
      .map((item, index, arr) => {
        if (index === arr.length - 1) return;
        return item;
      })
      .filter((item) => !!item);
  }, [data]);

  return (
    <PageContainer title={false} childrenContentStyle={{ padding: 0 }}>
      <ProCard split={'horizontal'}>
        {/* 概要看板 */}
        <ProCard title="概要信息" bordered headerBordered split={'vertical'}>
          {/* 左侧 */}
          <ProCard split="horizontal" colSpan={8}>
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
          {/* 右侧 */}
          <ProCard title="人口趋势">
            <ColumnChart data={columnData}></ColumnChart>
          </ProCard>
        </ProCard>
        {/* 血缘图 */}
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
    </PageContainer>
  );
};

export default Pinboard;
