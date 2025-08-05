export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  error?: string;
}

export interface RefreshTokenRequest {
  accessToken: string;
}

export interface LoginRequest {
  document: string;
  password: string;
}
