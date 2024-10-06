import { EntitySchema } from 'typeorm';
import { Member } from '../model/Member';

export const MemberEntity = new EntitySchema({
  name: 'Member',
  tableName: 'member',
  target: Member,
  columns: {
    id: {
      primary: true,
      type: 'integer',
      generated: true,
    },
    parentId: {
      type: 'integer',
    },
    generation: {
      type: 'integer',
    },
    name: {
      type: 'text',
    },
    alias: {
      type: 'text',
      nullable: true,
    },
    spouseSurname: {
      type: 'text',
      nullable: true,
    },
    remark: {
      type: 'text',
      nullable: true,
    },
    highlight: {
      type: 'text',
      nullable: true,
    },
    relation: {
      type: 'text',
      nullable: true,
    },
    pictureUrl: {
      type: 'text',
      nullable: true,
    },
    career: {
      type: 'text',
      nullable: true,
    },
    position: {
      type: 'text',
      nullable: true,
    },
    address: {
      type: 'text',
      nullable: true,
    },
    birthDate: {
      type: 'date',
      nullable: true,
    },
    deathDate: {
      type: 'date',
      nullable: true,
    },
    birthPlace: {
      type: 'text',
      nullable: true,
    },
    deathPlace: {
      type: 'text',
      nullable: true,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    createTime: {
      type: 'datetime',
      createDate: true,
    },
    updateTime: {
      type: 'datetime',
      updateDate: true,
    },
  },
});
