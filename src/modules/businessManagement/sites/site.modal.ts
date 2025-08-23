
import {SiteModal} from "./site.interfaces";
import mongoose from "mongoose";

const SiteSchema = new mongoose.Schema<SiteModal>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    timeZone: { type: String, required: true },
    siteCode: { type: String, required: true },
    note: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }],
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SiteModel = mongoose.model<SiteModal>('Site', SiteSchema);
export default SiteModel;
