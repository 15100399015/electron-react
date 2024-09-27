import { request } from '../util';

/** 获取成员 */
export async function queryMemberTree(rootId?: number) {
  return request<API.MemberListItem>('/member/queryTree', { rootId });
}

/** 获取成员 */
export async function queryMemberById(id: number) {
  return request<API.MemberListItem>('/member/queryById', { id });
}

/** 获取成员列表 */
export async function queryMembers(params: any, sort: any) {
  return request<{ total: number; data: API.MemberListItem[] }>(
    '/member/query',
    {
      params,
      sort,
    },
  );
}

/** 更新成员信息 */
export async function updateMember(data?: { [key: string]: any }) {
  return request<string>('/member/update', {
    ...data,
  });
}

/** 添加新成员 */
export async function addMember(data?: { [key: string]: any }) {
  console.log('adding', data);
  return request<string>('/member/add', {
    ...data,
  });
}

/** 删除成员 */
export async function removeMember(ids: number[]) {
  return request<string>('/member/remove', {
    ids,
  });
}

/** 获取事件 */
export async function queryEvents(memberId: number) {
  return request<API.EventListItem[]>('/event/query', {
    memberId,
  });
}

/** 添加事件 */
export async function addEvent(data?: { [key: string]: any }) {
  return request<string>('/event/add', {
    ...data,
  });
}

/** 更新事件 */
export async function updateEvent(data?: { [key: string]: any }) {
  return request<string>('/event/update', {
    ...data,
  });
}

/** 删除事件 */
export async function removeEvent(id: number) {
  return request<string>('/event/remove', {
    id,
  });
}
