export interface ActivityLog {
  id: number;
  action: string;
  target_type: string;
  target_id: number;
  created_at: Date;
  actor_id: number;
  actor_fullname: string;
  details: Record<string, any> | null;
}
