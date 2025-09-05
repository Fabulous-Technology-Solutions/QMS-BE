import * as ConsequenceService from './consequence.services';
import {Request, Response, } from "express";
import  catchAsync  from '../../../../utils/catchAsync';

const createConsequence = catchAsync(async (req: Request, res: Response) => {
    const consequence = await ConsequenceService.createConsequence({
        ...req.body,
        createdBy: req.user?._id
    });
    res.locals['documentId'] = consequence._id;
    res.locals['collectionName'] = 'Consequence';
    res.locals['action'] = 'create';
    res.locals['message'] = 'create consequence';
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals['changes'] = consequence;
    res.status(201).json({ data: consequence });
});

const getConsequences = catchAsync(async (req: Request, res: Response) => {
    const { libraryId } = req.params;
    const { page, limit, search } = req.query;
    const consequences = await ConsequenceService.getConsequencesByLibrary(libraryId as string, Number(page), Number(limit), search as string);
    res.status(200).json({ ...consequences, success: true });
});

const getConsequence = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const consequence = await ConsequenceService.getConsequenceById(id as string);
    res.status(200).json({ data: consequence });
});

const updateConsequence = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const consequence = await ConsequenceService.updateConsequence(id as string, req.body);
    res.locals['documentId'] = consequence._id;
    res.locals['collectionName'] = 'Consequence';
    res.locals['action'] = 'update';
    res.locals['message'] = 'update consequence';
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals['changes'] = consequence;
    res.status(200).json({ data: consequence });
});

const deleteConsequence = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    await ConsequenceService.deleteConsequence(id as string);
    res.locals['documentId'] = id;
    res.locals['collectionName'] = 'Consequence';
    res.locals['action'] = 'delete';    
    res.locals['message'] = 'delete consequence';
    res.locals['logof'] = req.body.library || req.params['libraryId'] || null;
    res.locals['changes'] = { isDeleted: true };
    res.status(204).send({
        data: null,
        message: 'Consequence deleted successfully',
        success: true
    });
});
export {
    createConsequence,
    getConsequences,
    getConsequence,
    updateConsequence,
    deleteConsequence
};
