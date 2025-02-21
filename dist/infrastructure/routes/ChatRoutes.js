"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChatController_1 = require("../../application/controllers/ChatController");
const asyncHandler_1 = require("../../application/middlewares/asyncHandler");
const router = (0, express_1.Router)();
// GET /api/chats?userId=4
router.get('/', (0, asyncHandler_1.asyncHandler)(ChatController_1.ChatController.getUserChats));
exports.default = router;
