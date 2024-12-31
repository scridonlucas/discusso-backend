"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomUserStatusError = exports.CustomStocksError = exports.CustomAPIError = exports.CustomReportError = exports.CustomCommunityError = exports.CustomDiscussionError = exports.CustomPermissionError = exports.CustomTokenError = void 0;
class CustomTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TokenError';
    }
}
exports.CustomTokenError = CustomTokenError;
class CustomPermissionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PermissionError';
    }
}
exports.CustomPermissionError = CustomPermissionError;
class CustomDiscussionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DiscussionError';
    }
}
exports.CustomDiscussionError = CustomDiscussionError;
class CustomCommunityError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CommunityError';
    }
}
exports.CustomCommunityError = CustomCommunityError;
class CustomReportError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ReportError';
    }
}
exports.CustomReportError = CustomReportError;
class CustomAPIError extends Error {
    constructor(message) {
        super(message);
        this.name = 'External API Error';
    }
}
exports.CustomAPIError = CustomAPIError;
class CustomStocksError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Stocks Error';
    }
}
exports.CustomStocksError = CustomStocksError;
class CustomUserStatusError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserStatusError';
    }
}
exports.CustomUserStatusError = CustomUserStatusError;
