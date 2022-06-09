import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import messageService from '@/services/messageSet';
import { IMessageInputDTO } from '@/interfaces/IMessage';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';

const route = Router();

export default (app: Router) => {
    app.use('/message', route);
  
    route.post(
      '/createMessage',
      middlewares.isAuth,
      celebrate({
        body: Joi.object({
          botId: Joi.string(),
          messageTitle: Joi.string(),
        }),
      }),

      async (req: Request, res: Response, next: NextFunction) => {
        const logger: Logger = Container.get('logger');
        logger.debug('Calling createMessage endpoint with body: %o', req.body);
        try {
          var botId=req.body.botId;
          console.log("-->>>BOAT ID-->>>",botId) 
          const messageServiceInstanceD = Container.get(messageService);
          const userD  = await messageServiceInstanceD.deleteMessageSet(req,res, botId);
          console.log("-->>>Message service-->>>",userD) 

          const messageServiceInstance = Container.get(messageService);
          const user = await messageServiceInstance.createMessage(req.body as IMessageInputDTO);
          return res.status(201).json (user);
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
  
    route.get('/getCreateMessage', middlewares.isAuth, async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');
      logger.debug('Calling getCreatBot endpoint with body: %o', req.body);
      try {
        const messageServiceInstance = Container.get(messageService);
        const getCreatBot = await messageServiceInstance.getCreateMessage();
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
          
          var botId  = req.body.botId;
          const messageServiceInstance = Container.get(messageService);
          const user  = await messageServiceInstance.deleteMessageSet(req,res, botId);
          
          return res.status(201).json({
            status: true,
            data: user,
            message: 'User deleted succesfully',
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
  };