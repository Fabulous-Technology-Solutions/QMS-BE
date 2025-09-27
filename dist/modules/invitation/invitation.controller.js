"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptInvitation = exports.deleteInvitation = exports.getInvitationByToken = exports.getInvitations = exports.createInvitation = void 0;
const invitationService = __importStar(require("./invitation.services"));
const utils_1 = require("../utils");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const email_service_1 = require("../email/email.service");
exports.createInvitation = (0, utils_1.catchAsync)(async (req, res) => {
    const invitation = await invitationService.createInvitation({ ...req.body, invitedBy: req.user?._id });
    if (!invitation) {
        throw new ApiError_1.default('Failed to create invitation', 500);
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
    await (0, email_service_1.sendEmail)(invitation.email, 'Invitation to join our platform', 'You have been invited to join our platform', html);
    res.status(201).json({ message: 'Invitation send successfully', data: invitation });
});
exports.getInvitations = (0, utils_1.catchAsync)(async (req, res) => {
    const invitations = await invitationService.getInvitationsByInvitedBy(req.user?._id, Number(req.query['page']) || 1, Number(req.query['limit']) || 10, req.query['search']);
    res.status(200).json({ message: 'Invitations fetched successfully', data: invitations });
});
exports.getInvitationByToken = (0, utils_1.catchAsync)(async (req, res) => {
    const invitation = await invitationService.getInvitationByToken(req.params['token']);
    if (!invitation) {
        throw new ApiError_1.default('Invitation not found', 404);
    }
    res.status(200).json({ message: 'Invitation fetched successfully', data: invitation });
});
exports.deleteInvitation = (0, utils_1.catchAsync)(async (req, res) => {
    const invitation = await invitationService.deleteInvitation(req.params['token']);
    if (!invitation) {
        throw new ApiError_1.default('Invitation not found', 404);
    }
    res.status(200).json({ message: 'Invitation deleted successfully', data: invitation });
});
exports.acceptInvitation = (0, utils_1.catchAsync)(async (req, res) => {
    const invitation = await invitationService.acceptInvitation(req.body.token, req.user);
    if (!invitation) {
        throw new ApiError_1.default('Invalid or expired invitation token', 400);
    }
    res.status(200).json({ message: 'Invitation accepted successfully', data: invitation });
});
