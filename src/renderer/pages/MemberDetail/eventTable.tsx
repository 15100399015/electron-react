import { Api } from '../../services';
import { addEvent, queryEvents, updateEvent } from '../../services/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';

export default () => {
  const params = useParams();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const [events, setEvents] = useState<API.EventListItem[]>([]);
  const actionRef = useRef<ActionType>();

  async function fetchEvents() {
    const res = await queryEvents(Number(params.memberId));
    setEvents(res);
  }

  useEffectOnce(() => {
    fetchEvents();
  });

  async function handleEdit(record: API.EventListItem) {
    actionRef.current?.startEditable(record.id);
  }
  async function handleDelete(record: API.EventListItem) {
    await Api.removeEvent(record.id);
    await fetchEvents();
  }

  async function handleSave(
    key: React.Key | React.Key[],
    record: API.EventListItem,
  ) {
    if (record.add) {
      await addEvent({ ...record, memberId: params.memberId, id: null });
    } else {
      await updateEvent({ ...record });
    }
    await fetchEvents();
  }
  const columns: ProColumns<API.EventListItem>[] = [
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
          <a key="delete" onClick={() => handleDelete(record)}>
            删除
          </a>,
        ];
      },
    },
  ];

  function generateId() {
    return +(Math.random() * 1000000).toFixed(0);
  }
  return (
    <EditableProTable<API.EventListItem>
      headerTitle="生平事件"
      bordered
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
