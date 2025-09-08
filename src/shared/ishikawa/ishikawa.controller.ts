import catchAsync  from "../../modules/utils/catchAsync";
import { Request, Response } from "express";
export class IsikawaController<TService> {
  private service: TService;
  private collectionName: string;

  constructor(service: TService, collectionName: string) {
    this.service = service;
    this.collectionName = collectionName;
  }

  create = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore (service typing depends on BaseService)
    const doc = await this.service.create({ ...req.body , createdBy: req.user._id });

    res.locals["message"] = `create ${this.collectionName.toLowerCase()}`;
    res.locals["documentId"] = doc._id;
    res.locals["collectionName"] = this.collectionName;
    res.locals["logof"] = req.body.library || req.params["libraryId"] || null;
    res.locals["changes"] = doc;

    res.status(201).json(doc);
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    // @ts-ignore
    const doc = await this.service.update(id, req.body);

    res.locals["message"] = `update ${this.collectionName.toLowerCase()}`;
    res.locals["documentId"] = doc._id;
    res.locals["collectionName"] = this.collectionName;
    res.locals["logof"] = req.body.library || req.params["libraryId"] || null;
    res.locals["changes"] = doc;

    res.status(200).json(doc);
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    // @ts-ignore
    const doc = await this.service.delete(id);

    res.locals["message"] = `delete ${this.collectionName.toLowerCase()}`;
    res.locals["documentId"] = doc._id;
    res.locals["collectionName"] = this.collectionName;
    res.locals["logof"] = req.body.library || req.params["libraryId"] || null;
    res.locals["changes"] = { isDeleted: true };

    res.status(200).json(doc);
  });

  getById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    // @ts-ignore
    const doc = await this.service.getById(id);
    res.status(200).json(doc);
  });

  getByLibrary = catchAsync(async (req: Request, res: Response) => {
    const { libraryId } = req.params;
    const { page = 1, limit = 10 } = req.query as any;
    // @ts-ignore
    const docs = await this.service.getByLibrary(
      libraryId,
      Number(page),
      Number(limit)
    );
    res.status(200).json(docs);
  })
}
