
import mongoose, { Schema } from 'mongoose'

export interface IUserInterface {
     _id: any;
    email: String;
    isVerified : boolean;
    password: String;
    firstName: String;
    lastName: String;
    studentIdURL: String | null; // required if membership type is student
    university: string | null; // required if membership type is student
    membershipType: 'student' | 'associate' | 'professional' | null;
    membershipStartDate:Date
    membershipExpireDate:Date
    membershipDescription:String
    volunteeringInterest: boolean;
    community: string | null;
    phone: string | null; // required if member or volunteer
    dateOfBirth: Date | null; // required if member or volunteer
    profilePicture: string | null; // required if member or volunteer
    resume: string | null; // required if volunteer
    relevantDocuments: string[] | null;
    role: string;
}

const userSchema: Schema<IUserInterface> = new mongoose.Schema({
    email: {
        type: String,
    },

    isVerified : {
        type: Boolean,
        default: false
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024,
    },

    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    studentIdURL: {
        type: String,
        default:
            'https://asset.cloudinary.com/dyzhbjom8/003bd3fbf79d8fb1d5fc59cac514c0b3',
        required: false,
    },

    university: {
        type: String,
    },

    membershipType: {
        type: String,
        enum: ['student', 'associate', 'professional'],
    },
    membershipDescription:{
        type:String,
        required:false
    },
    membershipExpireDate: {
        type: Date,
        required: false,
        default: function() {
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() + 3);
            return currentDate;
        }
    },    
    membershipStartDate:{
        type:Date,
        required:false,
        default:Date.now()
    },
    volunteeringInterest: {
        type: Boolean,
        required:false,
        default:false
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

    role: {
        type: String,
        enum: ['superadmin', 'admin', 'user'],
        default: 'user',
    },
});



export const User = mongoose.model<IUserInterface>('User', userSchema);