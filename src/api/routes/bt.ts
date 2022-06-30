import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import btService from '../../services/bt';
import { IBtInputDTO } from '../../interfaces/IBt';
// import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
// import attachCurrentUser from '../middlewares/attachCurrentUser';
// import { limits } from 'argon2';
// import { join } from 'path';
// import isAuth from '../middlewares/isAuth';
// import messageSet from './messageSet';

const route = Router();

export default (app: Router) => {
  app.use('/bt', route);

  route.post(
    '/createBt',
    // middlewares.isAuth,
    celebrate({
      body: Joi.object({
        title: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling createBt endpoint with body: %o', req.body);
      try {
        const btServiceInstance = Container.get(btService);
        const user = await btServiceInstance.createbt(req.body as IBtInputDTO);
        return res.status(201).json(user);
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
    '/getBt',
    //  middlewares.isAuth,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling getBt endpoint with query: %o', req.query);
      try {
        const btServiceInstance = Container.get(btService);
        const getCreatBot = await btServiceInstance.getBt(req, res);

        if (!getCreatBot || getCreatBot.length == 0) {
          return res.status(200).json({ message: 'No Record found' });
        }
        return res.status(201).json({
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

  route.put(
    '/updateBtTable',
    // middlewares.isAuth,
    // middlewares.attachCurrentUser,
    celebrate({
      body: Joi.object({
        title: Joi.string(),
      }),
      query: Joi.object({
        _id: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling updateBtTable endpoint with body : %o', req.body);

      try {
        const btServiceInstance = Container.get(btService);
        var _id = req.query._id;

        var userdata1 = {};
        const user = await btServiceInstance.updateBtTable(req.body as IBtInputDTO, _id as any);
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
        });
      }
    },
  );

  route.delete(
    '/deleteBtById',
    celebrate({
      query: Joi.object({
        _id: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling deleteBtById endpoint with query ', req.query);
      try {
        var _id = req.query._id;

        const btServiceInstance = Container.get(btService);
        const user = await btServiceInstance.deleteBtById(req, res, _id);

        return res.status(201).json({
          status: true,
          data: user,
          message: 'Bt deleted succesfully',
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
    '/deleteAllBt',

    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling deleteBtById endpoint with query', req.query);
      try {
        const btServiceInstance = Container.get(btService);
        const user = await btServiceInstance.deleteAllBt();

        return res.status(201).json({
          status: true,
          data: user,
          message: 'Bt Record deleted succesfully',
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
