import { Document, Model } from 'mongoose';
import { IUser } from '@/interfaces/IUser';
import { IBotInputDTO } from '@/interfaces/IBot';
import { IMessageInputDTO} from '@/interfaces/IMessage';

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
      currentUser1: IBotInputDTO & Document;
      // currentUser2: IMessageInputDTO & Document;
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type botModel = Model<Document>;
    export type messageModel = Model<Document>;
  }
}
