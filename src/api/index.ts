import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import agendash from './routes/agendash';
import bot from './routes/bot';
import messageSet from './routes/messageSet';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	user(app);
	agendash(app);
	bot(app);
	messageSet(app);

	return app
}