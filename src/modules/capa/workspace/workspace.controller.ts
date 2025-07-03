
import { workspaceService } from "./index";
import httpStatus from "http-status";
import { Request, Response } from "express";
import  catchAsync  from "../../utils/catchAsync";


export const createCapaworkspaceController = catchAsync(async (req: Request, res: Response) => {
  const workspace = await workspaceService.createCapaworkspace({...req.body, createdBy: req.user._id});
  res.status(httpStatus.CREATED).send({
    success: true,
    data: workspace,
  });
});



