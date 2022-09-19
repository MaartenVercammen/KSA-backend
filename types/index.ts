export interface user {
  id: number;
  naam: string;
  password: string;
  email: string;
  role: Roles
}

export interface leidingNummer {
  naam: string;
  number: string;
  img: string;
}

export interface baseResponse{
  type: string;
  object: object;
}

export enum Roles{
  GUEST,
  ADMIN,
  MODERATOR
}