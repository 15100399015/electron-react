import { EntitySchema } from 'typeorm';
import { Event } from '../model/Event';

export const EventEntity = new EntitySchema({
  name: 'Event',
  tableName: 'event',
  target: Event,
  columns: {
    id: {
      primary: true,
      type: 'integer',
      generated: true,
    },
    memberId: {
      type: 'integer',
    },
    eventType: {
      type: 'text',
      nullable: true,
    },
    eventDate: {
      type: 'text',
      nullable: true,
    },
    eventDescription: {
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
