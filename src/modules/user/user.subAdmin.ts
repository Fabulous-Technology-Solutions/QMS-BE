import { ISubAdminDoc, IUserModel } from "./user.interfaces";
import User from "./user.model";
import mongoose from "mongoose";

const subAdminSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    adminOF: [{
        method: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription"
        },
        workspacePermissions: [{
            type: mongoose.Schema.Types.ObjectId,
            refPath: "adminOF.type"
        }]
    }],
    subAdminRole: {
        type: String,
        enum: ["subAdmin", "standardUser"],
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