import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  address: string;
  coordinates: number[];
}

const UserSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  coordinates: { type: [Number], index: '2d' },
});

export default mongoose.model<IUser>('User', UserSchema);