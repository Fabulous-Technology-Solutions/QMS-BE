import httpStatus from "http-status";
import {  Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import * as roleService from "./manageRole.service";

export const createRoleController = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.createRole(req.body);
  return res.status(httpStatus.CREATED).send({
    success: true,
    data: role,
  });
});


export const updateRoleController = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.updateRole(req.params["roleId"] as string, req.body);
  return res.status(httpStatus.OK).send({
    success: true,
    data: role,
  });
});


export const deleteRoleController = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.deleteRole(req.params["roleId"] as string);
  return res.status(httpStatus.OK).send({
    success: true,
    data: role,
  });
}); 


export const getRoleByIdController = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.getRoleById(req.params["roleId"] as string);
  return res.status(httpStatus.OK).send({
    success: true,
    data: role,
  });
});

export const getWorkspaceRolesController = catchAsync(async (req: Request, res: Response) => {
  console.log("Fetching roles for workspace:", req.params["workspaceId"]);
  const roles = await roleService.getworkspaceRoles({ workspace: req.params["workspaceId"] as string, search: req.query["search"] as string, page: Number(req.query["page"]) || 1, limit: Number(req.query["limit"]) || 10 });
  return res.status(httpStatus.OK).send({
    success: true,
    data: roles,
  });
});   
export const getWorkspaceRoleNamesController = catchAsync(async (req: Request, res: Response) => {
  console.log("Fetching role names for workspace:", req.params["workspaceId"]);
  const roleNames = await roleService.getworkspacerolenames(req.params["workspaceId"] as string);
  return res.status(httpStatus.OK).send({
    success: true,
    data: roleNames,
  });
});   