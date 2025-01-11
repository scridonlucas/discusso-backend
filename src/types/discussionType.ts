export interface DiscussionAttributes {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NewDiscussion {
  title: string;
  content: string;
  communityId: number;
}
export interface NewComment {
  content: string;
}

export interface UpdatedDiscussion {
  title?: string;
  content?: string;
}

export interface NewReport {}

export interface ReportData {
  reportReason: reportReason;
  reportNote?: string;
}

export type reportReason =
  | 'SPAM'
  | 'ADVERTISING'
  | 'FRAUD'
  | 'FINANCIAL_MANIPULATION'
  | 'MISINFORMATION'
  | 'INAPPROPRIATE_CONTENT'
  | 'HARASSMENT'
  | 'OFF_TOPIC'
  | 'OTHER';
