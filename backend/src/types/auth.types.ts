export interface RefreshTokenRecord {
  id: number;
  person_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
  is_valid: boolean;
}

export interface PasswordResetToken {
  id: number;
  person_id: number;
  token: string;
  expires_at: Date;
  created_at: Date;
  is_used: boolean;
}
