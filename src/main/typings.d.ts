import { Event as EvnetModel } from './database/model/Event';
import { Member as MemberModel } from './database/model/Member';

declare global {
  namespace API {
    // 请求体
    namespace RequestBody {
      type removeMember = {
        ids: number[];
      };
      type updateMember = MemberModel;
      type addMember = MemberModel;

      type queryMember = {
        params: Pick<
          MemberModel,
          | 'name'
          | 'alias'
          | 'spouseSurname'
          | 'birthDate'
          | 'birthPlace'
          | 'address'
        > & { current: number; pageSize: number };
        sort: Pick<MemberModel, 'birthDate'>;
      };

      type queryMemberById = {
        id: number;
      };
      type queryMemberTree = {
        rootId?: number;
      };

      type queryPinboardData = {};
      type getEvents = {
        memberId: number;
      };
      type addEvent = EvnetModel;
      type updateEvent = EvnetModel;
      type removeEvent = {
        id: number;
      };
    }

    // 响应体
    namespace ResponseBody {
      type removeMember = string;
      type updateMember = string;
      type addMember = string;

      type queryMember = {
        data: MemberModel[];
        total: number;
        success: boolean;
      };

      type queryMemberById = MemberModel;
      type queryMemberTree = MemberModel[];

      type queryPinboardData = {
        total: number;
        generationTotal: number;
        avgOffspringNum: number;
        generationGroup: {
          generation: number;
          member_count: number;
          avgOffspringNum: number;
        }[];
      };

      type getEvents = EvnetModel[];
      type addEvent = string;
      type updateEvent = string;
      type removeEvent = string;
    }

    namespace DataModel {
      type Member = MemberModel;
      type Evnet = EvnetModel;
    }
  }
}
