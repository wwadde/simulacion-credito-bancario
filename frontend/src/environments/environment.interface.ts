export interface Environment {
  production: boolean;
  gatewayUrl: string;
  authApiUrl: string;
  personaApiUrl: string;
  cuentaApiUrl: string;
  creditoApiUrl: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}
