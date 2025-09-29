import { workspaceService } from './index';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppiError from '../errors/ApiError';

import { getActionsByWorkspace } from '../capa/workspace/capalibrary/action/action.service';
import { generateFilterReport, getLibrariesfilterData } from '../capa/workspace/capalibrary/capalibrary.service';
import { generateFilterReport as generateReports } from '../risk/workspace/library/risklibrary.service';
import { accountServices } from '../account';
import { getSingleWorkspaceWithAccount } from '../account/account.services';

export const createCapaworkspaceController = catchAsync(async (req: Request, res: Response) => {
  const workspace = await workspaceService.createCapaworkspace({ ...req.body, user: req.user });
  res.locals['message'] = 'create workspace';
  res.locals['documentId'] = workspace._id || '';
  res.locals['collectionName'] = 'Workspace';
  res.locals['changes'] = workspace;
  res.locals['logof'] = req.body.moduleId || null;

  return res.status(httpStatus.CREATED).send({
    success: true,
    data: workspace,
  });
});

export const getAllCapaworkspacesController = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search } = req.query;
  console.log('Account ID:', req.headers['accountid']);
  // Authorization logic
  if (req.headers['subid']) {
    const workspaces = await accountServices.getModuleWorkspaces(
      req.headers['subid'] as string,
      req.params['moduleId'] as string,
      req.user._id,
      Number(page),
      Number(limit),
      req.query['search'] as string
    );
    return res.status(httpStatus.OK).send({
      success: true,
      data: workspaces,
    });
  }

  const workspaces = await workspaceService.getAllCapaworkspaces({
    moduleId: req.params['moduleId'] as string,
    user: req.user,
    Page: Number(page),
    Limit: Number(limit),
    search: search as string,
  });

  return res.status(httpStatus.OK).send({
    success: true,
    data: workspaces,
  });
});

export const getCapaworkspaceByIdController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let workspace;

  if (req.headers['accountid']) {
    workspace = await getSingleWorkspaceWithAccount(req.headers['accountid'] as string, req.params['workspaceId'] as string);
  }else{
    workspace = await workspaceService.getCapaworkspaceById(req.params['workspaceId'] as string);

  }

  if (!workspace) {
    return next(new AppiError('Workspace not found', httpStatus.NOT_FOUND));
  }

  return res.status(httpStatus.OK).send({
    success: true,
    data: workspace,
  });
});

export const updateCapaworkspaceController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const workspace = await workspaceService.updateCapaworkspace(req.params['workspaceId'] as string, req.body);
  if (!workspace) {
    return next(new AppiError('Workspace not found', httpStatus.NOT_FOUND));
  }
  res.locals['message'] = 'update workspace';
  res.locals['documentId'] = workspace._id || '';
  res.locals['collectionName'] = 'Workspace';
  res.locals['changes'] = workspace;
  res.locals['logof'] = workspace.moduleId || null;

  return res.status(httpStatus.OK).send({
    success: true,
    data: workspace,
  });
});

export const deleteCapaworkspaceController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const workspace = await workspaceService.deleteCapaworkspace(req.params['workspaceId'] as string);
  if (!workspace) {
    return next(new AppiError('Workspace not found', httpStatus.NOT_FOUND));
  }
  res.locals['message'] = 'delete workspace';
  res.locals['documentId'] = workspace._id || '';
  res.locals['collectionName'] = 'Workspace';
  res.locals['changes'] = { isDeleted: true };
  res.locals['logof'] = workspace.moduleId || null;

  return res.status(httpStatus.OK).send({
    success: true,
    message: 'Workspace deleted successfully',
  });
});

export const getCapaworkspaceAnalyticsController = catchAsync(async (req: Request, res: Response) => {
  const analytics = await workspaceService.dashboardAnalytics(req.params['workspaceId'] as string);
  return res.status(httpStatus.OK).send({
    success: true,
    data: analytics,
  });
});
export const AttentionController = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, search = '', filterData } = req.query;

  if (!filterData) {
    throw new AppiError('Filter data is required', httpStatus.BAD_REQUEST);
  }
  console.log('Filter data:', filterData);
  if (filterData === 'action') {
    const actions = await getActionsByWorkspace(
      req.params['workspaceId'] as string,
      Number(page),
      Number(limit),
      search as string
    );
    res.status(200).json(actions);
  } else if (filterData === 'library') {
    const libraries = await getLibrariesfilterData(
      req.params['workspaceId'] as string,
      Number(page),
      Number(limit),
      search as string
    );
    res.status(200).json(libraries);
  } else {
    throw new AppiError('Invalid filter data', httpStatus.BAD_REQUEST);
  }
});

export const filterPreviewReportController = catchAsync(async (req: Request, res: Response) => {
  const { site, process, status } = req.query;
  const report = await generateFilterReport(
    req.params['workspaceId'] as string,
    site as string,
    process as string,
    status as string
  );
  res.status(200).json({ report, success: true });
});
export const filterPreviewRiskReportController = catchAsync(async (req: Request, res: Response) => {
  const { site, process, status } = req.query;
  const report = await generateReports(
    req.params['workspaceId'] as string,
    site as string,
    process as string,
    status as string
  );
  res.status(200).json({ report, success: true });
});
