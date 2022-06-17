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
    @Inject('btModel') private btModel: Models.btModel,
    @Inject('botModel') private botModel: Models.botModel,
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('messageModel') private messageModel: Models.messageModel,
    // private mailer: MailerService,
    @Inject('logger') private logger, // @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async createbot(IBotInputDTO: IBotInputDTO): Promise<any> {
    try {
      var botuser = await this.botModel.findOne({
        title: IBotInputDTO.title,
      });
      if (botuser) {
        throw new Error('Bot already created');
      }

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
      throw new Error('no user found');
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
      console.log(_id);

      const userRecord1 = await this.botModel.findByIdAndUpdate({ _id }, { $set: IBotInputDTO }, { new: true });

      // const usermodel = await this.botModel.find()
      console.log('1', userRecord1);

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
        throw new Error('no user found');
      }
      return getmessage;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getBotByBtId(btId: any): Promise<any> {
    try {
      const getmessage = await this.botModel.find({ btId: btId });
      if (!getmessage) {
        throw new Error('no user found');
      }
      return getmessage;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async deletebot(req: any, res: any, _id: any): Promise<any> {
    try {
      //   console.log('1',_id);

      const userRecord = await this.botModel.findByIdAndDelete({ _id: _id });
      //   console.log('2',userRecord);

      if (!userRecord) {
        throw new Error('User already deleted');
      }
      const user = userRecord.toObject();

      return user;
    } catch (e) {
      // this.logger.error(e);
      throw e;
    }
  }
}
