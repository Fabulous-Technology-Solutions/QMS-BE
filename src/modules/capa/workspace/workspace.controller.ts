
import { workspaceService } from "./index";
import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";


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
    moduleId: req.query["moduleId"] as string,
    user: req.user,
    Page: Page,
    Limit: Limit,
  });
  
  return res.status(httpStatus.OK).send({
    success: true,
    data: workspaces,
  });
});

export const getCapaworkspaceByIdController = catchAsync(async (req: Request, res: Response) => {
  const workspace = await workspaceService.getCapaworkspaceById(req.params["workspaceId"] as string);
  if (!workspace) {
    return res.status(httpStatus.NOT_FOUND).send({
      success: false,
      message: "Workspace not found",
    });
  }
  
  return res.status(httpStatus.OK).send({
    success: true,
    data: workspace,
  });
});
