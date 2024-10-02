import { app, dialog } from 'electron';
import fs from 'fs';
import path from 'path';
import { appDataSource } from '../../database';
import { Member } from '../../database/model/Member';
import { Event } from '../../database/model/Event';

interface MemberNode extends Member {
  children?: MemberNode[];
  events?: Event[];
}

async function importData(data: MemberNode, parentId = -1, layer = 1) {
  const memberData = await appDataSource.getRepository(Member).save({
    address: data.address,
    name: data.name,
    alias: data.alias,
    spouseSurname: data.spouseSurname,
    position: data.position,
    career: data.career,
    birthDate: data.birthDate,
    birthPlace: data.birthPlace,
    deathDate: data.deathDate,
    deathPlace: data.deathPlace,
    description: data.description,
    pictureUrl: data.pictureUrl,
    generation: layer,
    parentId: parentId,
  });
  const children = data.children || [];
  const events = data.events || [];

  await appDataSource.getRepository(Event).save(
    events.map((event) => {
      return {
        eventDate: event.eventDate,
        eventType: event.eventType,
        eventDescription: event.eventDescription,
        memberId: memberData.id!,
      };
    }),
  );

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    await importData(child, memberData.id, layer + 1);
  }
}

const routes = {
  exportData: async () => {
    const members = await appDataSource.getRepository(Member).find();
    const events = await appDataSource.getRepository(Event).find();

    const memberMap: Record<number, MemberNode> = {};

    let root = null;
    members.forEach((member) => {
      memberMap[member.id!] = member;
      if (member.parentId === -1) root = member;
    });

    members.forEach((member) => {
      const parent = memberMap[member.parentId!];
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(member);
      }
    });
    events.forEach((event) => {
      const member = memberMap[event.memberId!];
      if (member) {
        if (!member.events) member.events = [];
        member.events.push(event);
      }
    });

    const jsonString = JSON.stringify(root);

    return await dialog
      .showSaveDialog({
        title: '导出成员信息',
        defaultPath: path.join(app.getPath('desktop'), 'dataTree.json'),
      })
      .then((res) => {
        if (!res.canceled && res.filePath) {
          fs.writeFileSync(res.filePath, jsonString);
        } else {
          return Promise.reject('用户取消');
        }
      });
  },
  // 导入数据
  importData: async (body: { parentId?: number }) => {
    const { parentId } = body;
    const repository = appDataSource.getRepository(Member);
    if (await repository.count()) {
      const parent = await repository.findOneBy({
        id: parentId,
      });
      if (!parent) return Promise.reject('父级不存在');
      const defaultGeneration = Number(parent.generation) + 1;
      const defaultParentId = parent.id;
      await dialog
        .showOpenDialog({
          title: '选择导入文件',
          properties: ['openFile'],
          filters: [{ name: 'Json File', extensions: ['json'] }],
        })
        .then(async (res) => {
          if (!res.canceled && res.filePaths) {
            const filePath = res.filePaths[0];
            const fileData = fs.readFileSync(filePath).toString();
            const data = JSON.parse(fileData) as MemberNode;
            await importData(data, defaultParentId, defaultGeneration);
          } else {
            return Promise.reject('用户取消');
          }
        });
    } else {
      await dialog
        .showOpenDialog({
          title: '选择导入文件',
          properties: ['openFile'],
          filters: [{ name: 'Json File', extensions: ['json'] }],
        })
        .then(async (res) => {
          if (!res.canceled && res.filePaths) {
            const filePath = res.filePaths[0];
            const fileData = fs.readFileSync(filePath).toString();
            const data = JSON.parse(fileData) as MemberNode;
            await importData(data);
          } else {
            return Promise.reject('用户取消');
          }
        });
    }
  },
};

type RoutesType = typeof routes;
type ApiNames = keyof RoutesType;

export interface DatabaseBridgeHanderType {
  <K extends ApiNames>(
    apiName: K,
    ...args: Parameters<RoutesType[K]>
  ): ReturnType<RoutesType[K]>;
}

export const databaseBridgeHander = async (
  apiName: ApiNames,
  ...args: Parameters<RoutesType[ApiNames]>
) => {
  const controller = routes[apiName];
  if (controller && typeof controller === 'function') {
    // @ts-ignore
    return await controller(...args);
  }
  throw new Error('404');
};
