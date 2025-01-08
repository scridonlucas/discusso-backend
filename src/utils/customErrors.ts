export class CustomTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenError';
  }
}

export class CustomPermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

export class CustomDiscussionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DiscussionError';
  }
}

export class CustomCommunityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommunityError';
  }
}

export class CustomReportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReportError';
  }
}

export class CustomAPIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'External API Error';
  }
}

export class CustomModerationAIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'External Moderationn AI Error';
  }
}

export class CustomStocksError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Stocks Error';
  }
}

export class CustomUserStatusError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserStatusError';
  }
}
