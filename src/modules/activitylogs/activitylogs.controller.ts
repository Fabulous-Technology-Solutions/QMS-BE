import { catchAsync } from "../utils";

import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import { getlogsByid } from "./activitylogs.services";


export const getLogsByIdController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const options = {
    page: Number(req.query["page"]) || 1,
    limit: Number(req.query["limit"]) || 10,
  };

  try {
    const logs = await getlogsByid(id as string, options);
    res.status(httpStatus.OK).send({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
});
