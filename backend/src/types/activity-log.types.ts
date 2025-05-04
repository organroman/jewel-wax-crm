export interface ActivityLogInput {
  actor_id: number | null;
  action: string;  // create, update etc
  target_type: string; // e.g. "person"
  target_id: number;
  details?: Record<string, any>; 
}
