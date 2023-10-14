import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  image: string;
  location: string;
  time: Date;
}

const eventSchema: Schema = new Schema<IEvent>({
  title: {
    type: String,
    required: true, 
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true, 
  },
  location: {
    type: String,
    required: true, 
  },
  time: {
    type: Date,
    required: true,
  },
});

export default mongoose.model<IEvent>('Event', eventSchema);
