// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    REFRESH_TOKEN: '/api/refresh-token'
  },
  PERSON: {
    BASE: '/private/personas',
    BY_ID: (id: number) => `/private/personas/${id}`,
    SEARCH: '/private/personas/search'
  },
  ACCOUNT: {
    BASE: '/private/cuentas',
    BY_ID: (id: number) => `/private/cuentas/${id}`,
    BY_PERSON: (personId: number) => `/private/cuentas/persona/${personId}`
  },
  CREDIT: {
    BASE: '/private/creditos',
    BY_ID: (id: number) => `/private/creditos/${id}`,
    BY_PERSON: (personId: number) => `/private/creditos/persona/${personId}`,
    SIMULATE: '/private/creditos/simular'
  },
  DASHBOARD: {
    STATS: '/private/dashboard/stats'
  }
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  EXPIRES_AT: 'expires_at',
  TOKEN_TYPE: 'token_type'
} as const;

// UI Constants
export const UI_CONSTANTS = {
  SNACKBAR_DURATION: 3000,
  DIALOG_WIDTH: '500px',
  LOADING_DEBOUNCE_TIME: 300
} as const;

// Validation Constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
  DOCUMENT_PATTERNS: {
    CC: /^\d{8,10}$/,
    CE: /^\d{6,10}$/,
    TI: /^\d{10,11}$/,
    NIT: /^\d{9,10}-?\d$/
  }
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;
