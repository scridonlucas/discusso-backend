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

export interface ReportDiscussionReason {
  reportReason: string;
}
