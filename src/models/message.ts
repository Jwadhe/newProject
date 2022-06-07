import { IMessageInputDTO } from '@/interfaces/IMessage';
import mongoose from 'mongoose';

const message = new mongoose.Schema(
  {
  botId: String,
  messageId: String,
  messageTitle: String,
  userId: String,
  title: String,
  mobile: String,

    // salt: String,

    role: {
      type: String,
      default: 'message',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IMessageInputDTO & mongoose.Document>('message', message);

