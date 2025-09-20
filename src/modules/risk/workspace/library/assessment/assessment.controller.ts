import * as AssessmentServices from "./assessment.services";
import { Request, Response } from "express";
import  catchAsync  from "../../../../utils/catchAsync";

export const create = catchAsync(async (req: Request, res: Response) => {
    const assessment = await AssessmentServices.createAssessment({
        ...req.body,
        createdBy: req.user._id
    });
    res.locals["message"] = "create assessment"
    res.locals["documentId"] = assessment._id;
    res.locals["collectionName"] = "RiskAssessment";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null; 
    res.locals["changes"] = assessment;
    res.status(201).json(assessment);
});

export const getById = catchAsync(async (req: Request, res: Response) => {
    const assessment = await AssessmentServices.getAssessmentById(req.params["assessmentId"] || '');

    res.status(200).json(assessment);
});

export const update = catchAsync(async (req: Request, res: Response) => {
    const assessment = await AssessmentServices.updateAssessment(req.params["assessmentId"] || '', req.body);
    res.locals["message"] = "update assessment"
    res.locals["documentId"] = assessment._id;
    res.locals["collectionName"] = "RiskAssessment";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null; 
    res.locals["changes"] = assessment;
    res.status(200).json(assessment);
});
export const deleteObj= catchAsync(async (req: Request, res: Response) => {
    const assessment = await AssessmentServices.deleteAssessment(req.params["assessmentId"] || '');
    res.locals["message"] = "delete assessment"
    res.locals["documentId"] = assessment._id;
    res.locals["collectionName"] = "RiskAssessment";
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null; 
    res.locals["changes"] = assessment;
    res.status(200).json(assessment);
});
export const getByLibrary = catchAsync(async (req: Request, res: Response) => {
    const { libraryId } = req.params;
    const { search = '', page = 1, limit = 10 } = req.query;
    const assessments = await AssessmentServices.getAssessmentsByLibrary(libraryId as string, Number(page), Number(limit), search as string);
    res.status(200).json(assessments);
});
export const getMonthlyAssessmentData = catchAsync(async (req: Request, res: Response) => {
    const { libraryId } = req.params;
    const year = parseInt(req.query['year'] as string) || new Date().getFullYear();
    const data = await AssessmentServices.getMonthlyAssessmentData(libraryId as string, year);
    res.status(200).json({ success: true, data });
});