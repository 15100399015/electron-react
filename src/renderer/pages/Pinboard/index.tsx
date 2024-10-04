import React, { useMemo, useRef, useState } from 'react';
import { useEffectOnce } from 'react-use';
import { BloodlineGraph } from '../../components/BloodlineGraph';
import {
  PageContainer,
  ProCard,
  ProFormSelect,
} from '@ant-design/pro-components';
import { Button, List, Space, Statistic, Typography } from 'antd';
import { Graph } from '@antv/g6';
import { queryMembers, queryPinboardData } from '../../services/api';
import ColumnChart from './columnChart';

// 选择成员
const selectMembers = (name: string) =>
  queryMembers({ name: name, current: 1, pageSize: 10 }, {});

// 数据看板
export const Pinboard: React.FC = () => {
  // 血缘图引用
  const graphRef = useRef<{ graph?: Graph }>(null);
  // 看板数据
  const [data, setData] = useState<API.ResponseBody.queryPinboardData>();
  // 聚焦id
  const [focusId, setFocusId] = useState<number>();

  // 首次加载数据
  useEffectOnce(() => {
    queryPinboardData().then(setData);
  });

  // 柱图数据
  const columnData = useMemo(() => {
    if (!data) return [];
    if (!Array.isArray(data.generationGroup)) return [];
    return data.generationGroup
      .map((item, index, arr) => {
        if (index === arr.length - 1) return;
        return {
          ...item,
          avgOffspringNum: Number(item.avgOffspringNum.toFixed(2)),
        };
      })
      .filter((item) => !!item);
  }, [data]);

  return (
    <PageContainer childrenContentStyle={{ padding: 0 }}>
      {/* 系统介绍部分 */}
      <ProCard title="系统介绍" headerBordered>
        <Typography.Paragraph
          ellipsis={{
            expandable: 'collapsible',
            defaultExpanded: true,
          }}
        >
          📣 📣 📣
          为了让后世子孙对杨氏家族更加了解，让各支系更加清晰、真实，达到一目了然的目的，
          也由于老式家谱信息更新不方便，难以保证信息及时性，查阅和共享不便，信息展示形式单一，保存和传承困难等原因，
          现基于老式家谱家族信息，制作了新的更便捷、更全面、更具交互性的家谱web系统，
          让家族管理更便捷，信息查阅更方便，信息展示更全面，数据更新更及时，
          开发历史一个多月，经过反复修改，于公元2024年初次发版，
          此系统中信息准确无误的与家谱保持一致，
          集中体现了家谱的全部内容，是家谱一次进化。
        </Typography.Paragraph>
      </ProCard>
      {/* 数据展示部分 */}
      <ProCard split={'horizontal'}>
        {/* 概要看板 */}
        <ProCard title="概要信息" headerBordered split={'vertical'}>
          {/* 左侧 */}
          <ProCard split="horizontal" colSpan={8}>
            {/* 数字概要 */}
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
            {/* 世代人数信息 */}
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
          {/* 血缘图 */}
          <BloodlineGraph ref={graphRef}></BloodlineGraph>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
