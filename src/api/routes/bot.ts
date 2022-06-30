import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import botService from '../../services/bot';
import messageService from '../../services/messageSet';
import { IBotInputDTO } from '../../interfaces/IBot';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import attachCurrentUser from '../middlewares/attachCurrentUser';
import { limits } from 'argon2';
import { join } from 'path';
import isAuth from '../middlewares/isAuth';
import messageSet from './messageSet';

const route = Router();

export default (app: Router) => {
  app.use('/bot', route);

  route.post(
    '/createbot',
    // middlewares.isAuth,
    celebrate({
      body: Joi.object({
        title: Joi.string(),
        mobile: Joi.string(),
        btId: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling createbot endpoint with body: %o', req.body);
      try {
        const botServiceInstance = Container.get(botService);
        const { user } = await botServiceInstance.createbot(req.body as IBotInputDTO);
        return res.status(201).json({ user });
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
    '/getCreateBot',
    //  middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling getCreatBot endpoint with body: %o', req.body);
      try {
        const botServiceInstance = Container.get(botService);
        const messageServiceInstance = Container.get(messageService);
        const getCreatBot = await botServiceInstance.getCreateBot();
        const getMessageSet = await messageServiceInstance.getCreateMessage(req , res);

        const botData = [];
        getCreatBot.map(item => {
          const { role, _id, title, mobile, createdAt, updatedAt } = item;

          const msgSetData = [];
          getMessageSet.map(itm => {
            const { role, messageTitle, botId, createdAt, updatedAt } = itm;
            if (_id == botId) {
              msgSetData.push(itm);
            }
          });

          let body = {
            role,
            _id,
            title,
            mobile,
            createdAt,
            updatedAt,
            messageSet: msgSetData,
          };
          botData.push(body);
        });
        // const gettable = await botServiceInstance.getablejoin();

        return res
          .json({
            status: true,
            message: botData,
          })
          .status(200);
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
    '/updatebot',
    // middlewares.isAuth,
    // middlewares.attachCurrentUser,
    celebrate({
      body: Joi.object({
        title: Joi.string(),
        mobile: Joi.string(),
      }),
      query: Joi.object({
        botId: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling updatebot endpoint with body: %o', req.body);

      var currentUser = req.currentUser;
      console.log(currentUser);
      try {
        const botServiceInstance = Container.get(botService);
        var botId = req.query.botId;
        var userdata1 = {};
        const user = await botServiceInstance.updatebot(req.body as IBotInputDTO, botId as any);
        if (!user) {
          return res.status(400).json({
            status: false,
            message: 'unable to update',
          });
        }
        return res.status(201).json({
          status: true,
          data: user,
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

  route.get(
    '/getBot',
    // middlewares.isAuth,
    celebrate({
      query: Joi.object({
        btId: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling getBot endpoint with query: %o', req.query);

      try {
        var btId = req.query.btId;
        console.log('btId1>>>>>>>>>>>', btId);

        const botServiceInstance = Container.get(botService);
        const messageServiceInstance = Container.get(messageService);

        const getBt = await botServiceInstance.getBot(btId as any);
        const getMessageSet = await messageServiceInstance.getCreateMessage(req , res);

        const botData = [];
        getBt.map(async item => {
          const { role, _id, title, mobile, createdAt, updatedAt, btId } = item;

          const msgSetData = [];
          getMessageSet.map(async itm => {
            const { role, messageTitle, botId, createdAt, updatedAt } = itm;
            if (_id == botId) {
              msgSetData.push(itm);
            }
          });

          let body = {
            role,
            _id,
            title,
            mobile,
            createdAt,
            updatedAt,
            btId,
            messageSet: msgSetData,
          };
          botData.push(body);
        });
        return res
          .json({
            status: true,
            message: botData,
          })
          .status(201);
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
    '/getBotByBtId',
    // middlewares.isAuth,
    celebrate({
      query: Joi.object({
        btId: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling getBotByBtId endpoint with query: %o', req.query);

      try {
        var btId = req.query.btId;
        console.log('1', btId);
        
        const botServiceInstance = Container.get(botService);
        const getBt = await botServiceInstance.getBotByBtId(btId as any);
        console.log('2',getBt);
        

        return res.status(201).send({
          status: true,
          message: getBt,
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
    '/deletebot',
    celebrate({
      query: Joi.object({
        _id: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling deleteBtById endpoint with query', req.query);
      try {
        var _id = req.query._id;
        const btServiceInstance = Container.get(botService);
        const user = await btServiceInstance.deletebot(req, res, _id);
        return res.status(201).json({
          status: true,
          data: user,
          message: 'Bot deleted succesfully',
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
    '/deleteAllBot',

    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling deleteAllBot endpoint with query', req.query);
      try {
        const btServiceInstance = Container.get(botService);
        const user = await btServiceInstance.deleteAllBot();

        return res.status(201).json({
          status: true,
          data: user,
          message: 'Bot Record deleted succesfully',
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
};
