import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import settingService from '@/services/setting';
import { ISettingInputDTO } from '@/interfaces/ISetting';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import { join } from 'path';



const route = Router();

export default (app: Router) => {
  app.use('/setting', route);

  route.post(
    '/createSetting',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        // isCalledReply: Joi.boolean(),
        // isSmsReply: Joi.boolean(),
        // isMmsReply: Joi.boolean(),
        delayResponse: Joi.number(),
        inActiveTimes: Joi.number(),
        disconnectTimes: Joi.number(),
        reativeUser: Joi.number(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling createbot endpoint with body: %o', req.body);
      try {
        const settingServiceInstance = Container.get(settingService);
        const { user } = await settingServiceInstance.createSetting(req.body as ISettingInputDTO);
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


  route.put(
    '/updateSettingTable',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      body: Joi.object({
        delayResponse: Joi.number(),
        inActiveTimes: Joi.number(),
        disconnectTimes: Joi.number(),
        reativeUser: Joi.number(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('updateSettingTable: %o', req.body);

  
      try {
        var currentUser = req.currentUser3
        const settingServiceInstance = Container.get(settingService);
        var _id = req.body._id;
        var userdata1 = {};
        const user = await settingServiceInstance.updateSettingTable(req.body as ISettingInputDTO, currentUser._id );
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



};

