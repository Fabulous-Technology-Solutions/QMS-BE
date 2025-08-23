import {  IUserDoc } from "@/modules/user/user.interfaces";
import {createSite, SiteQuery, PaginationOptions, PaginatedResponse, SiteModal as ISiteModal} from "./site.interfaces";
import  SiteModal from "./site.modal";

const createSiteService = async (siteData: createSite) => {
  const newSite = new SiteModal(siteData);
  return await newSite.save();
};

const updateSiteService = async (siteId: string, siteData: Partial<createSite>, user?: IUserDoc) => {
  const query: SiteQuery = { _id: siteId };

  if (user && user.role === 'admin') {
    query.createdBy = user._id;
  } else if (user && user.role === 'sub-admin') {
    query.createdBy = user.createdBy;
  } else {
    throw new Error("Unauthorized");
  }

  return await SiteModal.findOneAndUpdate(query, siteData, { new: true });
};

const deleteSiteService = async (siteId: string, user?: IUserDoc) => {
  const query: SiteQuery = { _id: siteId };

  if (user && user.role === 'admin') {
    query.createdBy = user._id;
  } else if (user && user.role === 'sub-admin') {
    query.createdBy = user.createdBy;
  } else {
    throw new Error("Unauthorized");
  }

  return await SiteModal.findOneAndDelete(query);
};

const getSiteService = async (siteId: string) => {
  return await SiteModal.findById(siteId);
};

const getSiteServiceByModule = async (
    moduleId: string,
    options?: PaginationOptions
): Promise<PaginatedResponse<ISiteModal>> => {
    const { page = 1, limit = 10, search = "" } = options || {};
    const query: SiteQuery = { modules: { $in: [moduleId] } };

    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    const sites = await SiteModal.find(query)
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await SiteModal.countDocuments(query);

    return {
        data: sites,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
const getSiteServiceNamesByModule = async (moduleId: string) => {
  return await SiteModal.find({ modules: { $in: [moduleId] } }).select("name");
};

const getAllSitesService = async (options?: PaginationOptions, user?: IUserDoc): Promise<PaginatedResponse<ISiteModal>> => {
  const { page = 1, limit = 10, search = "" } = options || {};
  const query: SiteQuery = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (user && user.role === 'admin') {
    query.createdBy = user._id;
  }else if (user && user.role === 'sub-admin') {
    query.createdBy = user.createdBy;
  }else{
    throw new Error("Unauthorized");
  }

  const sites = await SiteModal.find(query).populate({
  path: "modules",          // first populate modules
  populate: {
    path: "planId",         // then populate planId inside modules
    select: "name price",   // choose fields from planId (optional)
  },
  select: "_id",  // choose fields from modules (optional)
})
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await SiteModal.countDocuments(query);

  return {
    data: sites,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export default {
  createSiteService,
  updateSiteService,
  deleteSiteService,
  getSiteService,
  getSiteServiceByModule,
  getSiteServiceNamesByModule,
  getAllSitesService
};