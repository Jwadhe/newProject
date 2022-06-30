import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import messageService from '../../services/messageSet';
import { IMessageInputDTO } from '../../interfaces/IMessage';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
  app.use('/message', route);

  route.post(
    '/createMessage',
    // middlewares.isAuth,
    // celebrate({
    //   body: Joi.object({
    //     // { msgList: [{botId: Joi.string(), messageTitle:Joi.string()}]}
    //   }),
    // }),

    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling createMessage endpoint with body: %o', req.body.msgList);

      try {
        var msgList = req.body.msgList;
        var botId = req?.body?.msgList?.[0]?.botId;

        const messageServiceInstanceD = Container.get(messageService);
        const userD = await messageServiceInstanceD.deleteMessageSet(req, res, botId);

        const messageServiceInstance = Container.get(messageService);
        msgList.map(async item => {
          await messageServiceInstance.createMessage(item as IMessageInputDTO);
        });
        
        return res.status(201).json({ message: 'Message created successfully' });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return res.status(200).send({
          status: false,
          message: e.message,
          error: e,
        });
      }
    },
  );

  route.get(
    '/getCreateMessage',
    //  middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling getCreateMessage endpoint with body: %o', req.body);
      try {
        const messageServiceInstance = Container.get(messageService);
        const getCreatBot = await messageServiceInstance.getCreateMessage(req , res);
        return res.status(201).send({
          status: true,
          message: getCreatBot,
        });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return res.status(200).send({
          status: false,
          message: e.message,
          error: e,
        });
      }
    },
  );

  route.post(
    '/deleteMessageSet',
    celebrate({
      body: Joi.object({
        botId: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      // const logger: Logger = Container.get('logger');
      // logger.debug('Calling Sign-In endpoint with body: %o', req.body);
      try {
        var botId = req.body.botId;
        const messageServiceInstance = Container.get(messageService);
        const user = await messageServiceInstance.deleteMessageSet(req, res, botId);

        return res.status(201).json({
          status: true,
          data: user,
          message: 'MessageSet deleted succesfully',
        });
      } catch (e) {
        // logger.error('🔥 error: %o', e);
        return res.status(200).send({
          status: false,
          message: e.message,
          //   error: e,
        });
      }
    },
  );

  route.get(
    '/getByBotId',
    // middlewares.isAuth,
    celebrate({
      query: Joi.object({
        botId: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling getByBotId endpoint with query: %o', req.query);

      try {
        var botId = req.query.botId;

        const messageServiceInstance = Container.get(messageService);
        const getByBotId = await messageServiceInstance.getByBotId(botId as any);
        return res.status(201).send({
          status: true,
          message: getByBotId,
        });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return res.status(200).send({
          status: false,
          message: e.message,
          error: e,
        });
      }
    },
  );

  route.delete(
    '/deleteById',
    celebrate({
      query: Joi.object({
        _id: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling deleteById endpoint with query: %o', req.query);
      try {
        var _id = req.query._id;

        const messageServiceInstance = Container.get(messageService);
        const user = await messageServiceInstance.deleteById(req, res, _id);

        return res.status(201).json({
          status: true,
          data: user,
          message: 'User deleted succesfully',
        });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return res.status(200).send({
          status: false,
          message: e.message,
          error: e,
        });
      }
    },
  );

  route.delete(
    '/deleteAllMessageSet',

    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling deleteAllMessageSet endpoint with query', req.query);
      try {
        const btServiceInstance = Container.get(messageService);
        const user = await btServiceInstance.deleteAllMessageSet();

        return res.status(201).json({
          status: true,
          data: user,
          message: 'MessageSet Record deleted succesfully',
        });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return res.status(200).send({
          status: false,
          message: e.message,
          error: e,
        });
      }
    },
  );

  route.put(
    '/updateMessageSet',
    // middlewares.isAuth,
    // middlewares.attachCurrentUser,
    // celebrate({
    // body: Joi.object({
    // title: Joi.string(),
    // botId:Joi.string(),
    // msgList:Joi.string(),
    // }),
    // query: Joi.object({
    // _id: Joi.string(),
    // }),
    // }),
    async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    logger.debug('updateMessageSet: %o', req.body);
    
    try {
    const messageServiceInstance = Container.get(messageService);
    var _id = req.query._id;
    var userdata1 = {};
    const user = await messageServiceInstance.updateMessageSet(req.body as IMessageInputDTO, _id as any);
    if (!user) {
    return res.status(400).json({
    status: false,
    message: 'user not update',
    });
    }
    return res.status(201).json({
    status: true,
    data: user,
    message: 'user updated successfully',
    });
    } catch (e) {
    logger.error('🔥 error: %o', e);
    return res.status(200).send({
    status: false,
    message: e.message,
    error: e,
    });}},);
};
