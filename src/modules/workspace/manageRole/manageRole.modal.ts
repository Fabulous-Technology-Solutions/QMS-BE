import mongoose from "mongoose";
import { IRoleModal } from "./manageRole.interfaces";
const RoleSchema = new mongoose.Schema<IRoleModal>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    permissions: { type: String, enum: ['view', 'edit', 'w_admin'] },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    process:{ type: mongoose.Schema.Types.ObjectId, ref: 'Process' },
    site:{ type: mongoose.Schema.Types.ObjectId, ref: 'Site' },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

const RoleModel = mongoose.model<IRoleModal>('Role', RoleSchema);

export default RoleModel;
