import typeorm from 'typeorm';
import sqlite3 from 'sqlite3';

import { EventEntity } from './entity/Event';
import { MemberEntity } from './entity/Member';
// 数据源
export const appDataSource = new typeorm.DataSource({
  type: 'sqlite',
  database: '',
  synchronize: true,
  driver: sqlite3,
  entities: [EventEntity, MemberEntity],
});
