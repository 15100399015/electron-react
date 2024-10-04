import { queryMemberById, queryMembers } from '../../services/api';
import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';

export type UpdateFormProps = {
  onCancel: () => void;
  onSubmit: (values: API.DataModel.Member) => Promise<void>;
  open: boolean;
  values: Partial<API.DataModel.Member>;
};

const selectMembers = (name: string) =>
  queryMembers({ name: name, current: 1, pageSize: 10 }, {});

export const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm<API.DataModel.Member>();

  function onOpenChange(open: boolean) {
    if (open) {
      form.setFieldsValue({
        parentId: props.values.parentId,
        name: props.values.name,
        pictureUrl: props.values.pictureUrl,
        alias: props.values.alias,
        spouseSurname: props.values.spouseSurname,
        description: props.values.description,
        address: props.values.address,
        career: props.values.career,
        position: props.values.position,
        birthDate: props.values.birthDate,
        deathDate: props.values.deathDate,
        birthPlace: props.values.birthPlace,
        deathPlace: props.values.deathPlace,
      });
    } else {
      form.setFieldsValue({});
    }
  }

  return (
    <ModalForm<API.DataModel.Member>
      title="成员编辑"
      open={props.open}
      onOpenChange={onOpenChange}
      form={form}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onCancel(),
      }}
      submitTimeout={2000}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="名"
          placeholder="请输入名字"
        />
        <ProFormText
          width="md"
          name="alias"
          label="别名"
          placeholder="请输入名称"
        />
        <ProFormText
          width="md"
          name="spouseSurname"
          label="配偶姓氏"
          placeholder="请输入名字"
        />
        <ProFormText
          width="md"
          name="address"
          label="地址"
          placeholder="请输入名称"
        />
        <ProFormText
          width="md"
          name="career"
          label="职业"
          placeholder="请输入名字"
        />
        <ProFormText
          width="md"
          name="position"
          label="职位"
          placeholder="请输入名称"
        />
        <ProFormDatePicker
          width="md"
          name="birthDate"
          label="出生日期"
          placeholder="请输入名字"
        />
        <ProFormDatePicker
          width="md"
          name="deathDate"
          label="去世日期"
          placeholder="请输入名称"
        />
        <ProFormText
          width="md"
          name="birthPlace"
          label="出生地"
          placeholder="请输入名字"
        />
        <ProFormText
          width="md"
          name="deathPlace"
          label="去世地"
          placeholder="请输入名称"
        />
        <ProFormSelect
          showSearch
          disabled={props.values?.parentId === -1}
          request={async (params) => {
            const defaultParentId = props.values.parentId;
            if (defaultParentId) {
              if (defaultParentId === -1) {
                return [
                  {
                    value: -1,
                    label: '先祖',
                  },
                ];
              }
              if (defaultParentId > 0 && !params.keyWords) {
                const res = await queryMemberById(defaultParentId);
                if (res) {
                  return [
                    {
                      label: res.name,
                      value: res.id,
                    },
                  ];
                }
              }
            }
            const res = await selectMembers(params.keyWords);
            if (res.total > 0) {
              return res.data.map((member) => ({
                value: member.id,
                label: member.name,
              }));
            } else if (res.total === 0) {
              return [
                {
                  value: -1,
                  label: '先祖',
                },
              ];
            }
            return [];
          }}
          dependencies={[]}
          width="md"
          name="parentId"
          label="父亲"
        />
        <ProFormTextArea
          fieldProps={{ rows: 7 }}
          width="md"
          name="description"
          label="个人简介"
          placeholder="请输入名称"
        />
      </ProForm.Group>
    </ModalForm>
  );
};
