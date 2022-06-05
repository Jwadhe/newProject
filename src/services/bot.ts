import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '@/config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IBotInputDTO } from '@/interfaces/IBot';
import { IUser } from '@/interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import { throttle } from 'lodash';
import { ObjectId } from 'mongoose';

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
      var botuser = await this.botModel.find({
        botId: IBotInputDTO.botId,
      });
      console.log(botuser);

      const botRecord = await this.botModel.create({
        ...IBotInputDTO,
      });

      if (!botRecord) {
        throw new Error('User cannot be created');
      }

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
    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */

    const getRecordbot = getRecord;
    console.log('1',getRecordbot);
    

    return { getRecordbot };
  }

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
}
