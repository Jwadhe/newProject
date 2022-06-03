import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
// import AuthService from '@/services/auth';
import botService from '@/services/bot';
import { IBotInputDTO } from '@/interfaces/Ibot';
import { IUser } from '@/interfaces/IUser';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import attachCurrentUser from '../middlewares/attachCurrentUser';
import { limits } from 'argon2';
import { join } from 'path';
import isAuth from '../middlewares/isAuth';

const route = Router();

export default (app: Router) => {
    app.use('/bot', route);

    route.post(
        '/createbot',
        middlewares.isAuth,
        celebrate({
          body: Joi.object({
            // botId: Joi.string(),
            // userId: Joi.string().required(),
            title: Joi.string(),
            // mobile: Joi.string().max(10).required(),
            mobile: Joi.string()
          }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
          const logger: Logger = Container.get('logger');
          logger.debug('Calling createbot endpoint with body: %o', req.body);
          try {
            const botServiceInstance = Container.get(botService);
            const { user } = await botServiceInstance.createbot(req.body as IBotInputDTO);
            return res.status(201).json({ user});
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



      route.get('/getCreatBot',
      middlewares.isAuth,
      async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        logger.debug('Calling getCreatBot endpoint with body: %o', req.body);
        try {
          const botServiceInstance = Container.get(botService);
          const  getCreatBot  = await botServiceInstance.getCreatBot();
          return res
            .json({
              status: true,
              message: getCreatBot,
              
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
      });

      route.put(
        '/updatebot',
        middlewares.isAuth,
        middlewares.attachCurrentUser,
        celebrate({
          body: Joi.object({
            title: Joi.string(),
            mobile: Joi.string()
            
          }),
          query: Joi.object({
              botId: Joi.string()
          })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
          const logger: Logger = Container.get('logger');
          logger.debug('updatebot: %o', req.body);
    
          var currentUser = req.currentUser;
          console.log(currentUser);
          try {
            const botServiceInstance = Container.get(botService);
            var botId = req.query.botId
            var userdata1 = {};
            const user  = await botServiceInstance.updatebot(req.body as IBotInputDTO, botId as any);
            if(!user){
                return res.status(400).json({
                    status: true,
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


}