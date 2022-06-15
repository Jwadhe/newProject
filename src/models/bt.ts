import { IBtInputDTO } from '../interfaces/IBt';
import mongoose from 'mongoose';

const bt = new mongoose.Schema(
  {

  title: String, 

    // salt: String,

    role: {
      type: String,
      default: 'bt',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IBtInputDTO & mongoose.Document>('bt', bt);

