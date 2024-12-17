export interface NewModerationLog {
  adminId: number;
  userId?: number;
  action: string;
  targetId?: number;
}
