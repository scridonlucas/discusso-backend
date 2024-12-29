export interface DiscussionQueryParams {
  limit?: string;
  cursor?: string;
  community_id?: string;
  feed_type?: 'explore' | 'following';
  sort?: 'recent' | 'oldest' | 'most_liked' | 'most_commented';
  date_range?: 'last_hour' | 'last_day' | 'last_week' | 'last_month';
  saved?: boolean;
  search?: string;
}

export interface CommentQueryParams {
  limit?: string;
  cursor?: string;
  sort?: 'recent' | 'oldest' | 'most_liked';
}

export interface ReportsQueryParams {
  limit?: string;
  cursor?: string;
  status?: 'PENDING' | 'RESOLVED' | 'DISMISSED';
}
