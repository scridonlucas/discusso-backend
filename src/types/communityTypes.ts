export interface NewCommunity {
  communityName: string;
  description?: string;
}

export interface CommunityUpdateInput {
  communityName?: string;
  description?: string;
  isDeleted?: boolean;
}
