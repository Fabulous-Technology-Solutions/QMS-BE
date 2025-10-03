"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setassessmentApprovalController = exports.setriskappetiteController = exports.generateReportController = exports.deletePermanentLibrary = exports.RestoreLibrary = exports.getLibrariesForUser = exports.addMemberToLibraryController = exports.getLibraryMembersController = exports.removeMemberFromLibraryController = exports.getLibraryNamesController = exports.deleteLibraryById = exports.getLibraries = exports.getLibrary = exports.updateLibraryById = exports.createLibrary = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const risklibrary_service_1 = require("./risklibrary.service");
exports.createLibrary = (0, catchAsync_1.default)(async (req, res) => {
    const library = await (0, risklibrary_service_1.CreateLibrary)({ ...req.body, createdBy: req.user._id });
    res.locals["message"] = "create library";
    res.locals["documentId"] = library._id;
    res.locals["collectionName"] = "Library";
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.status(201).json({
        success: true,
        message: 'Library created successfully',
        data: library,
    });
});
exports.updateLibraryById = (0, catchAsync_1.default)(async (req, res) => {
    const library = await (0, risklibrary_service_1.updateLibrary)(req.params['libraryId'], req.body);
    res.locals["message"] = "update library";
    res.locals["documentId"] = library._id;
    res.locals["collectionName"] = "Library";
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.status(200).json({
        success: true,
        message: 'Library updated successfully',
        data: library,
    });
});
exports.getLibrary = (0, catchAsync_1.default)(async (req, res) => {
    const library = await (0, risklibrary_service_1.getLibraryById)(req.params['libraryId']);
    res.status(200).json({
        success: true,
        message: 'Library retrieved successfully',
        data: library,
    });
});
exports.getLibraries = (0, catchAsync_1.default)(async (req, res) => {
    const { workspaceId } = req.params;
    const { page = 1, limit = 10, search = '', isDeleted = false } = req.query;
    const libraries = await (0, risklibrary_service_1.getLibrariesByWorkspace)(workspaceId || '', Number(page), Number(limit), search, Boolean(isDeleted));
    res.status(200).json(libraries);
});
exports.deleteLibraryById = (0, catchAsync_1.default)(async (req, res) => {
    const library = await (0, risklibrary_service_1.deleteLibrary)(req.params['libraryId'], req.user._id);
    res.locals["message"] = "delete library";
    res.locals["documentId"] = library._id;
    res.locals["collectionName"] = "Library";
    res.locals["changes"] = { isDeleted: true };
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    return res.status(201).json({
        success: true,
        message: 'Library deleted successfully',
        data: library,
    });
});
exports.getLibraryNamesController = (0, catchAsync_1.default)(async (req, res) => {
    const workspaceId = req.params['workspaceId'] || '';
    const libraryNames = await (0, risklibrary_service_1.getLibrariesNames)(workspaceId);
    res.status(200).json({
        success: true,
        data: libraryNames,
        message: 'Library names retrieved successfully',
    });
});
exports.removeMemberFromLibraryController = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId, memberId } = req.params;
    res.locals["message"] = "remove member from library";
    res.locals["documentId"] = libraryId;
    res.locals["collectionName"] = "Library";
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    const updatedLibrary = await (0, risklibrary_service_1.removeMemberFromLibrary)(libraryId || '', memberId || '');
    res.status(200).json({
        success: true,
        data: updatedLibrary,
        message: 'Member removed from library successfully',
    });
});
exports.getLibraryMembersController = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const { page = 1, limit = 10, search = '' } = req.query;
    const members = await (0, risklibrary_service_1.getLibraryMembers)(libraryId || '', Number(page), Number(limit), search);
    res.status(200).json({
        success: true,
        data: members,
        message: 'Library members retrieved successfully',
    });
});
exports.addMemberToLibraryController = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const { members } = req.body;
    const updatedLibrary = await (0, risklibrary_service_1.addMemberToLibrary)(libraryId || '', members);
    res.locals["message"] = "add member to library";
    res.locals["documentId"] = libraryId;
    res.locals["collectionName"] = "Library";
    res.locals["changes"] = {};
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.status(200).json({
        success: true,
        data: updatedLibrary,
        message: 'Member added to library successfully',
    });
});
exports.getLibrariesForUser = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user._id;
    const { page = 1, limit = 10, search = '' } = req.query;
    const libraries = await (0, risklibrary_service_1.getLibrariesByManager)(req.params["workspaceId"], req.headers['accountid'] || userId || '', Number(page), Number(limit), search);
    res.status(200).json(libraries);
});
exports.RestoreLibrary = (0, catchAsync_1.default)(async (req, res) => {
    const { libraries } = req.body;
    const restoredLibrary = await (0, risklibrary_service_1.restoreLibrary)(libraries || [], req.params["workspaceId"], req.user._id);
    res.status(200).json({
        success: true,
        data: restoredLibrary,
        message: 'Library restored successfully',
    });
});
exports.deletePermanentLibrary = (0, catchAsync_1.default)(async (req, res) => {
    const { libraries } = req.body;
    const deletedLibrary = await (0, risklibrary_service_1.deletePermanent)(libraries || [], req.params["workspaceId"], req.user._id);
    res.status(200).json({
        success: true,
        data: deletedLibrary,
        message: 'Library permanently deleted successfully',
    });
});
exports.generateReportController = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const report = await (0, risklibrary_service_1.generateReport)(libraryId || '');
    res.status(200).json(report);
});
exports.setriskappetiteController = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const { riskappetite } = req.body;
    const library = await (0, risklibrary_service_1.setriskappetite)(libraryId, riskappetite);
    res.locals["message"] = "update library";
    res.locals["documentId"] = library._id;
    res.locals["collectionName"] = "Library";
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.status(200).json({
        success: true,
        message: 'Library updated successfully',
        data: library,
    });
});
exports.setassessmentApprovalController = (0, catchAsync_1.default)(async (req, res) => {
    const { libraryId } = req.params;
    const { assessmentApproval } = req.body;
    const library = await (0, risklibrary_service_1.setassessmentApproval)(libraryId, assessmentApproval);
    res.locals["message"] = "update library";
    res.locals["documentId"] = library._id;
    res.locals["collectionName"] = "Library";
    res.locals['logof'] = req.body.workspace || req.params['workspaceId'] || null;
    res.status(200).json({
        success: true,
        message: 'Library updated successfully',
        data: library,
    });
});
