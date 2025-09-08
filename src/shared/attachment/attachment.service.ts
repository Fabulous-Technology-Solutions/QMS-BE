import { deleteMedia } from '../../modules/upload/upload.middleware';
import { Model, Document } from 'mongoose';
import { CreateAttachmentRequest,AttachmentModal } from './attachment.interfaces';

export class AttachmentServices<T extends Document> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>) {
    const doc = new this.model(data);
    return await doc.save();
  }

  async update(id: string, updateData: CreateAttachmentRequest) {
    const doc: AttachmentModal | null = await this.model.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: false });
    if (!doc) {
      throw new Error('Attachment not found');
    }
    if (doc.fileKey) {
      await deleteMedia(doc.fileKey);
    }
    Object.assign(doc, updateData);
    return doc;
  }
  
  async delete(id: string) {
    const doc = await this.model.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!doc) throw new Error('Document not found');
    return doc;
  }

  async getById(id: string) {
    const doc = await this.model.findOne({ _id: id, isDeleted: false });
    if (!doc) throw new Error('Document not found');
    return doc;
  }

  async getByLibrary(libraryId: string, page: number, limit: number, search?: string) {
    const query: any = { library: libraryId, isDeleted: false };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const data = await this.model
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await this.model.countDocuments(query);

    return {
      data,
      total,
      page,
      limit,
      success: true,
      message: 'Retrieved successfully',
    };
  }
}
