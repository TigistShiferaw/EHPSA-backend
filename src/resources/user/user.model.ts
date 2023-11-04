import mongoose, { Schema } from "mongoose";

export interface IUserInterface {
  email: String;
  password: String;
  firstName: String;
  lastName: String;
  studentIdURL: String | null; // required if membership type is student
  university: string | null; // required if membership type is student
  membershipType: "student" | "associate" | "professional" | null;
  volunteeringInterest: boolean;
  community: string | null;
  phone: string | null; // required if member or volunteer
  dateOfBirth: Date | null; // required if member or volunteer
  profilePicture: string | null; // required if member or volunteer
  resume: string | null; // required if volunteer
  relevantDocuments: string[] | null;
  city: string;
  subcity: string;
  referredBy: string;
  registeredEvent: Schema.Types.ObjectId;
}

const userSchema: Schema<IUserInterface> = new mongoose.Schema({
  email: {
    type: String,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },

  firstName: {
    type: String,
    Required: true,
  },

  lastName: {
    type: String,
    Required: true,
  },

  studentIdURL: {
    type: String,
    default:
      "https://asset.cloudinary.com/dyzhbjom8/003bd3fbf79d8fb1d5fc59cac514c0b3",
    Required: false,
  },
  university: {
    type: String,
  },
  membershipType: {
    type: String,
    enum: ["student", "associate", "professional"],
  },
  volunteeringInterest: {
    type: Boolean,
  },
  community: {
    type: String,
  },
  phone: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  resume: {
    type: String,
  },
  relevantDocuments: [String],
    city: {
        type: String,
    },
    subcity: {
        type: String,
    },
    referredBy: {
        type: String,
    },
    registeredEvent: {
        type: Schema.Types.ObjectId,
        ref: "Event",
    },
});

export const User = mongoose.model<IUserInterface>("User", userSchema);
