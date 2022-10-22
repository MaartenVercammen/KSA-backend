export interface User {
  id: number;
  name: string;
  password: string;
  email: string;
  role: Roles;
}

export interface LeidingNummer {
  voornaam: string;
  achternaam: string;
  number: string;
  img: string;
}

export enum Roles {
  BRAGGEL = 'BRAGGEL',
  ADMIN = 'ADMIN',
  BONDS = 'BONDS',
}

export interface Post {
  id: number;
  title: string;
  content: string;
  date: Date;
}
