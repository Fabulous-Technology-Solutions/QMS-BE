import siteServices from "./site.services"

import catchAsync from "../../utils/catchAsync"
import { Request, Response } from "express";
import {  IUserDoc } from "@/modules/user/user.interfaces";

const createSite = catchAsync(async (req:Request, res:Response) => {
  const site = await siteServices.createSiteService({ ...req.body , createdBy: req.user.id });
  res.status(201).json(site);
});

const updateSite = catchAsync(async (req:Request, res:Response) => {
  const site = await siteServices.updateSiteService(req.params["id"] as string, req.body,req.user);
  res.status(200).json(site);
});

const deleteSite = catchAsync(async (req:Request, res:Response) => {
  await siteServices.deleteSiteService(req.params["id"] as string,req.user);
  res.status(204).send();
});

const getSite = catchAsync(async (req:Request, res:Response) => {
  const site = await siteServices.getSiteService(req.params["id"] as string);
  res.status(200).json(site);
});

const getSitesByModule = catchAsync(async (req:Request, res:Response) => {
  const sites = await siteServices.getSiteServiceByModule(req.params["moduleId"] as string, req.query);
  res.status(200).json(sites);
});

const getSiteNamesByModule = catchAsync(async (req:Request, res:Response) => {
  const siteNames = await siteServices.getSiteServiceNamesByModule(req.params["moduleId"] as string);
  res.status(200).json(siteNames);
});

const getAllSites = catchAsync(async (req:Request, res:Response) => {
  const sites = await siteServices.getAllSitesService(req.query, req.user as IUserDoc);
  res.status(200).json(sites);
});

const getAllSitesNames = catchAsync(async (req:Request, res:Response) => {
  const siteNames = await siteServices.getAllSitesNamesService(req.user as IUserDoc);
  res.status(200).json(siteNames);
});

export {
  createSite,
  updateSite,
  deleteSite,
  getSite,
  getSitesByModule,
  getSiteNamesByModule,
  getAllSites,
  getAllSitesNames
};