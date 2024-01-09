import { ObjectId } from "mongodb";

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  position: string;
  role: ObjectId;
}

