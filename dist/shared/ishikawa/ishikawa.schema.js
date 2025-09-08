"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const IshikawaSchema = new mongoose_1.default.Schema({
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    problems: [
        {
            problem: { type: String, required: true },
            category: [
                {
                    name: { type: String, required: true },
                    cause: [
                        {
                            name: {
                                type: String,
                                required: true,
                            },
                            subCauses: [
                                {
                                    type: String,
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}, {
    timestamps: true,
});
exports.default = IshikawaSchema;
