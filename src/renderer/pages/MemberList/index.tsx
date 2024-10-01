import type { FormValueType } from '../../components/UpdateForm';
import { UpdateForm } from '../../components/UpdateForm';
import { Api } from '../../services';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const requestAdd = async (fields: Partial<API.DataModel.Member>) => {
  try {
    await Api.addMember({ ...fields });
    message.success('添加成功');
    return true;
  } catch (error) {
    message.error('添加失败');
    return false;
  }
};

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

  async function handleGoDetailPage(record: API.DataModel.Member) {
    navigate(`/member/detail/${record.id}`);
  }

  async function handleEdit(record: API.DataModel.Member) {
    handleModalOpen(true);
    setCurrentRow(record);
  }

  async function handleDelete(record: API.DataModel.Member) {
    await requestRemove([record]);
    actionRef.current?.reloadAndRest?.();
  }

  async function handleBatchDelete() {
    await requestRemove(selectedRowsState);
    setSelectedRows([]);
    actionRef.current?.reloadAndRest?.();
  }

  async function handleFormSubmit(value: FormValueType) {
    if (currentRow) {
      await requestUpdate({ ...value, id: currentRow.id });
    } else {
      await requestAdd(value);
    }
    handleModalOpen(false);
    setCurrentRow(undefined);
    actionRef.current?.reload?.();
  }

  async function handleFormCancel() {
    handleModalOpen(false);
    setCurrentRow(undefined);
  }
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
      dataIndex: 'memberId',
      valueType: 'option',
      render: (_, record) => [
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
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
              setCurrentRow(undefined);
            }}
          >
            <PlusOutlined /> 创建
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
