import { queryMembers } from '../../services/api';
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

export type FormValueType = Partial<API.MemberListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  open: boolean;
  values: Partial<API.MemberListItem>;
};

const selectMembers = (name: string) => queryMembers({ name: name, current: 1, pageSize: 10 }, {});

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm<API.MemberListItem>();

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
    <ModalForm<API.MemberListItem>
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
        <ProFormText width="md" name="name" label="名" placeholder="请输入名字" />
        <ProFormText width="md" name="alias" label="别名" placeholder="请输入名称" />
        <ProFormText width="md" name="spouseSurname" label="配偶姓氏" placeholder="请输入名字" />
        <ProFormText width="md" name="address" label="地址" placeholder="请输入名称" />
        <ProFormText width="md" name="career" label="职业" placeholder="请输入名字" />
        <ProFormText width="md" name="position" label="职位" placeholder="请输入名称" />
        <ProFormDatePicker width="md" name="birthDate" label="出生日期" placeholder="请输入名字" />
        <ProFormDatePicker width="md" name="deathDate" label="去世日期" placeholder="请输入名称" />
        <ProFormText width="md" name="birthPlace" label="出生地" placeholder="请输入名字" />
        <ProFormText width="md" name="deathPlace" label="去世地" placeholder="请输入名称" />
        <ProFormSelect
          showSearch
          disabled={props.values.parentId === -1}
          request={async (params) => {
            if (props.values.parentId === -1) {
              return [
                {
                  value: -1,
                  label: '无',
                },
              ];
            }
            const res = await selectMembers(params.keyWords);
            if (res.total) {
              return res.data.map((member) => ({
                value: member.id,
                label: member.name,
              }));
            } else {
              return [
                {
                  value: -1,
                  label: '无',
                },
              ];
            }
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

export default UpdateForm;
