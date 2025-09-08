"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FiveWhysSchema = new mongoose_1.default.Schema({
    library: { type: String, required: true, minlength: 24, maxlength: 24 },
    problem: { type: String, required: true, maxlength: 500 },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
    list: [
        {
            question: { type: String, required: true, maxlength: 200 },
            answer: { type: String, required: true, maxlength: 500 },
        },
    ],
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = FiveWhysSchema;
