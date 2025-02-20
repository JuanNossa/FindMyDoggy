"use strict";
// src/infrastructure/routes/PublicationRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PublicationController_1 = require("../../application/controllers/PublicationController");
const asyncHandler_1 = require("../../application/middlewares/asyncHandler");
const upload_1 = require("../../infrastructure/upload/upload");
const router = (0, express_1.Router)();
router.post('/', upload_1.upload.single('image'), (0, asyncHandler_1.asyncHandler)(PublicationController_1.PublicationController.create));
router.get('/', (0, asyncHandler_1.asyncHandler)(PublicationController_1.PublicationController.getAll));
router.get('/:id', (0, asyncHandler_1.asyncHandler)(PublicationController_1.PublicationController.getById));
router.put('/:id', (0, asyncHandler_1.asyncHandler)(PublicationController_1.PublicationController.update));
router.delete('/:id', (0, asyncHandler_1.asyncHandler)(PublicationController_1.PublicationController.delete));
exports.default = router;
