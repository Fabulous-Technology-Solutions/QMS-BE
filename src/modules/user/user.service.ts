import httpStatus from 'http-status';
import mongoose from 'mongoose';
import User from './user.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { UpdateUserBody, IUserDoc, NewRegisteredUser, CreateNewUser } from './user.interfaces';
import axios from 'axios';
import subAdmin from './user.subAdmin';
import { sendEmail } from '../email/email.service';
import { tokenService } from '../token';


/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody: CreateNewUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError('Email already taken', httpStatus.BAD_REQUEST);
  }
  const user=await subAdmin.create({ ...userBody, role: "subAdmin" })
  console.log('user create before create token', user);
  const inviteToken = await tokenService.generateInviteToken(userBody.email);
  const inviteUrl = `${process.env["CLIENT_URL"]}/invite?email=${encodeURIComponent(userBody.email)}&token=${inviteToken}`;
  const htmlbodyforsendpassword = `
    <p>Welcome to Tellust, ${userBody.name}!</p>
    <p>Email: ${userBody.email}</p>
    <p>Please click the button below to accept your invitation and set your password or proceed with Google:</p>
    <a href="${inviteUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:4px;">Accept Invitation</a>
    <p>If you did not expect this invitation, you can ignore this email.</p>
  `;
  sendEmail(userBody.email, 'Welcome to Tellust! Accept Your Invitation', "", htmlbodyforsendpassword);
  return user;

};

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const registerUser = async (userBody: NewRegisteredUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {

    throw new ApiError('Email already taken', httpStatus.BAD_REQUEST);
  }
  return User.create({ ...userBody, role: 'admin', isEmailVerified: false, providers: ['local'] });
};


export const googleprofiledata= async(access_token: string)=>{
  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Google profile data:', error);
    throw new ApiError('Failed to fetch Google profile data', httpStatus.UNAUTHORIZED);
  }
};


export const loginWithGoogle = async (body: any): Promise<IUserDoc> => {
  const { access_token } = body;

  if (!access_token) {
    throw new ApiError('Access token is required', httpStatus.BAD_REQUEST, { access_token: "access_token is required" });
  }

  let userData;

  try {
    const response = await googleprofiledata(access_token);
    userData = response.data;
  } catch (err: any) {
    console.error('Google token error:', err.response?.data || err.message);
    throw new ApiError('Invalid or expired Google access token', httpStatus.UNAUTHORIZED);
  }

  const email = userData?.email;
  if (!email) {
    throw new ApiError('Google account did not return an email', httpStatus.BAD_REQUEST);
  }

  let user = await User.findOne({ email });

  if (user && user.providers.includes('local')) {
    throw new ApiError(
      'This email is already registered. Please log in using your email and password',
      httpStatus.BAD_REQUEST
    );
  }

  if (user) {
    let needsUpdate = false;

    if (!user.providers.includes('google')) {
      user.providers.push('google');
      needsUpdate = true;
    }

    if (!user.googleId) {
      user.googleId = userData?.sub;
      needsUpdate = true;
    }

    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      needsUpdate = true;
    }                                 

    if (needsUpdate) {
      await user.save();
    }

    return user;
  }

  // Create a new user
  user = await User.create({
    googleId: userData?.sub,
    name: userData?.given_name || 'Unknown',
    role: 'admin',
    email,
    isEmailVerified: true,
    providers: ['google'],
  });

  return user;
};



export const getme = async (userId: mongoose.Types.ObjectId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
  const user = await User.findById(id);
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUserDoc|null> => { 
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }
  return user;
};

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateUserById = async (
  userId: mongoose.Types.ObjectId,
  updateBody: UpdateUserBody
): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError('Email already taken', httpStatus.BAD_REQUEST);
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteUserById = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError('User not found', httpStatus.NOT_FOUND);
  }
  await user.deleteOne();
  return user;
};
