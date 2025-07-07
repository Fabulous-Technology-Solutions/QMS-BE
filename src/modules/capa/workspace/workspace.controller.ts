
import { workspaceService } from "./index";
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import AppiError from "../../errors/ApiError"


export const createCapaworkspaceController = catchAsync(async (req: Request, res: Response) => {
  const workspace = await workspaceService.createCapaworkspace({...req.body, createdBy: req.user._id});
  
  return res.status(httpStatus.CREATED).send({
    success: true,
    data: workspace,
  });
});


export const getAllCapaworkspacesController = catchAsync(async (req: Request, res: Response) => {
  const { Page = 1, Limit = 10 } = req.query;
  const workspaces = await workspaceService.getAllCapaworkspaces({
    moduleId: req.params["moduleId"] as string,
    user: req.user,
    Page: Page,
    Limit: Limit,
  });
  
  return res.status(httpStatus.OK).send({
    success: true,
    data: workspaces,
  });
});

export const getCapaworkspaceByIdController = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const workspace = await workspaceService.getCapaworkspaceById(req.params["workspaceId"] as string);
  if (!workspace) {
    return next(new AppiError("Workspace not found", httpStatus.NOT_FOUND));
  }
  
  return res.status(httpStatus.OK).send({
    success: true,
    data: workspace,
  });
});


export const updateCapaworkspaceController = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const workspace = await workspaceService.updateCapaworkspace(req.params["workspaceId"] as string, req.body);
  if (!workspace) {
    return next(new AppiError("Workspace not found", httpStatus.NOT_FOUND));
  }
  
  return res.status(httpStatus.OK).send({
    success: true,
    data: workspace,
  });
});

export const deleteCapaworkspaceController = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
  const workspace = await workspaceService.deleteCapaworkspace(req.params["workspaceId"] as string);
  if (!workspace) {
    return next(new AppiError("Workspace not found", httpStatus.NOT_FOUND));
  }
  
  return res.status(httpStatus.OK).send({
    success: true,
    message: "Workspace deleted successfully",
  });
});