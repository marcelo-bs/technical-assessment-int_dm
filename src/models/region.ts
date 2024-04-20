import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

interface IRegion extends Document {
  name: string;
  coordinates: number[];
  owner: IUser['_id'];
}

const RegionSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  coordinates: { type: [Number], index: '2dsphere' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model<IRegion>('Region', RegionSchema);