"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const communitiesService_1 = __importDefault(require("../services/communitiesService"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const express_1 = require("express");
const communitiesRouter = (0, express_1.Router)();
communitiesRouter.get('/', middleware_1.default.jwtVerify, (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const communities = yield communitiesService_1.default.getCommunities();
    return res.status(200).json(communities);
}));
communitiesRouter.get('/discussion-counts', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('GET_ADMIN_STATISTICS'), (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield communitiesService_1.default.getCommunitiesWithDiscussionCounts();
    return res.status(200).json(count);
}));
communitiesRouter.get('/:communityId', middleware_1.default.jwtVerify, (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const communityId = Number(req.params.communityId);
    if (isNaN(communityId)) {
        return res.status(400).json({ error: 'Invalid community ID' });
    }
    const communities = yield communitiesService_1.default.getCommunityById(communityId);
    return res.status(200).json(communities);
}));
communitiesRouter.patch('/:communityId/update', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('UPDATE_COMMUNITY'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const communityId = Number(req.params.communityId);
    const communityData = req.body;
    if (isNaN(communityId)) {
        return res.status(400).json({ error: 'Invalid community ID' });
    }
    const updatedCommunity = yield communitiesService_1.default.updateCommunity(communityId, communityData);
    return res.status(200).json(updatedCommunity);
}));
communitiesRouter.post('/', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('CREATE_COMMUNITY'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.decodedToken.id);
    const { communityName, description } = req.body;
    if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
    }
    if (!communityName) {
        return res.status(400).json({ error: 'Community name is required' });
    }
    if (communityName.length < 3 || communityName.length > 30) {
        return res
            .status(400)
            .json({ error: 'Community name is too short or long' });
    }
    if (description && description.length > 300 && description.length < 3) {
        return res
            .status(400)
            .json({ error: 'Description is too long or short' });
    }
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(communityName)) {
        return res.status(400).json({
            error: 'Community name can only contain alphabetic characters.',
        });
    }
    const descRegex = /^[a-zA-Z0-9\s.,'";:!?\-()&]+$/;
    if (description && !descRegex.test(description)) {
        return res.status(400).json({
            error: 'Description contains invalid characters.',
        });
    }
    const community = yield communitiesService_1.default.addCommunity(communityName, userId, description);
    return res.status(201).json(community);
}));
communitiesRouter.post('/:communityId/follow', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('FOLLOW_COMMUNITY'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const communityId = Number(req.params.communityId);
    if (isNaN(communityId)) {
        return res.status(400).json({ error: 'Invalid community ID' });
    }
    const follow = yield communitiesService_1.default.followCommunity(userId, communityId);
    return res.status(201).json(follow);
}));
communitiesRouter.delete('/:communityId/follow', middleware_1.default.jwtVerify, middleware_1.default.checkPermission('FOLLOW_COMMUNITY'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.decodedToken.id;
    const communityId = Number(req.params.communityId);
    if (isNaN(communityId)) {
        return res.status(400).json({ error: 'Invalid community ID' });
    }
    const unfollow = yield communitiesService_1.default.unfollowCommunity(userId, communityId);
    return res.status(201).json(unfollow);
}));
exports.default = communitiesRouter;
