import AppiError from "../../../errors/ApiError";
import  catchAsync  from "../../../utils/catchAsync";
import httpStatus from "http-status";
import { getActionsByWorkspace } from "../library/action/action.service";
import { getLibrariesfilterData } from "../library/risklibrary.service";
import { Request, Response } from "express";

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