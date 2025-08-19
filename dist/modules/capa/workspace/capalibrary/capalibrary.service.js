"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReport = exports.deletePermanent = exports.restoreLibrary = exports.getLibrariesByManager = exports.updateForm5W2H = exports.checkUserBelongsToLibrary = exports.checkSubAdminBelongsToLibrary = exports.checkAdminBelongsTtoLibrary = exports.getLibraryMembers = exports.removeMemberFromLibrary = exports.addMemberToLibrary = exports.getLibrariesNames = exports.deleteLibrary = exports.updateLibrary = exports.getLibrariesfilterData = exports.getLibrariesByWorkspace = exports.getLibraryById = exports.CreateLibrary = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const capalibrary_modal_1 = require("./capalibrary.modal");
const user_subAdmin_1 = __importDefault(require("./../../../user/user.subAdmin"));
const activitylogs_modal_1 = __importDefault(require("../../../../modules/activitylogs/activitylogs.modal"));
const pdfTemplate_1 = require("../../../../modules/utils/pdfTemplate");
const upload_middleware_1 = require("../../../../modules/upload/upload.middleware");
const puppeteer_config_1 = require("../../../../utils/puppeteer.config");
const CreateLibrary = async (body) => {
    const library = new capalibrary_modal_1.LibraryModel(body);
    return await library.save();
};
exports.CreateLibrary = CreateLibrary;
const getLibraryById = async (libraryId) => {
    const data = await capalibrary_modal_1.LibraryModel.findOne({ _id: libraryId, isDeleted: false })
        .populate('members', 'name email profilePicture')
        .populate('managers', 'name email profilePicture');
    if (!data) {
        throw new Error('Library not found');
    }
    return data;
};
exports.getLibraryById = getLibraryById;
const getLibrariesByWorkspace = async (workspaceId, page, limit, search, isDeleted) => {
    const matchStage = { workspace: new mongoose_1.default.Types.ObjectId(workspaceId), isDeleted };
    if (search) {
        matchStage.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    }
    const pipeline = [
        { $match: matchStage },
        {
            $lookup: {
                from: 'actions',
                localField: '_id',
                foreignField: 'library',
                as: 'tasks',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'assignedTo',
                            foreignField: '_id',
                            as: 'assignedTo',
                            pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'deletedBy',
                foreignField: '_id',
                as: 'deletedBy',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        { $unwind: { path: '$deletedBy', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                as: 'members',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'managers',
                foreignField: '_id',
                as: 'managers',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ];
    const data = await capalibrary_modal_1.LibraryModel.aggregate(pipeline);
    // Get total count for pagination
    const countPipeline = [{ $match: matchStage }, { $count: 'total' }];
    const countResult = await capalibrary_modal_1.LibraryModel.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;
    return {
        data,
        total,
        page,
        limit,
        success: true,
        message: 'Libraries retrieved successfully',
    };
};
exports.getLibrariesByWorkspace = getLibrariesByWorkspace;
const getLibrariesfilterData = async (workspaceId, page, limit, search) => {
    const matchStage = {
        workspace: new mongoose_1.default.Types.ObjectId(workspaceId),
        isDeleted: false,
        status: 'pending',
    };
    const days = 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    if (search) {
        matchStage.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    }
    const pipeline = [
        { $match: { ...matchStage, updatedAt: { $lte: cutoffDate } } },
        {
            $lookup: {
                from: 'actions',
                localField: '_id',
                foreignField: 'library',
                as: 'tasks',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'assignedTo',
                            foreignField: '_id',
                            as: 'assignedTo',
                            pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                as: 'members',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'managers',
                foreignField: '_id',
                as: 'managers',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ];
    const data = await capalibrary_modal_1.LibraryModel.aggregate(pipeline);
    // Get total count for pagination
    const countPipeline = [{ $match: { ...matchStage, updatedAt: { $lte: cutoffDate } } }, { $count: 'total' }];
    const countResult = await capalibrary_modal_1.LibraryModel.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;
    return {
        data,
        total,
        page,
        limit,
        success: true,
        message: 'Libraries retrieved successfully',
    };
};
exports.getLibrariesfilterData = getLibrariesfilterData;
const updateLibrary = async (libraryId, updateData) => {
    const library = await capalibrary_modal_1.LibraryModel.findOneAndUpdate({ _id: libraryId, isDeleted: false }, updateData, { new: true })
        .populate('members', 'name email profilePicture')
        .populate('managers', 'name email profilePicture');
    if (!library) {
        throw new Error('Library not found');
    }
    return library;
};
exports.updateLibrary = updateLibrary;
const deleteLibrary = async (libraryId, userId) => {
    const library = await capalibrary_modal_1.LibraryModel.findOneAndUpdate({ _id: libraryId, isDeleted: false }, { isDeleted: true, deletedBy: userId, deletedAt: new Date() }, { new: true });
    if (!library) {
        throw new Error('Library not found');
    }
    return library;
};
exports.deleteLibrary = deleteLibrary;
const getLibrariesNames = async (workspaceId) => {
    return await capalibrary_modal_1.LibraryModel.find({ workspace: workspaceId, isDeleted: false }, 'name');
};
exports.getLibrariesNames = getLibrariesNames;
const addMemberToLibrary = async (libraryId, members) => {
    try {
        const library = await (0, exports.getLibraryById)(libraryId);
        if (!library) {
            throw new Error('Library not found');
        }
        const existingMemberIds = library.members.map((m) => m.toString());
        const managerIds = library.managers.map((m) => m.toString());
        for (const memberId of members) {
            const idStr = memberId.toString();
            // Skip if already a member
            if (existingMemberIds.includes(idStr)) {
                continue; // just skip instead of throwing
            }
            // Skip if a manager
            if (managerIds.includes(idStr)) {
                continue;
            }
            library.members.push(memberId);
        }
        return await library.save();
    }
    catch (error) {
        console.error('Error adding members to library:', error);
        throw new Error('Failed to add members to library');
    }
};
exports.addMemberToLibrary = addMemberToLibrary;
const removeMemberFromLibrary = async (libraryId, memberId) => {
    // Ensure the library exists before removing a member
    const library = await (0, exports.getLibraryById)(libraryId);
    if (!library) {
        throw new Error('Library not found');
    }
    if (!library.members.some((member) => member && member['_id'] && member['_id'].toString() === memberId.toString())) {
        throw new Error('Member is not in the library');
    }
    library.members = library.members.filter((member) => member['_id'].toString() !== memberId.toString());
    console.log('Member removed from library:', memberId, library);
    return await library.save();
};
exports.removeMemberFromLibrary = removeMemberFromLibrary;
const getLibraryMembers = async (libraryId, page = 1, limit = 10, search = '') => {
    let objectId;
    try {
        objectId = new mongoose_1.default.Types.ObjectId(libraryId);
    }
    catch (err) {
        throw new Error('Invalid libraryId');
    }
    const matchStage = {
        _id: objectId,
        // isDeleted: false,
    };
    const memberMatch = { name: {} };
    if (search) {
        memberMatch['name'] = { $regex: search, $options: 'i' };
    }
    const pipeline = [
        { $match: matchStage },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                as: 'members',
                pipeline: [
                    ...(search ? [{ $match: memberMatch }] : []),
                    { $project: { name: 1, email: 1, profilePicture: 1, role: 1, status: 1 } },
                ],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'managers',
                foreignField: '_id',
                as: 'managers',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1, role: 1, status: 1 } }],
            },
        },
        { $unwind: '$members' },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ];
    const result = await capalibrary_modal_1.LibraryModel.aggregate(pipeline);
    // Optionally, get total count for pagination
    const countPipeline = [
        { $match: matchStage },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                as: 'members',
                pipeline: [...(search ? [{ $match: memberMatch }] : [])],
            },
        },
        { $unwind: '$members' },
        { $count: 'total' },
    ];
    const countResult = await capalibrary_modal_1.LibraryModel.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;
    return {
        data: result.map((r) => r.members),
        total,
        page,
        limit,
        success: true,
        message: 'Library member(s) retrieved successfully',
    };
};
exports.getLibraryMembers = getLibraryMembers;
const checkAdminBelongsTtoLibrary = async (libraryId, userId, dataType) => {
    const Querydata = {
        _id: new mongoose_1.default.Types.ObjectId(libraryId),
        isDeleted: false,
    };
    if (dataType === 'mydocuments') {
        Querydata['managers'] = { $in: [userId] };
    }
    const library = await capalibrary_modal_1.LibraryModel.aggregate([
        { $match: Querydata },
        {
            $lookup: {
                from: 'capaworkspaces',
                localField: 'workspace',
                foreignField: '_id',
                as: 'workspace',
            },
        },
        { $unwind: '$workspace' },
        {
            $lookup: {
                from: 'subscriptions',
                localField: 'workspace.moduleId',
                foreignField: '_id',
                as: 'module',
            },
        },
        { $unwind: '$module' },
        {
            $match: {
                'module.userId': userId,
            },
        },
    ]);
    console.log('Admin belongs to library:', library, Querydata);
    if (!library || library.length === 0) {
        throw new Error('Library not found');
    }
    return true;
};
exports.checkAdminBelongsTtoLibrary = checkAdminBelongsTtoLibrary;
const checkSubAdminBelongsToLibrary = async (libraryId, userId, dataType) => {
    const Querydata = {
        'libraries._id': new mongoose_1.default.Types.ObjectId(libraryId),
        'libraries.isDeleted': false,
    };
    if (dataType === 'mydocuments') {
        Querydata['libraries.managers'] = { $in: [userId] };
    }
    const library = await user_subAdmin_1.default.aggregate([
        { $match: { _id: userId, isDeleted: false } },
        {
            $lookup: {
                from: 'capaworkspaces',
                let: { workspaceIds: '$adminOF.workspacePermissions' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: [
                                    '$_id',
                                    {
                                        $reduce: {
                                            input: '$$workspaceIds',
                                            initialValue: [],
                                            in: { $concatArrays: ['$$value', '$$this'] },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            name: 1,
                            description: 1,
                        },
                    },
                ],
                as: 'workspace',
            },
        },
        { $unwind: '$workspace' },
        {
            $lookup: {
                from: 'libraries',
                localField: 'workspace._id',
                foreignField: 'workspace',
                as: 'libraries',
            },
        },
        { $unwind: '$libraries' },
        {
            $match: Querydata,
        },
    ]);
    if (!library || library.length === 0) {
        throw new Error('Library not found');
    }
    return true;
};
exports.checkSubAdminBelongsToLibrary = checkSubAdminBelongsToLibrary;
const checkUserBelongsToLibrary = async (libraryId, user, dataType) => {
    const Querydata = {
        _id: new mongoose_1.default.Types.ObjectId(libraryId),
        isDeleted: false,
    };
    console.log('Query data for user library check:', libraryId, 'User ID:', user?._id);
    if (dataType === 'mydocuments') {
        Querydata['managers'] = { $in: [user?._id] };
    }
    console.log('Query data for user library check:', Querydata, 'User ID:', dataType);
    const result = await capalibrary_modal_1.LibraryModel.aggregate([
        {
            $match: Querydata,
        },
        {
            $lookup: {
                from: 'capaworkspaces',
                localField: 'workspace',
                foreignField: '_id',
                as: 'workspace',
            },
        },
        { $unwind: '$workspace' },
        {
            $match: {
                'workspace._id': user.workspace,
            },
        },
    ]);
    if (!result || result.length === 0) {
        throw new Error('User does not belong to this library');
    }
    return true;
};
exports.checkUserBelongsToLibrary = checkUserBelongsToLibrary;
const updateForm5W2H = async (libraryId, formData) => {
    const library = await capalibrary_modal_1.LibraryModel.findOneAndUpdate({ _id: libraryId, isDeleted: false }, { Form5W2H: formData }, { new: true });
    if (!library) {
        throw new Error('Library not found');
    }
    return library;
};
exports.updateForm5W2H = updateForm5W2H;
const getLibrariesByManager = async (workspaceId, managerId, page, limit, search) => {
    const matchStage = {
        workspace: new mongoose_1.default.Types.ObjectId(workspaceId),
        managers: { $in: [new mongoose_1.default.Types.ObjectId(managerId)] },
        isDeleted: false,
    };
    if (search) {
        matchStage.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    }
    const pipeline = [
        { $match: matchStage },
        {
            $lookup: {
                from: 'actions',
                localField: '_id',
                foreignField: 'library',
                as: 'tasks',
                pipeline: [
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'assignedTo',
                            foreignField: '_id',
                            as: 'assignedTo',
                            pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'members',
                foreignField: '_id',
                as: 'members',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'managers',
                foreignField: '_id',
                as: 'managers',
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
            },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
    ];
    const data = await capalibrary_modal_1.LibraryModel.aggregate(pipeline);
    // Get total count for pagination
    const countPipeline = [{ $match: matchStage }, { $count: 'total' }];
    const countResult = await capalibrary_modal_1.LibraryModel.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;
    return {
        data,
        total,
        page,
        limit,
        success: true,
        message: 'Libraries retrieved successfully',
    };
};
exports.getLibrariesByManager = getLibrariesByManager;
const restoreLibrary = async (libraryIds, workspaceId, userId) => {
    console.log('Permanently deleting libraries with IDs:', libraryIds);
    const result = await capalibrary_modal_1.LibraryModel.updateMany({ _id: { $in: libraryIds } }, { isDeleted: false });
    if (result.modifiedCount === 0) {
        throw new Error('No libraries were restored');
    }
    await Promise.all(libraryIds.map((id) => activitylogs_modal_1.default.create({
        action: 'restore',
        collectionName: 'Library',
        documentId: id,
        changes: { isDeleted: false },
        performedBy: userId,
        logof: workspaceId,
        message: 'Library restored',
    })));
    return result;
};
exports.restoreLibrary = restoreLibrary;
const deletePermanent = async (libraryIds, workspaceId, userId) => {
    console.log('Permanently deleting libraries with IDs:', libraryIds);
    const result = await capalibrary_modal_1.LibraryModel.deleteMany({ _id: { $in: libraryIds } });
    if (result.deletedCount === 0) {
        throw new Error('No libraries were deleted');
    }
    await Promise.all(libraryIds.map((id) => activitylogs_modal_1.default.create({
        action: 'delete',
        collectionName: 'Library',
        documentId: id,
        changes: { isDeleted: true },
        performedBy: userId,
        logof: workspaceId,
        message: 'Library permanently deleted',
    })));
    return result;
};
exports.deletePermanent = deletePermanent;
const generateReport = async (libraryId) => {
    let browser;
    let page;
    try {
        console.log('Starting PDF generation for library:', libraryId);
        // 1. Launch headless browser
        browser = await (0, puppeteer_config_1.launchBrowser)();
        console.log('Browser launched successfully');
        page = await browser?.newPage();
        console.log('New page created');
        console.log('Page configured with timeouts');
        const [findLibrary] = await capalibrary_modal_1.LibraryModel.aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(libraryId) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members',
                    foreignField: '_id',
                    as: 'members',
                    pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1, role: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'managers',
                    foreignField: '_id',
                    as: 'managers',
                    pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1, role: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'causes',
                    localField: '_id',
                    foreignField: 'library',
                    as: 'causes',
                    pipeline: [{ $project: { name: 1, description: 1, createdAt: 1 } }],
                },
            },
            {
                $lookup: {
                    from: 'actions',
                    localField: '_id',
                    foreignField: 'library',
                    as: 'actions',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'assignedTo',
                                foreignField: '_id',
                                as: 'assignedTo',
                                pipeline: [{ $project: { name: 1, email: 1, profilePicture: 1 } }],
                            }
                        },
                        {
                            $project: {
                                name: 1,
                                email: 1,
                                profilePicture: 1,
                                status: 1,
                                createdAt: 1,
                                priority: 1,
                                endDate: 1,
                                startDate: 1,
                                type: 1,
                                assignedTo: 1,
                                cause: 1,
                                docfile: 1
                            }
                        }
                    ],
                },
            },
            {
                $addFields: {
                    pendingActions: {
                        $size: {
                            $ifNull: [
                                { $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'pending'] } } },
                                []
                            ]
                        }
                    },
                    inProgressActions: {
                        $size: {
                            $ifNull: [
                                { $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'in-progress'] } } },
                                []
                            ]
                        }
                    },
                    onHoldActions: {
                        $size: {
                            $ifNull: [
                                { $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'on-hold'] } } },
                                []
                            ]
                        }
                    },
                    completedActions: {
                        $size: {
                            $ifNull: [
                                { $filter: { input: '$actions', as: 'action', cond: { $eq: ['$$action.status', 'completed'] } } },
                                []
                            ]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'checklisthistories',
                    localField: '_id',
                    foreignField: 'library',
                    as: 'checklisthistory',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'checklists',
                                localField: 'checklistId',
                                foreignField: '_id',
                                as: 'checklistId',
                                pipeline: [
                                    { $project: { name: 1, description: 1 } } // project what you need
                                ]
                            }
                        },
                        {
                            $unwind: {
                                path: "$checklistId",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $unwind: {
                                path: "$list",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $lookup: {
                                from: "checklistitems",
                                localField: "list.item",
                                foreignField: "_id",
                                as: "list.itemDetails",
                                pipeline: [
                                    { $project: { question: 1 } } // project what you need
                                ]
                            }
                        },
                        {
                            $unwind: {
                                path: "$list.itemDetails",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $group: {
                                _id: "$_id",
                                checklist: { $first: "$checklistId" },
                                library: { $first: "$library" },
                                comment: { $first: "$comment" },
                                createdBy: { $first: "$createdBy" },
                                createdAt: { $first: "$createdAt" },
                                updatedAt: { $first: "$updatedAt" },
                                list: {
                                    $push: {
                                        item: "$list.itemDetails",
                                        yes: "$list.yes",
                                        no: "$list.no",
                                        partial: "$list.partial",
                                        evidence: "$list.evidence",
                                        evidenceKey: "$list.evidenceKey",
                                        comment: "$list.comment"
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]);
        if (!findLibrary) {
            throw new Error('Library not found');
        }
        console.log('Generating PDF content...');
        const pdfContent = await (0, pdfTemplate_1.pdfTemplate)(findLibrary);
        console.log('PDF content generated, setting page content...');
        // 4. Set the HTML as the page content with a more reliable wait strategy
        await page?.setContent(pdfContent, {
            waitUntil: "domcontentloaded",
            timeout: 120000 // 2 minutes timeout
        });
        console.log('Page content set successfully');
        // 5. Generate PDF
        console.log('Generating PDF...');
        const pdfBuffer = await page?.pdf({
            format: "a4",
            printBackground: true,
            margin: { top: "20mm", bottom: "20mm" },
            timeout: 120000 // 2 minutes timeout for PDF generation
        });
        console.log('PDF generated successfully');
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}-Report.pdf`;
        // Convert Uint8Array to Buffer
        const buffer = Buffer.from(new Uint8Array(pdfBuffer || []));
        console.log('Uploading PDF...');
        const response = await (0, upload_middleware_1.uploadSingleFile)(uniqueFileName, buffer, "application/pdf", false);
        if (!response) {
            throw new Error('Failed to upload PDF');
        }
        console.log('PDF uploaded successfully:', response);
        return response;
    }
    catch (error) {
        console.error('Error generating PDF report:', error);
        throw error;
    }
    finally {
        // Ensure browser is always closed
        if (page) {
            try {
                await page.close();
                console.log('Page closed');
            }
            catch (err) {
                console.warn('Error closing page:', err);
            }
        }
        if (browser) {
            try {
                await browser.close();
                console.log('Browser closed');
            }
            catch (err) {
                console.warn('Error closing browser:', err);
            }
        }
    }
};
exports.generateReport = generateReport;
