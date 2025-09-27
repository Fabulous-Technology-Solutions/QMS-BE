import * as invitationService from './invitation.services';
import { Request, Response } from 'express';
import { catchAsync } from '../utils';
import AppiError from '../errors/ApiError';
import { sendEmail } from '../email/email.service';

export const createInvitation = catchAsync(async (req: Request, res: Response) => {
  const invitation = await invitationService.createInvitation({ ...req.body, invitedBy: req.user?._id });
  if (!invitation) {
    throw new AppiError('Failed to create invitation', 500);
  }
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;">
    <h4><strong>Dear user,</strong></h4>
    <p>You have been invited to join our platform. To accept the invitation, please click on the button below:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${process.env['CLIENT_URL']}/accept-invitation?token=${invitation.token}" 
         style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
        Accept Invitation
      </a>
    </div>
    <p>If you did not expect this invitation, please ignore this email.</p>
    <p>Thanks,</p>
    <p><strong>Team</strong></p>
  </div>`;

  await sendEmail(invitation.email, 'Invitation to join our platform', 'You have been invited to join our platform', html);

  res.status(201).json({ message: 'Invitation send successfully', data: invitation });
});

export const getInvitations = catchAsync(async (req: Request, res: Response) => {
  const invitations = await invitationService.getInvitationsByInvitedBy(req.user?._id as string,Number(req.query['page']) || 1, Number(req.query['limit']) || 10, req.query['search'] as string);
  res.status(200).json({ message: 'Invitations fetched successfully', data: invitations });
});

export const getInvitationByToken = catchAsync(async (req: Request, res: Response) => {
  const invitation = await invitationService.getInvitationByToken(req.params['token'] as string);
  if (!invitation) {
    throw new AppiError('Invitation not found', 404);
  }
  res.status(200).json({ message: 'Invitation fetched successfully', data: invitation });
});

export const deleteInvitation = catchAsync(async (req: Request, res: Response) => { 

  const invitation = await invitationService.deleteInvitation(req.params['token'] as string);

  if (!invitation) {
    throw new AppiError('Invitation not found', 404);
  }
  res.status(200).json({ message: 'Invitation deleted successfully', data: invitation });
});

export const acceptInvitation = catchAsync(async (req: Request, res: Response) => {
  const invitation = await invitationService.acceptInvitation(req.body.token, req.user!);

  if (!invitation) {
    throw new AppiError('Invalid or expired invitation token', 400);
  }
  res.status(200).json({ message: 'Invitation accepted successfully', data: invitation });
});

