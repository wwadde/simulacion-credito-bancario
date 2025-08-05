import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  gatewayUrl: 'http://localhost:8090',
  authApiUrl: 'http://localhost:8090/auth',
  personaApiUrl: 'http://localhost:8090/persona',
  cuentaApiUrl: 'http://localhost:8090/cuenta',
  creditoApiUrl: 'http://localhost:8090/credito',
  logLevel: 'warn'
};
