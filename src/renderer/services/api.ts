import { request } from '../util';

/** 获取看板数据 */
export async function queryPinboardData() {
  return request<
    API.RequestBody.queryPinboardData,
    API.ResponseBody.queryPinboardData
  >('/member/pinboardData', {});
}

/** 获取成员 */
export async function queryMemberTree(rootId?: number) {
  return request<
    API.RequestBody.queryMemberTree,
    API.ResponseBody.queryMemberTree
  >('/member/queryTree', {
    rootId,
  });
}

/** 获取成员 */
export async function queryMemberById(id: number) {
  return request<
    API.RequestBody.queryMemberById,
    API.ResponseBody.queryMemberById
  >('/member/queryById', { id });
}

/** 获取成员列表 */
export async function queryMembers(
  params: API.RequestBody.queryMember['params'],
  sort: API.RequestBody.queryMember['sort'],
) {
  return request<API.RequestBody.queryMember, API.ResponseBody.queryMember>(
    '/member/query',
    {
      params,
      sort,
    },
  );
}

/** 更新成员信息 */
export async function updateMember(data: API.RequestBody.updateMember) {
  return request<API.RequestBody.updateMember, API.ResponseBody.updateMember>(
    '/member/update',
    { ...data },
  );
}

/** 添加新成员 */
export async function addMember(data: API.RequestBody.addMember) {
  return request<API.RequestBody.addMember, API.ResponseBody.addMember>(
    '/member/add',
    { ...data },
  );
}

/** 删除成员 */
export async function removeMember(ids: number[]) {
  return request<API.RequestBody.removeMember, API.ResponseBody.removeMember>(
    '/member/remove',
    { ids },
  );
}

/** 获取事件 */
export async function queryEvents(memberId: number) {
  return request<API.RequestBody.getEvents, API.ResponseBody.getEvents>(
    '/event/query',
    {
      memberId,
    },
  );
}

/** 添加事件 */
export async function addEvent(data: API.RequestBody.addEvent) {
  return request<API.RequestBody.addEvent, API.ResponseBody.addEvent>(
    '/event/add',
    {
      ...data,
    },
  );
}

/** 更新事件 */
export async function updateEvent(data: API.RequestBody.updateEvent) {
  return request<API.RequestBody.updateEvent, API.ResponseBody.updateEvent>(
    '/event/update',
    { ...data },
  );
}

/** 删除事件 */
export async function removeEvent(id: number) {
  return request<API.RequestBody.removeEvent, API.ResponseBody.removeEvent>(
    '/event/remove',
    {
      id,
    },
  );
}
