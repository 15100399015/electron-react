import { Api } from '../../services';
import { addEvent, queryEvents, updateEvent } from '../../services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import { Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';

export const EventTable = () => {
  const params = useParams();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const [events, setEvents] = useState<API.DataModel.Evnet[]>([]);
  const actionRef = useRef<ActionType>();

  async function fetchEvents() {
    const res = await queryEvents(Number(params.memberId));
    setEvents(res);
  }

  useEffectOnce(() => {
    fetchEvents();
  });

  // 处理行编辑
  async function handleEdit(record: API.DataModel.Evnet) {
    actionRef.current?.startEditable(record.id!);
  }
  // 处理行删除
  async function handleDelete(record: API.DataModel.Evnet) {
    await Api.removeEvent(record.id!);
    await fetchEvents();
  }

  // 处理行保存
  async function handleSave(
    key: React.Key | React.Key[],
    record: API.DataModel.Evnet & { add?: boolean },
  ) {
    if (record.add) {
      await addEvent({
        ...record,
        memberId: Number(params.memberId),
        id: undefined,
      });
    } else {
      await updateEvent({ ...record });
    }
    await fetchEvents();
  }
  const columns: ProColumns<API.DataModel.Evnet>[] = [
    {
      title: '时间',
      dataIndex: 'eventDate',
      valueType: 'date',
      width: 150,
      formItemProps: () => {
        return { rules: [{ required: true, message: '此项为必填项' }] };
      },
    },
    {
      title: '类型',
      dataIndex: 'eventType',
      width: 200,
      valueType: 'select',
      valueEnum: {
        1: { text: '出生' },
        2: { text: '成家' },
        3: { text: '立业' },
        4: { text: '迁移' },
        5: { text: '其他' },
      },
      formItemProps: () => {
        return { rules: [{ required: true, message: '此项为必填项' }] };
      },
    },
    {
      title: '描述',
      dataIndex: 'eventDescription',
      valueType: 'textarea',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (text, record) => {
        return [
          <a key="editable" onClick={() => handleEdit(record)}>
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
        ];
      },
    },
  ];

  // 生成随机id
  function generateId() {
    return +(Math.random() * 1000000).toFixed(0);
  }
  return (
    <EditableProTable<API.DataModel.Evnet>
      actionRef={actionRef}
      value={events}
      columns={columns}
      rowKey="id"
      recordCreatorProps={{
        creatorButtonText: '添加事件',
        position: 'top',
        style: {
          marginLeft: '10px',
          width: 'calc(100% - 20px)',
          marginRight: '10px',
        },
        record: () => ({ id: generateId(), add: true }),
      }}
      editable={{
        type: 'single',
        editableKeys,
        onChange: setEditableRowKeys,
        onSave: handleSave,
        actionRender: (row, config, defaultDom) => [
          defaultDom.save,
          defaultDom.cancel,
        ],
      }}
    />
  );
};
