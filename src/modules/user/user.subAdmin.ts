import { ISubAdminDoc, IUserModel } from "./user.interfaces";
import User from "./user.model";
import mongoose from "mongoose";

const subAdminSchema = new mongoose.Schema({
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true
    },
    adminOF: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Capaworkspace" 
    }],                                 
    subAdminRole:{
        type: String, 
        enum: ["subAdmin","standardUser"], 
        default: "subAdmin"
    },
    permissions: { 
        type: [String], 
        default: [] 
    }
});

const subAdmin = User.discriminator<ISubAdminDoc, IUserModel>(
    "subAdmin",
    subAdminSchema
);

export default subAdmin;