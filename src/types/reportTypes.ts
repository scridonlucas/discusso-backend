export interface NewCloseReport {
  targetResourceId: number;
  reportedUserId: number;
  action: 'DISMISS' | 'REMOVE_RESOURCE' | 'REMOVE_AND_BAN';
  reason: string;
}
