export interface user {
  id: number;
  name: string;
  password: string;
  email: string;
  role: Roles;
}

export interface leidingNummer {
  voornaam: string;
  achternaam: string;
  number: string;
  img: string;
}

export interface baseResponse {
  type: string;
  object: object;
}

export enum Roles {
  BRAGGEL = "BRAGGEL",
  ADMIN = "ADMIN",
  BONDS = "BONDS",
}
