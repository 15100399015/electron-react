import { appDataSource } from '../../database/index';
import { Event } from '../../database/model/Event';

// 获取所有成员列表
async function getEvents(body) {
  const { memberId } = body;
  const events = await appDataSource
    .getRepository(Event)
    .createQueryBuilder()
    .where({ memberId })
    .getMany();
  return events;
}

// 添加成员信息
async function addEvent(body) {
  const evnet = new Event();

  evnet.memberId = body.memberId;
  evnet.eventDate = body.eventDate;
  evnet.eventType = body.eventType;
  evnet.eventDescription = body.eventDescription;

  appDataSource.getRepository(Event).save(evnet);

  return 'success';
}

// 更新成员信息
async function updateEvent(body) {
  const evnet = new Event();

  evnet.id = body.id;
  evnet.eventDate = body.eventDate;
  evnet.eventType = body.eventType;
  evnet.eventDescription = body.eventDescription;

  appDataSource.getRepository(Event).save(evnet);

  return 'success';
}

// 删除成员信息
async function removeEvent(body) {
  const { id } = body;

  await appDataSource.getRepository(Event).delete(id);

  return 'success';
}

export const event = {
  '/event/add': addEvent,
  '/event/query': getEvents,
  '/event/update': updateEvent,
  '/event/remove': removeEvent,
};
