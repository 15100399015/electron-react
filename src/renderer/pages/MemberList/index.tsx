import { UpdateForm } from '../../components/UpdateForm';
import { Api } from '../../services';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Form, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryMembers } from '../../services/api';

const requestAdd = async (fields: API.DataModel.Member) => {
  try {
    await Api.addMember({ ...fields });
    message.success('添加成功');
    return true;
  } catch (error) {
    message.error('添加失败');
    return false;
  }
};

const requestUpdate = async (fields: API.DataModel.Member) => {
  try {
    await Api.updateMember(fields);
    message.success('更新成功');
    return true;
  } catch (error) {
    message.error('更新失败');
    return false;
  }
};

const requestRemove = async (selectedRows: API.DataModel.Member[]) => {
  if (!selectedRows) return true;
  try {
    await Api.removeMember(selectedRows.map((row) => row.id!));
    message.success('删除成功');
    return true;
  } catch (error) {
    message.error('删除失败');
    return false;
  }
};

export const MemberList: React.FC = () => {
  const navigate = useNavigate();

  const actionRef = useRef<ActionType>();
  const [modalOpen, handleModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.DataModel.Member>();
  const [selectedRowsState, setSelectedRows] = useState<API.DataModel.Member[]>(
    [],
  );

  // 跳转到详情页
  async function handleGoDetailPage(record: API.DataModel.Member) {
    navigate(`/member/detail/${record.id}`);
  }

  // 打开编辑框
  async function handleEdit(record: API.DataModel.Member) {
    handleModalOpen(true);
    setCurrentRow(record);
  }

  // 删除记录
  async function handleDelete(record: API.DataModel.Member) {
    await requestRemove([record]);
    actionRef.current?.reloadAndRest?.();
  }

  // 批量删除记录
  async function handleBatchDelete() {
    await requestRemove(selectedRowsState);
    setSelectedRows([]);
    actionRef.current?.reloadAndRest?.();
  }

  // 添加子成员
  async function handleAddChild(record: API.DataModel.Member) {
    handleModalOpen(true);
    setCurrentRow({ parentId: record.id });
  }
  // 新增成员
  async function handleAdd() {
    handleModalOpen(true);
    setCurrentRow(undefined);
  }

  // 导入数据
  async function handleImportData(parentId?: number) {
    await window.bridge.database('importData', { parentId });
    actionRef.current?.reloadAndRest?.();
    message.success('导入成功');
  }
  // 导出数据
  async function handleExportData() {
    await window.bridge.database('exportData');
    message.success('导出成功');
  }

  // 表单提交
  async function handleFormSubmit(value: API.DataModel.Member) {
    if (currentRow) {
      await requestUpdate({ ...value, id: currentRow.id });
    } else {
      await requestAdd(value);
    }
    handleModalOpen(false);
    setCurrentRow(undefined);
    actionRef.current?.reload?.();
  }

  // 表单取消
  async function handleFormCancel() {
    handleModalOpen(false);
    setCurrentRow(undefined);
  }
  // table column
  const columns: ProColumns<API.DataModel.Member>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '名',
      dataIndex: 'name',
      render: (name, record) => {
        return <a onClick={() => handleGoDetailPage(record)}>{name}</a>;
      },
    },
    {
      title: '别名',
      dataIndex: 'alias',
    },
    {
      title: '配偶姓氏',
      dataIndex: 'spouseSurname',
    },
    {
      title: '出生日期',
      sorter: true,
      dataIndex: 'birthDate',
      valueType: 'date',
    },
    {
      title: '出生地',
      dataIndex: 'birthPlace',
    },
    {
      title: '所在地',
      dataIndex: 'address',
    },
    {
      title: '入录时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      render: (_, record) => [
        <a key="addChild" onClick={() => handleAddChild(record)}>
          添加子辈
        </a>,
        <a key="edit" onClick={() => handleEdit(record)}>
          编辑
        </a>,
        <Popconfirm
          title="确定删除吗"
          description="删除后不可找回"
          onConfirm={() => {
            handleDelete(record);
          }}
        >
          <a key="delete">删除</a>
        </Popconfirm>,
      ],
    },
  ];
  return (
    <PageContainer childrenContentStyle={{ padding: 0 }}>
      <ProTable<API.DataModel.Member, API.RequestBody.queryMember>
        cardBordered
        actionRef={actionRef}
        rowKey="id"
        search={{
          submitterColSpanProps: { span: 24 },
          collapseRender: false,
          collapsed: false,
          span: 6,
        }}
        form={{
          labelAlign: 'left',
        }}
        toolBarRender={() => [
          <Button onClick={handleExportData}>数据导出</Button>,
          <ImportData onFinish={handleImportData} />,
          <Button type="primary" key="primary" onClick={handleAdd}>
            创建
          </Button>,
        ]}
        request={(params, sort) => {
          return Api.queryMembers(
            {
              ...params,
              current: params.current || 1,
              pageSize: params.pageSize || 10,
            },
            sort,
          );
        }}
        columns={columns}
        rowSelection={{
          selectedRowKeys: selectedRowsState.map((item) => item.id!),
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项
            </div>
          }
        >
          <Button onClick={handleBatchDelete}>批量删除</Button>
        </FooterToolbar>
      )}
      <UpdateForm
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        open={modalOpen}
        values={currentRow || {}}
      />
    </PageContainer>
  );
};

const selectMembers = (name?: string) =>
  queryMembers({ name: name, current: 1, pageSize: 10 }, {});

interface ImportDataProps {
  onFinish: (parentId?: number) => void;
}

const ImportData: React.FC<ImportDataProps> = (props: ImportDataProps) => {
  const [form] = Form.useForm<{ parent: number }>();
  const [open, setOpen] = useState(false);
  return (
    <React.Fragment>
      <Button
        onClick={async () => {
          const haveData = !!(await selectMembers()).total;
          if (haveData) {
            setOpen(true);
          } else {
            props.onFinish();
          }
        }}
      >
        数据导入
      </Button>
      <ModalForm<{
        parent: number;
      }>
        title="选择导入根节点"
        open={open}
        form={form}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => {
            setOpen(false);
          },
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          console.log(values.parent);
          if (values.parent) {
            props.onFinish(values.parent);
            setOpen(false);
          } else {
            message.warning('请选择父级');
          }
          return true;
        }}
      >
        <ProFormSelect
          showSearch
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
          name={'parent'}
        />
      </ModalForm>
    </React.Fragment>
  );
};
