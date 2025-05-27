export interface ActivityLogInput {
  actor_id: number | null;
  action: string; // create, update etc
  target_type: string; // e.g. "person"
  target_id: number;
  details?: Record<string, any>;
}

export interface ActivityLog {
  id: number;
  action: string;
  target_type: string;
  target_id: number;
  details: Record<string, any> | null;
  actor_id: number | null;
}

export interface ActivityLogWithActorFullName extends ActivityLog {
  actor_fullname: string;
}

export interface GetActivityParams {
  target: string;
  targetId: number;
}
