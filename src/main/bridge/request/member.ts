import { appDataSource } from '../../database/index';
import { Like, In, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { Member } from '../../database/model/Member';
import { Event } from '../../database/model/Event';

const orderMap = { ascend: 'ASC', descend: 'DESC' };

const mapColumns = (tableName: string, columns: string[]) => {
  return columns.map((value, index, arr) => `${tableName}.${value}`).join(', ');
};

function queryTreeSql(id: string, columns: string[]) {
  return `
        WITH RECURSIVE CommonTable AS (
            SELECT ${mapColumns('member', columns)} FROM member WHERE member.id = ${id}
            UNION ALL
            SELECT ${mapColumns('m', columns)} FROM member m INNER JOIN CommonTable ct ON m.parentId = ct.id
        )
        SELECT
          *
        FROM (
          SELECT
            CASE
              WHEN id = ${id} THEN -1
              ELSE parentId
            END AS parentId,
            ${mapColumns(
              'CommonTable',
              columns.filter((c) => c !== 'parentId'),
            )}
            FROM
            CommonTable
        );
    `;
}

function updateTreeLayer(id: string, diff: string) {
  return `
        WITH RECURSIVE CommonTable AS (
            SELECT member.id FROM member WHERE member.id = ${id}
            UNION ALL
            SELECT m.id FROM member m INNER JOIN CommonTable ct ON m.parentId = ct.id
        )
        UPDATE member SET generation = generation + ${diff} WHERE id IN (SELECT id FROM CommonTable);
    `;
}

// 获取所有成员列表
async function queryMemberTree(body) {
  const { rootId } = body;
  const repository = appDataSource.getRepository(Member);
  const columns: (keyof Member)[] = [
    'id',
    'name',
    'parentId',
    'spouseSurname',
    'birthDate',
    'deathDate',
    'generation',
  ];
  if (rootId) {
    return await repository.query(queryTreeSql(rootId, columns));
  }
  return await repository.find({ select: columns });
}

// 获取某个成员
async function queryMemberById(body) {
  const { id } = body;
  const member = await appDataSource
    .getRepository(Member)
    .findOne({ where: { id } });

  return member;
}

// 分页查询成员信息
async function queryMember(body) {
  const searchParams = body.params || {};
  const sortParams = body.sort || {};

  const where: FindOptionsWhere<Member> = {};

  const order: FindOptionsOrder<Member> = {};

  const repository = appDataSource.getRepository(Member);

  if (searchParams.name) where['name'] = Like(`%${searchParams.name}%`);
  if (searchParams.alias) where['alias'] = Like(`%${searchParams.alias}%`);
  if (searchParams.spouseSurname)
    where['spouseSurname'] = Like(`%${searchParams.spouseSurname}%`);
  if (searchParams.birthDate) where['birthDate'] = searchParams.birthDate;
  if (searchParams.birthPlace)
    where['birthPlace'] = Like(`%${searchParams.birthPlace}%`);
  if (searchParams.address)
    where['address'] = Like(`%${searchParams.address}%`);

  if (orderMap[sortParams.birthDate])
    order['birthDate'] = orderMap[sortParams.birthDate];

  const [members, count] = await repository.findAndCount({
    where: where,
    order: order,
    skip: (searchParams.current - 1) * searchParams.pageSize,
    take: searchParams.pageSize,
  });
  return {
    data: members,
    total: count,
    success: true,
  };
}

// 添加成员信息
async function addMember(body) {
  const member = new Member();

  member.name = body.name;
  member.alias = body.alias;
  member.spouseSurname = body.spouseSurname;
  member.pictureUrl = body.pictureUrl;
  member.career = body.career;
  member.position = body.position;
  member.address = body.address;
  member.birthDate = body.birthDate;
  member.deathDate = body.deathDate;
  member.birthPlace = body.birthPlace;
  member.deathPlace = body.deathPlace;
  member.description = body.description;

  await appDataSource.transaction(async (transactionalEntityManager) => {
    const repository = transactionalEntityManager.getRepository(Member);

    if (await repository.count()) {
      const parent = await repository.findOneBy({ id: body.parentId });
      if (!parent) throw new Error('父级错误');
      member.parentId = body.parentId;
      member.generation = parent.generation! + 1;
    } else {
      member.generation = 1;
      member.parentId = -1;
    }

    await repository.save(member);
  });

  return 'success';
}

// 更新成员信息
async function updateMember(body) {
  const member = new Member();

  member.id = body.id;
  member.name = body.name;
  member.parentId = body.parentId;
  member.alias = body.alias;
  member.spouseSurname = body.spouseSurname;
  member.pictureUrl = body.pictureUrl;
  member.career = body.career;
  member.position = body.position;
  member.address = body.address;
  member.birthDate = body.birthDate;
  member.deathDate = body.deathDate;
  member.birthPlace = body.birthPlace;
  member.deathPlace = body.deathPlace;
  member.description = body.description;

  await appDataSource.transaction(async (transactionalEntityManager) => {
    const repository = transactionalEntityManager.getRepository(Member);

    const memberData = await repository.findOneBy({ id: body.id });
    if (!memberData) throw new Error('不存在');
    const parentData = await repository.findOneBy({ id: memberData.parentId });
    if (!parentData) throw new Error('不存在');
    const newParent = await repository.findOneBy({ id: body.parentId });
    if (!newParent) throw new Error('不存在');

    const diff = newParent.generation! - parentData.generation!;

    await repository.query(updateTreeLayer(body.id, String(diff)));

    await repository.save(member);
  });

  return 'success';
}

// 删除成员信息
async function removeMember(body) {
  const { ids = [] } = body;

  await appDataSource.transaction(async (transactionalEntityManager) => {
    const repository = transactionalEntityManager.getRepository(Member);

    const hasChildren = await repository.findOneBy({ parentId: In(ids) });
    if (hasChildren) throw new Error('请先删除下级成员');

    await transactionalEntityManager
      .getRepository(Event)
      .createQueryBuilder()
      .delete()
      .where({ memberId: In(ids) })
      .execute();
    await repository.delete(ids);
  });

  return 'success';
}

export const member = {
  '/member/queryTree': queryMemberTree,
  '/member/queryById': queryMemberById,
  '/member/add': addMember,
  '/member/query': queryMember,
  '/member/update': updateMember,
  '/member/remove': removeMember,
};
