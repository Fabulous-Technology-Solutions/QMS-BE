import processServices from "./process.services";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { IUserDoc } from "@/modules/user/user.interfaces";

const createProcess = catchAsync(async (req: Request, res: Response) => {
  const process = await processServices.createProcessService({ 
    ...req.body, 
    createdBy: req.user.id 
  });
  res.status(201).json(process);
});

const updateProcess = catchAsync(async (req: Request, res: Response) => {
  const process = await processServices.updateProcessService(
    req.params["id"] as string, 
    req.body,
    req.user as IUserDoc
  );
  res.status(200).json(process);
});

const deleteProcess = catchAsync(async (req: Request, res: Response) => {
  await processServices.deleteProcessService(
    req.params["id"] as string,
    req.user as IUserDoc
  );
  res.status(204).send();
});

const getProcess = catchAsync(async (req: Request, res: Response) => {
  const process = await processServices.getProcessService(req.params["id"] as string);
  res.status(200).json(process);
});

const getAllProcesses = catchAsync(async (req: Request, res: Response) => {
  const processes = await processServices.getAllProcessesService(
    req.query,
    req.user as IUserDoc
  );
  res.status(200).json(processes);
});

const getProcessesByModule = catchAsync(async (req: Request, res: Response) => {
  const processes = await processServices.getProcessByModuleIdService(
    req.params["moduleId"] as string,
    req.query
  );
  res.status(200).json(processes);
});

const getProcessNamesByModule = catchAsync(async (req: Request, res: Response) => {
  const processNames = await processServices.getProcessNamesByModuleService(
    req.params["moduleId"] as string
  );
  res.status(200).json(processNames);
});

const getProcessesBySite = catchAsync(async (req: Request, res: Response) => {
  const processes = await processServices.getProcessesBySiteService(
    req.params["siteId"] as string,
    req.query
  );
  res.status(200).json(processes);
});

export {
  createProcess,
  updateProcess,
  deleteProcess,
  getProcess,
  getAllProcesses,
  getProcessesByModule,
  getProcessNamesByModule,
  getProcessesBySite
};