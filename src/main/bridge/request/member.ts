import { appDataSource } from '../../database/index';
import { Like, In, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { Member } from '../../database/model/Member';
import { Event } from '../../database/model/Event';

const orderMap: Record<string, 'ASC' | 'DESC'> = {
  ascend: 'ASC',
  descend: 'DESC',
};

const mapColumns = (tableName: string, columns: string[]) => {
  return columns.map((value) => `${tableName}.${value}`).join(', ');
};

// 查询树
function queryTreeSql(id: number) {
  const columns = Object.keys(new Member());
  return `
        WITH RECURSIVE CommonTable AS (
            SELECT ${mapColumns('member', columns)} FROM member WHERE member.id = ${id}
            UNION ALL
            SELECT ${mapColumns('m', columns)} FROM member m INNER JOIN CommonTable ct ON m.parentId = ct.id
        )
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
        ORDER BY
          CommonTable.generation ASC
    `;
}

// 更新树层级
function updateTreeLayer(id: number, diff: string) {
  return `
        WITH RECURSIVE CommonTable AS (
            SELECT member.id FROM member WHERE member.id = ${id}
            UNION ALL
            SELECT m.id FROM member m INNER JOIN CommonTable ct ON m.parentId = ct.id
        )
        UPDATE member SET generation = generation + ${diff} WHERE id IN (SELECT id FROM CommonTable);
    `;
}

async function queryPinboardData(): Promise<API.ResponseBody.queryPinboardData> {
  const repository = appDataSource.getRepository(Member);

  // 根据世代分组
  const generationGroup = await repository
    .createQueryBuilder()
    .select(['generation'])
    .addSelect('COUNT(*)', 'member_count')
    .groupBy('generation')
    .orderBy('generation', 'ASC')
    .getRawMany()
    .then((records: { generation: number; member_count: number }[]) => {
      return records.map((record, index) => {
        const { member_count, generation } = record;
        const next = records[index + 1];
        return {
          generation: generation,
          member_count: member_count,
          avgOffspringNum: (next?.member_count || 0) / member_count,
        };
      });
    });

  // 人口总数
  const total = await repository.count();

  // 平均生育数
  const avgOffspringNum = await repository
    .query(
      `SELECT AVG(child_count) as num FROM (SELECT parentId, COUNT(*) as child_count FROM member GROUP BY parentId);`,
    )
    .then((result) => {
      return Number(Array.isArray(result) ? result[0]?.num : 0);
    });

  return {
    total,
    avgOffspringNum,
    generationGroup,
    generationTotal: generationGroup.length,
  };
}

// 获取所有成员列表
async function queryMemberTree(
  body: API.RequestBody.queryMemberTree,
): Promise<API.ResponseBody.queryMemberTree> {
  const { rootId } = body;
  const repository = appDataSource.getRepository(Member);

  if (rootId) {
    return await repository.query(queryTreeSql(rootId));
  }
  return await repository
    .createQueryBuilder('member')
    .orderBy('generation', 'ASC')
    .getMany();
}

// 获取某个成员
async function queryMemberById(body: API.RequestBody.queryMemberById) {
  const { id } = body;
  const member = await appDataSource
    .getRepository(Member)
    .findOne({ where: { id } });

  return member;
}

// 获取成员总数
async function queryCount() {
  return await appDataSource.getRepository(Member).count();
}
// 分页查询成员信息
async function queryMember(
  body: API.RequestBody.queryMember,
): Promise<API.ResponseBody.queryMember> {
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

  if (sortParams.birthDate && orderMap[sortParams.birthDate])
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
async function addMember(
  body: API.RequestBody.addMember,
): Promise<API.ResponseBody.addMember> {
  const member = new Member();

  member.name = body.name;
  member.alias = body.alias;
  member.spouseSurname = body.spouseSurname;
  member.remark = body.remark;
  member.highlight = body.highlight;
  member.relation = body.relation;
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
      if (!parent) throw new Error('父级不存在');
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
async function updateMember(
  body: API.RequestBody.updateMember,
): Promise<API.ResponseBody.updateMember> {
  const member = new Member();

  member.id = body.id;
  member.name = body.name;
  member.parentId = body.parentId;
  member.alias = body.alias || null;
  member.spouseSurname = body.spouseSurname || null;
  member.remark = body.remark || null;
  member.highlight = body.highlight || null;
  member.relation = body.relation || null;
  member.pictureUrl = body.pictureUrl || null;
  member.career = body.career || null;
  member.position = body.position || null;
  member.address = body.address || null;
  member.birthDate = body.birthDate || null;
  member.deathDate = body.deathDate || null;
  member.birthPlace = body.birthPlace || null;
  member.deathPlace = body.deathPlace || null;
  member.description = body.description || null;

  await appDataSource.transaction(async (transactionalEntityManager) => {
    const repository = transactionalEntityManager.getRepository(Member);

    const memberData = await repository.findOneBy({ id: body.id });
    if (!memberData) throw new Error('成员不存在');

    // 需要更新层级
    if (body.parentId && body.parentId !== memberData.parentId) {
      const parentData = await repository.findOneBy({
        id: memberData.parentId!,
      });
      if (!parentData) throw new Error('成员父级不存在');
      const newParent = await repository.findOneBy({ id: body.parentId });
      if (!newParent) throw new Error('成员新父级不存在');
      const diff = newParent.generation! - parentData.generation!;
      if (diff !== 0) {
        await repository.query(
          updateTreeLayer(body.id as number, String(diff)),
        );
      }
    }

    await repository.save(member);
  });

  return 'success';
}

// 删除成员信息
async function removeMember(
  body: API.RequestBody.removeMember,
): Promise<API.ResponseBody.removeMember> {
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
  '/member/queryPinboardData': queryPinboardData,
  '/member/queryCount': queryCount,
  '/member/queryTree': queryMemberTree,
  '/member/queryById': queryMemberById,
  '/member/add': addMember,
  '/member/query': queryMember,
  '/member/update': updateMember,
  '/member/remove': removeMember,
};
