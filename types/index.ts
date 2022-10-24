export interface User {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role: string;
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
