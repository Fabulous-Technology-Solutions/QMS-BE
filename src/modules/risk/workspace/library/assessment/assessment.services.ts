import AssessmentModel from './assessment.modal';
import AppiError from '../../../../errors/ApiError';
import { CreateAssessmentRequest } from './assessment.interfaces';
import { deleteMedia } from '../../../../upload/upload.middleware';
import mongoose from 'mongoose';

const createAssessment = async (data: CreateAssessmentRequest) => {
  const assessment = new AssessmentModel(data);
  await assessment.save();
  return assessment;
};

const getAssessmentById = async (id: string) => {
  const assessments = await AssessmentModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
        isDeleted: false
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy',
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              profilePicture: 1
            }
          }
        ]
      }
    },
 {
        $lookup: {
          from: 'accounts',
          localField: 'avaluator',
          foreignField: '_id',
          as: 'evaluator',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
              },
            },
            { $unwind: { path: '$user' } },
            {
              $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture', _id: 1 },
            },
          ],
        },
      },
    {
      $unwind: {
        path: '$createdBy',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$evaluator',
        preserveNullAndEmptyArrays: true
      }
    }
  ]);

  const assessment = assessments[0];
  if (!assessment) {
    throw new AppiError('Assessment not found', 404);
  }
  return assessment;
};
const updateAssessment = async (id: string, data: Partial<CreateAssessmentRequest>) => {
  const assessment = await AssessmentModel.findByIdAndUpdate(id, data, { new: false }).where({ isDeleted: false });
  if (!assessment) {
    throw new AppiError('Assessment not found or already deleted', 404);
  }
  if (assessment.templateKey !== data.templateKey) {
    await deleteMedia(assessment.templateKey as string);
  }
  Object.assign(assessment, data);
  return assessment;
};
const deleteAssessment = async (id: string) => {
  const assessment = await AssessmentModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).where({
    isDeleted: false,
  });
  if (!assessment) {
    throw new AppiError('Assessment not found or already deleted', 404);
  }
  await deleteMedia(assessment.templateKey as string);
  return assessment;
};
const getAssessmentsByLibrary = async (libraryId: string, page: number, limit: number, search: string) => {
  const pipeline = [
    {
      $match: {
        library: new mongoose.Types.ObjectId(libraryId),
        isDeleted: false,
        name: { $regex: search, $options: 'i' },
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createdBy',
        pipeline: [
          {
            $project: {
              name: 1,
              email: 1,
              profilePicture: 1
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: 'accounts',
        localField: 'evaluator',
        foreignField: '_id',
        as: 'evaluator',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
              pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
          },
          { $unwind: { path: '$user' } },
          {
            $project: { name: '$user.name', email: '$user.email', profilePicture: '$user.profilePicture', _id: 1 },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$createdBy',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: '$evaluator',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $facet: {
        data: [
          { $skip: (page - 1) * limit },
          { $limit: limit }
        ],
        total: [
          { $count: 'count' }
        ]
      }
    }
  ];

  const result = await AssessmentModel.aggregate(pipeline);
  const assessments = result[0].data;
  const total = result[0].total[0]?.count || 0;

  return {
    data: assessments,
    total,
    page,
    limit,
    success: true,
  };
};

const getMonthlyAssessmentData = async (libraryId: string, year: number) => {
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31, 23, 59, 59);

  // Fetch only months that have assessments
  const rawData = await AssessmentModel.aggregate([
    {
      $match: {
        library: new mongoose.Types.ObjectId(libraryId),
        isDeleted: false,
        createdAt: { $gte: startOfYear, $lte: endOfYear },
      },
    },
    {
      $addFields: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: { year: '$year', month: '$month' },
        assessmentId: { $first: '$_id' },
        probability: { $first: '$probability' },
        impact: { $first: '$impact' },
        createdAt: { $first: '$createdAt' },
      },
    },
    {
      $project: {
        _id: 0,
        month: '$_id.month',
        riskScore: { $multiply: ['$probability', '$impact'] },
      },
    },
    {
      $sort: { month: 1 },
    },
  ]);

  // Post-process → ensure all 12 months included
  const monthlyData: any[] = [];
  for (let month = 1; month <= 12; month++) {
    const existing = rawData.find((d) => d.month === month);
    if (existing) {
      monthlyData.push(existing);
    } else {
      monthlyData.push({
        month,
        riskScore: 0,
      });
    }
  }

  return monthlyData;
};

export { createAssessment, getAssessmentById, updateAssessment, deleteAssessment, getAssessmentsByLibrary,getMonthlyAssessmentData };
