declare namespace API {
  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type EventListItem = {
    id: number;
    memberId?: string;
    eventDate?: string;
    eventType?: string;
    eventDescription?: number;
    add?: boolean;
  };

  type MemberListItem = {
    id: number;
    parentId: number;
    parentName: string;
    name: string;
    pictureUrl: string;
    alias: string;
    spouseSurname: string;
    description: string;
    address: string;
    career: string;
    position: string;
    birthDate: string;
    deathDate: string;
    birthPlace: string;
    deathPlace: string;
  };
}
