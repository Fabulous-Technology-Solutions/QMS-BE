import { Invitation } from './invitation.interfces';
import InvitationModal from './invitation.modal';
import AppiError from '../errors/ApiError';
import { IUserDoc } from '../user/user.interfaces';
import { AccountModel } from '../account';

export const createInvitation = async (invitation: Invitation) => {
  // check if invitation already exists
  const existingInvitation = await InvitationModal.findOne({
    email: invitation.email,
    status: 'pending',
    role: invitation.role,
    ...(invitation.role === 'workspaceUser' && {
      'Permissions.workspace': { $in: invitation?.Permissions?.flatMap((item) => item.workspace) || [] },
    }),
  }).lean();

  if (existingInvitation) {
    throw new AppiError('Invitation already sent to this email pending', 400);
  }
  const account = await AccountModel.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    { $unwind: '$userDetails' },
    {
      $match: {
        'userDetails.email': invitation.email,
        accountId: invitation.accountId,
        $and: [
          {
            role: invitation.role === 'workspaceUser' ? 'workspaceUser' : 'admin',
            ...(invitation.role === 'workspaceUser' && {
              'Permissions.workspace': { $in: invitation?.Permissions?.flatMap((item) => item.workspace) || [] },
            }),
          },
        ],
      },
    },
    { $project: { _id: 1 } },
  ]);
  if (account.length) {
    throw new AppiError('User with this email already has an account access', 400);
  }

  /// create token logic here
  const token = Math.random().toString(36).substring(2);
  invitation.token = token;
  invitation.status = 'pending';
  // save to db
  const newInvitation = new InvitationModal(invitation);
  return await newInvitation.save();
};
export const getInvitationByEmail = async (email: string) => {
  return await InvitationModal.find({ email }).lean();
};
export const getInvitationByToken = async (token: string) => {
  return await InvitationModal.find({ token }).lean();
};
export const updateInvitation = async (token: string, updateData: Partial<Invitation>) => {
  return await InvitationModal.findOneAndUpdate({ token }, updateData, { new: true }).lean();
};
export const deleteInvitation = async (token: string) => {
  return await InvitationModal.findOneAndDelete({ token }).lean();
};
export const getAllInvitations = async () => {
  return await InvitationModal.find().lean();
};
export const getInvitationsByInvitedBy = async (invitedBy: string, page: number, limit: number, search?: string) => {
  const skip = (page - 1) * limit;

  const query: any = {
    invitedBy,
    role: { $in: ['admin', 'standardUser'] },
    status: 'pending',
  };

  if (search) {
    query.$or = [
      { email: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
      { status: { $regex: search, $options: 'i' } },
    ];
  }

  const [invitations, total] = await Promise.all([
    InvitationModal.find(query).skip(skip).limit(limit).lean(),
    InvitationModal.countDocuments(query),
  ]);

  return {
    invitations,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getInvitationsByWorkspace = async (workspaceId: string, page: number, limit: number, search?: string) => {
  const skip = (page - 1) * limit;

  const query: any = {
    'Permissions.workspace': workspaceId,
    role: { $in: ['workspaceUser'] },
    status: 'pending',
  };
   
  

  if (search) {
    query.$or = [
      { email: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
      { status: { $regex: search, $options: 'i' } },
    ];
  }

  const [invitations, total] = await Promise.all([
    InvitationModal.find(query).skip(skip).limit(limit).lean(),
    InvitationModal.countDocuments(query),
  ]);

  return {
    invitations,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const acceptInvitation = async (token: string, user: IUserDoc) => {
  console.log('token', token, 'user', user);
  const invitation = await InvitationModal.findOne({ token, status: 'pending', email: user.email });
  if (!invitation) {
    throw new AppiError('Invalid request due to invalid email or already accepted invitation', 400);
  }
  invitation.status = 'accepted';
  const account = await AccountModel.create({
    role: invitation.role,
    user: user._id,
    Permissions: invitation.Permissions,
    accountId: invitation.accountId,
    status: 'active',
  });
  await invitation.save();
  return account;
};
