import { Service, Inject } from 'typedi';
import { IMessageInputDTO } from '../interfaces/IMessage';
import { ObjectId } from 'mongoose';

@Service()
export default class messageService {

  constructor(
    @Inject('messageModel') private messageModel: Models.messageModel,
    @Inject('botModel') private botModel: Models.botModel,
    @Inject('userModel') private userModel: Models.UserModel,
    // private mailer: MailerService,
    @Inject('logger') private logger, // @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async createMessage(IMessageInputDTO: IMessageInputDTO): Promise<any> {


    try {
      const messageRecord = await this.messageModel.create({
        ...IMessageInputDTO,
      });
      if (!messageRecord) {
        throw new Error('Message not generated');
      }
      const user = messageRecord.toObject();

      return { user };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getCreateMessage(req:any, res:any): Promise<any> {
    try {
    const getmessage = await this.messageModel.find();
    if (!getmessage) {
      throw new Error('Message Not Found');
    }
    const getMessageSet = getmessage;

    return getMessageSet
    
    
  }
 catch (e) {
  this.logger.error(e);
  throw e;
}
  }

  public async deleteMessageSet(req: any, res: any, botId: any): Promise<any> {
    try {

      const userRecord1 = await this.messageModel.find({ botId });

      if (userRecord1.length > 0) {
        var userRecord;
        userRecord1.map(async item => {
          userRecord = await this.messageModel.findOneAndDelete({ botId: botId });

        });

        return true;
        // return res.status(201).send({ Message: 'user deleted successfully' });
      } else {
        return true;
      }
    } catch (e) {
      // this.logger.error(e);
      throw e;
    }
  }

  public async getByBotId(botId: any): Promise<any> {
    try {
      const getmessage = await this.messageModel.find({ botId: botId });
      if (!getmessage) {
        throw new Error('BotId Not found');
      }
      return getmessage;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async deleteById(req: any, res: any, _id: any): Promise<any> {
    try {

      const userRecord1 = await this.messageModel.findByIdAndDelete({ _id: _id });


      if (!userRecord1) {
        throw new Error('Already deleted');
      }
      const user = userRecord1.toObject();

      return user;
    } catch (e) {
      // this.logger.error(e);
      throw e;
    }
  }
}
