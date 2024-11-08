export interface DiscussionQueryParams {
  limit?: string;
  cursor?: string;
  sort?: 'recent' | 'oldest' | 'most_liked' | 'most_commented';
  date_range?: 'last_hour' | 'last_day' | 'last_week' | 'last_month';
  feed_type?: 'for_you' | 'following';
}
