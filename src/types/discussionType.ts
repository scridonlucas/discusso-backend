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

export interface UpdatedDiscussion {
  title?: string;
  content?: string;
}
