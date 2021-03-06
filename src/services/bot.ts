import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
// import config from '@/config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IBotInputDTO } from '../interfaces/IBot';
// import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
// import events from '@/subscribers/events';
import { throttle } from 'lodash';
import { ObjectId } from 'mongoose';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { resolve } from 'path';

@Service()
export default class botService {
  constructor(

    @Inject('botModel') private botModel: Models.botModel,
    @Inject('userModel') private userModel: Models.UserModel,
  
    // private mailer: MailerService,
    @Inject('logger') private logger, // @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async createbot(IBotInputDTO: IBotInputDTO): Promise<any> {
    try {
      const botRecord = await this.botModel.create({
        ...IBotInputDTO,
      });

      // if(botRecord){
      //   console.log('1>>>>>>>',botRecord);
      //   return { botRecord };
        
      // }else{
      //   console.log('2>>>>>>>>>>>');
      //   throw new Error('string not created');        
      // }

      const user = botRecord.toObject();
      return { user };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getCreateBot(): Promise<any> {
    const getRecord = await this.botModel.find();
    if (!getRecord) {
      throw new Error('no Bot found');
    }
    const getRecordbot = getRecord;

    return getRecordbot;
  }

  // public async getablejoin(): Promise<any> {
  //   var _id = "629edb962cc02447cce9ff5d"
  //   var allbot = await this.messageModel.find()


  //   const getRecord = await this.messageModel.aggregate([

  //       {
  //         $lookup: {
  //            from: "bots",
  //            localField: "boadId",
  //            foreignField: "_id",
  //            as: "messageSet"
  //         }
  //     },
  //     {
  //       $unwind: "$messageSet"
  //   },
  // ])



  //   // if (!getRecord) {
  //   //   throw new Error('no user found');
  //   // }
  //   const getRecordbot = getRecord;

  //   return  getRecordbot;
  // }

  public async updatebot(IBotInputDTO: IBotInputDTO, _id: any): Promise<any> {
    try {     
      const userRecord1 = await this.botModel.findByIdAndUpdate({ _id }, { $set: IBotInputDTO }, { new: true });
      return userRecord1;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }


  public async getBot(btId: any): Promise<any> {
    try {
      const getmessage = await this.botModel.find({ btId: btId });
      if (!getmessage) {
        throw new Error('no Bot found');
      }
      return getmessage;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getBotByBtId(btId: any): Promise<any> {
    try {
      console.log('btId',btId);
      
      const getmessage = await this.botModel.find({ btId: btId });
      console.log('>>>>>>1',getmessage);
      
      if (!getmessage) {
        throw new Error('BotByBtId not found');
      }
      return getmessage;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async deletebot(req: any, res: any, _id: any): Promise<any> {
    try {
      const userRecord = await this.botModel.findByIdAndDelete({ _id: _id });
      if (!userRecord) {
        throw new Error('Bot already deleted');
      }
      const user = userRecord.toObject();
      return user;
    } catch (e) {
      // this.logger.error(e);
      throw e;
    }
  }

  public async deleteAllBot(): Promise<any> {
    try {
     
        const userRecord1 = await this.botModel.find();
        var drop =   await this.botModel.collection.drop()      
        console.log('1',drop);        
     
          }catch (e) {
      // this.logger.error(e);
      throw new Error('Bot Record not deleted');
      throw e;
    }
  }
}
