import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '@/config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IBotInputDTO } from '@/interfaces/IBot';
import { IMessageInputDTO } from '@/interfaces/IMessage';
import { IUser } from '@/interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import { throttle } from 'lodash';
import { ObjectId } from 'mongoose';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

@Service()
export default class messageService {
  constructor(
    @Inject('messageModel') private messageModel: Models.messageModel,
    @Inject('userModel') private userModel: Models.UserModel,
    // private mailer: MailerService,
    @Inject('logger') private logger, // @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async createMessage(IMessageInputDTO: IMessageInputDTO): Promise<any> {
    console.log('0',IMessageInputDTO);
    
    try {
      var messageUser = await this.messageModel.find({
        messageId: IMessageInputDTO.messageId,
      });
      console.log('1',messageUser);

      const messageRecord = await this.messageModel.create({
        ...IMessageInputDTO,
      });

      if (!messageRecord) {
        throw new Error('User message cannot be created');
      }

      const user = messageRecord.toObject();
      return { user };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

//   public async getCreateBot(): Promise<any> {
//     const getRecord = await this.botModel.find();
//     if (!getRecord) {
//       throw new Error('no user found');
//     }
//     const getRecordbot = getRecord;
//     console.log('1',getRecordbot); 
//     return { getRecordbot };
//   }

//   public async updatebot(IBotInputDTO: IBotInputDTO, _id: any): Promise<any> {
//     try {
//       console.log(_id);

//       const userRecord1 = await this.botModel.findByIdAndUpdate({ _id }, { $set: IBotInputDTO }, { new: true });

//       // const usermodel = await this.botModel.find()
//       console.log('1', userRecord1);

//       return userRecord1;
//     } catch (e) {
//       this.logger.error(e);
//       throw e;
//     }
//   }

//   public async deletebot(req: any,res:any,_id: any,): Promise<any> {
//     try {
//       console.log('1',_id);
//     //   const userRecord1 = await this.botModel.findOne({ _id });
//     //   console.log('2',userRecord1)
//     //   if (!userRecord1) {
//     //     throw new Error('user not found');
//     //   }
      
//       const userRecord = await this.botModel.findByIdAndDelete({ _id });
//         console.log('2',userRecord);
        
//       if (!userRecord) {
//         throw new Error('User not registered');
//       }

//       return res.status(200).send({ Message: 'user deleted successfully' });
//     } catch (e) {
//       // this.logger.error(e);  
//       throw e;
//     }
//   }
}