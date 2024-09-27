import UpdateForm, { FormValueType } from '../../components/UpdateForm';
import { Api } from '../../services';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Descriptions, message, Space, Statistic } from 'antd';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';
import EventTable from './eventTable';
import { useParams } from 'react-router-dom';

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

const Advanced: FC = () => {
  const params = useParams();
  const [data, setData] = useState<API.MemberListItem | null>();

  const [modalOpen, handleModalOpen] = useState<boolean>(false);

  async function fetchData() {
    const res = await Api.queryMemberById(Number(params.memberId));
    setData(res);
  }

  useEffectOnce(() => {
    fetchData();
  });

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
        justifyContent: 'flex-start',
      }}
    >
      <Statistic title={ageInfo.title} value={ageInfo.age} suffix="岁" />
    </div>
  );
  const description = (
    <Descriptions column={4}>
      <Descriptions.Item label="名">{data?.name}</Descriptions.Item>
      <Descriptions.Item label="别名">{data?.alias}</Descriptions.Item>
      <Descriptions.Item label="配偶姓氏">
        {data?.spouseSurname}
      </Descriptions.Item>
      <Descriptions.Item label="职业">{data?.career}</Descriptions.Item>
      <Descriptions.Item label="职位">{data?.position}</Descriptions.Item>
      <Descriptions.Item label="地址">{data?.address}</Descriptions.Item>
      <Descriptions.Item label="出生地">{data?.birthPlace}</Descriptions.Item>
      <Descriptions.Item label="去世地">{data?.deathPlace}</Descriptions.Item>
      <Descriptions.Item label="出生日期">{data?.birthDate}</Descriptions.Item>
      <Descriptions.Item label="去世日期">{data?.deathDate}</Descriptions.Item>
      <Descriptions.Item label="备注">{data?.description}</Descriptions.Item>
    </Descriptions>
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
      fixedHeader
      childrenContentStyle={{ padding: 0 }}
    >
      <UpdateForm
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        open={modalOpen}
        values={data || {}}
      ></UpdateForm>
      <EventTable />
    </PageContainer>
  );
};
export default Advanced;
