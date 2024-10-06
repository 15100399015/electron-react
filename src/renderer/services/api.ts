/** 获取看板数据 */
export async function queryPinboardData() {
  return window.bridge.request('/member/queryPinboardData');
}

/** 获取成总数 */
export async function queryMemberCount() {
  return window.bridge.request('/member/queryCount');
}
/** 获取成员 */
export async function queryMemberTree(rootId?: number) {
  return window.bridge.request('/member/queryTree', {
    rootId,
  });
}

/** 根据id获取成员 */
export async function queryMemberById(id: number) {
  return window.bridge.request('/member/queryById', { id });
}

/** 获取成员列表 */
export async function queryMembers(
  params: API.RequestBody.queryMember['params'],
  sort: API.RequestBody.queryMember['sort'],
) {
  return window.bridge.request('/member/query', {
    params,
    sort,
  });
}

/** 更新成员信息 */
export async function updateMember(data: API.RequestBody.updateMember) {
  return window.bridge.request('/member/update', { ...data });
}

/** 添加新成员 */
export async function addMember(data: API.RequestBody.addMember) {
  return window.bridge.request('/member/add', { ...data });
}

/** 删除成员 */
export async function removeMember(ids: number[]) {
  return window.bridge.request('/member/remove', { ids });
}

/** 获取事件 */
export async function queryEvents(memberId: number) {
  return window.bridge.request('/event/query', {
    memberId,
  });
}

/** 添加事件 */
export async function addEvent(data: API.RequestBody.addEvent) {
  return window.bridge.request('/event/add', {
    ...data,
  });
}

/** 更新事件 */
export async function updateEvent(data: API.RequestBody.updateEvent) {
  return window.bridge.request('/event/update', { ...data });
}

/** 删除事件 */
export async function removeEvent(id: number) {
  return window.bridge.request('/event/remove', {
    id,
  });
}
