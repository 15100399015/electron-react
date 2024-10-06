import {
  queryMemberCount,
  queryMemberById,
  queryMembers,
} from '../../services/api';
import {
  DrawerForm,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';
import { uColorTheme } from '../../constant';

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
      form.setFieldsValue({ ...props.values });
    } else {
      form.resetFields();
    }
  }

  return (
    <DrawerForm<API.DataModel.Member>
      title="成员编辑"
      open={props.open}
      onOpenChange={onOpenChange}
      form={form}
      drawerProps={{
        destroyOnClose: true,
        onClose: () => props.onCancel(),
      }}
      submitTimeout={2000}
      onFinish={props.onSubmit}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="名字"
          placeholder="请输入名字"
          rules={[{ required: true, type: 'string' }]}
        />
        <ProFormSelect
          showSearch
          debounceTime={300}
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
            const count = await queryMemberCount();
            if (count > 0) {
              const res = await selectMembers(params.keyWords);
              return res.data.map((member) => ({
                value: member.id,
                label: member.name,
              }));
            } else {
              return [
                {
                  value: -1,
                  label: '先祖',
                },
              ];
            }
          }}
          width="md"
          name="parentId"
          label="父亲"
          placeholder="请选择父亲"
          rules={[{ required: true, type: 'number' }]}
        />
        <ProFormText
          width="md"
          name="alias"
          label="别名"
          tooltip="曾用名，常用名，小名，官方名等，多个名字用逗号隔开"
          placeholder="请输入别名"
        />
        <ProFormText
          width="md"
          name="spouseSurname"
          label="配偶姓氏"
          tooltip="配偶姓氏，多个姓氏用逗号隔开"
          placeholder="请输入配偶姓氏"
        />

        <ProFormText
          width="md"
          name="address"
          label="地址"
          tooltip="可以是常驻地址或是迁居后的地址，多个地址用逗号隔开"
          placeholder="请输入地址"
        />
        <ProFormText
          width="md"
          name="remark"
          label="备注"
          tooltip="可以标注一些信息，譬如领养，绝户，迁走等信息"
          placeholder="请输入备注"
        />
        <ProFormText
          width="md"
          name="career"
          label="职业"
          tooltip="此人从事的行业或职业，譬如务农，工人，商贩，官员等"
          placeholder="请输入职业"
        />
        <ProFormText
          width="md"
          name="position"
          label="职位"
          tooltip="此人在行业中的职位，譬如个体户，厂长，村长等"
          placeholder="请输入职位"
        />
        <ProFormDatePicker
          width="md"
          name="birthDate"
          label="出生日期"
          placeholder="请选择出生日期"
        />
        <ProFormDatePicker
          width="md"
          name="deathDate"
          label="去世日期"
          placeholder="请选择去世日期"
        />
        <ProFormText
          width="md"
          name="birthPlace"
          label="出生地"
          placeholder="请输入出生地"
        />
        <ProFormText
          width="md"
          name="deathPlace"
          label="去世地"
          placeholder="请输入去世地"
        />

        <ProFormSelect
          options={Object.keys(uColorTheme)}
          fieldProps={{
            labelRender(props) {
              const colors = uColorTheme[props.value];
              return (
                <div
                  style={{
                    height: 20,
                    background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`,
                  }}
                />
              );
            },
            optionRender(option) {
              const colors = uColorTheme[option.value!];
              return (
                <div
                  style={{
                    height: 20,
                    background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`,
                  }}
                ></div>
              );
            },
          }}
          width="md"
          name="highlight"
          label="高亮"
          tooltip="血缘图中会显示不同的颜色, 通常用于标识一些特殊人群，譬如一些名人"
          placeholder="请选择高亮颜色"
        />
        <ProFormText
          width="md"
          name="relation"
          label="与上级关系"
          tooltip="与父亲的关系亲生或领养或赘婿等"
          placeholder="请输入与上级关系"
        />
        <ProFormTextArea
          fieldProps={{ rows: 7 }}
          width="md"
          name="description"
          label="个人简介"
          placeholder="请输入个人简介"
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
