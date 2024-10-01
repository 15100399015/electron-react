import { appDataSource } from '../../database/index';
import { Event } from '../../database/model/Event';

// 获取所有成员列表
async function getEvents(
  body: API.RequestBody.getEvents,
): Promise<API.ResponseBody.getEvents> {
  const { memberId } = body;
  const events = await appDataSource
    .getRepository(Event)
    .createQueryBuilder()
    .where({ memberId })
    .getMany();
  return events;
}

// 添加成员信息
async function addEvent(
  body: API.RequestBody.addEvent,
): Promise<API.ResponseBody.addEvent> {
  const evnet = new Event();

  evnet.memberId = body.memberId;
  evnet.eventDate = body.eventDate;
  evnet.eventType = body.eventType;
  evnet.eventDescription = body.eventDescription;

  appDataSource.getRepository(Event).save(evnet);

  return 'success';
}

// 更新成员信息
async function updateEvent(
  body: API.RequestBody.updateEvent,
): Promise<API.ResponseBody.updateEvent> {
  const evnet = new Event();

  evnet.id = body.id;
  evnet.eventDate = body.eventDate;
  evnet.eventType = body.eventType;
  evnet.eventDescription = body.eventDescription;

  appDataSource.getRepository(Event).save(evnet);

  return 'success';
}

// 删除成员信息
async function removeEvent(
  body: API.RequestBody.removeEvent,
): Promise<API.ResponseBody.removeEvent> {
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
