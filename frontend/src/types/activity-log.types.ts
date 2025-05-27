export interface ActivityLog {
  id: number;
  action: string;
  target_type: string;
  target_id: number;
  details: Record<string, any> | null;
}
