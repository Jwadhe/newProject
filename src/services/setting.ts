import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
// import config from '@/config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { ISettingInputDTO } from '../interfaces/ISetting';
import { ObjectId } from 'mongoose';
import { Request } from 'express';

@Service()
export default class settingService {
  constructor(
    @Inject('settingModel') private settingModel: Models.settingModel,

    // private mailer: MailerService,
    @Inject('logger') private logger, // @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) { }

  public async createSetting(ISettingInputDTO: ISettingInputDTO): Promise<any> {
    try {
      var settingUser = await this.settingModel.find({
        ...ISettingInputDTO,
      });

      const settingRecord = await this.settingModel.create({
        ...ISettingInputDTO,
      });

      if (!settingRecord) {
        throw new Error('Setting cannot be created');
      }

      const user = settingRecord.toObject();
      return { user };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getCreateSetting(mobile: any): Promise<any> {
    try {
      const getmessage = await this.settingModel.findOne({ mobile: mobile });

      if (!getmessage) {
        throw new Error('no mobile found');
      }
      // const getMessageSet = getmessage;

      return getmessage;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updateSettingTable(ISettingInputDTO: ISettingInputDTO, _id: any): Promise<any> {
    try {
      const settingRecord1 = await this.settingModel.findByIdAndUpdate(
         _id ,
        {...ISettingInputDTO },
        { new: true },
      );

      // var settingRecord2 = await this.settingModel.findById({ _id },)
      // console.log('>>>>>>>>',settingRecord2);
      

      return settingRecord1;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async deleteAllSetting(): Promise<any> {
    try {
     
        const SettingRecord = await this.settingModel.find();
        var drop =   await this.settingModel.collection.drop()      
        console.log('1',drop);        
     
          }catch (e) {
      // this.logger.error(e);
      throw new Error('Setting Record not deleted');
      throw e;
    }
  }

  
}
 