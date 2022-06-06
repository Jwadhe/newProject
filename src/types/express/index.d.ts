import { Document, Model } from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { IBotInputDTO } from '@/interfaces/Ibot';
declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
      currentUser1: IBotInputDTO & Document;
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;

    export type botModel = Model<Document>;
  }
}
