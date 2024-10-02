import { UpdateForm, FormValueType } from '../../components/UpdateForm';
import { Api } from '../../services';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Descriptions, message, Space, Statistic } from 'antd';
import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';
import EventTable from './eventTable';
import { useNavigate, useParams } from 'react-router-dom';
import { BloodlineGraph } from '../../components/BloodlineGraph';

const requestUpdate = async (fields: FormValueType) => {
  try {
    await Api.updateMember(fields);
    message.success('更新成功');
    return true;
  } catch (error) {
    message.error('更新失败');
    return false;
  }
};

export const MemberDetail: FC = () => {
  const params = useParams();
  const [data, setData] = useState<API.DataModel.Member | null>();
  const navigate = useNavigate();
  const [modalOpen, handleModalOpen] = useState<boolean>(false);

  async function fetchData() {
    const res = await Api.queryMemberById(Number(params.memberId));
    setData(res);
  }

  useEffect(() => {
    fetchData();
  }, [params.memberId]);

  const ageInfo = useMemo(() => {
    if (!data) return { title: '享年', age: '未知' };
    if (data.birthDate && data.deathDate) {
      const start = new Date(data.birthDate).getFullYear();
      const end = new Date(data.deathDate).getFullYear();
      return { title: '享年', age: end - start };
    }
    if (data.birthDate) {
      const start = new Date(data.birthDate).getFullYear();
      const end = new Date().getFullYear();
      return { title: '现年', age: end - start };
    }
    return { title: '享年', age: '未知' };
  }, [data]);

  async function handleFormSubmit(value: FormValueType) {
    await requestUpdate({ ...value, id: data!.id });
    handleModalOpen(false);
    await fetchData();
  }
  async function handleFormCancel() {
    handleModalOpen(false);
  }

  const extra = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <Statistic title={ageInfo.title} value={ageInfo.age} />
    </div>
  );
  const description = (
    <ProCard bordered>
      <Descriptions column={4}>
        <Descriptions.Item label="名">{data?.name}</Descriptions.Item>
        <Descriptions.Item label="别名">{data?.alias}</Descriptions.Item>
        <Descriptions.Item label="父辈">
          {data?.parentId && data?.parentId !== -1 ? (
            <a
              onClick={() => {
                navigate(`/member/detail/${data.parentId}`);
              }}
            >
              查看
            </a>
          ) : (
            '无'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="配偶姓氏">
          {data?.spouseSurname}
        </Descriptions.Item>
        <Descriptions.Item label="职业">{data?.career}</Descriptions.Item>
        <Descriptions.Item label="职位">{data?.position}</Descriptions.Item>
        <Descriptions.Item label="地址">{data?.address}</Descriptions.Item>
        <Descriptions.Item label="出生地">{data?.birthPlace}</Descriptions.Item>
        <Descriptions.Item label="去世地">{data?.deathPlace}</Descriptions.Item>
        <Descriptions.Item label="出生日期">
          {data?.birthDate}
        </Descriptions.Item>
        <Descriptions.Item label="去世日期">
          {data?.deathDate}
        </Descriptions.Item>
        <Descriptions.Item label="备注">{data?.description}</Descriptions.Item>
      </Descriptions>
    </ProCard>
  );

  const action = (
    <Space>
      <Button
        type="primary"
        onClick={() => {
          handleModalOpen(true);
        }}
      >
        修改
      </Button>
    </Space>
  );

  return (
    <PageContainer
      title={`档案: ${data?.name}`}
      extra={action}
      content={description}
      extraContent={extra}
      style={{
        backgroundColor: '#ffffff',
      }}
      childrenContentStyle={{ padding: 0 }}
      tabList={[
        {
          tab: '血缘图',
          key: '1',
          forceRender: true,
          destroyInactiveTabPane: false,
          children: (
            <BloodlineGraph rootId={Number(params.memberId)}></BloodlineGraph>
          ),
        },
        {
          tab: '生平事件',
          key: '2',
          forceRender: true,
          destroyInactiveTabPane: false,
          children: <EventTable />,
        },
      ]}
    >
      <UpdateForm
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        open={modalOpen}
        values={data || {}}
      ></UpdateForm>
    </PageContainer>
  );
};
