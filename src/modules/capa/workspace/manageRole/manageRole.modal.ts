import mongoose from "mongoose";
import { IRoleModal } from "./manageRole.interfaces";
const RoleSchema = new mongoose.Schema<IRoleModal>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    permissions: { type: String, enum: ['view', 'edit', 'admin'] },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Capaworkspace', required: true },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

const RoleModel = mongoose.model<IRoleModal>('Role', RoleSchema);

export default RoleModel;
