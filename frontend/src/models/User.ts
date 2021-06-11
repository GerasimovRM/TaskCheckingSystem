export enum UserStatus {
  ACTIVE = 1,
  BLOCKED = 2,
  UNDEFINED = -1,
}

export default interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | undefined;
  vkId: string;
  status: UserStatus;
  avatar: string | undefined;
}
