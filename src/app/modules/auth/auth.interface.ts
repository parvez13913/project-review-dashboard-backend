import { Role } from "../../../generated/prisma/enums";


export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface IJwtPayload {
  userId: string;
  email: string;
  role: Role;
}

