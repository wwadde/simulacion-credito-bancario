/**
 * Common types used across the application
 */

// Generic API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

// Generic Error Response
export interface ApiError {
  message: string;
  error?: string;
  statusCode: number;
  timestamp: string;
}

// Pagination types
export interface PaginationRequest {
  page: number;
  size: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// Form states
export type FormState = 'idle' | 'loading' | 'success' | 'error';

// Component states
export type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';

// Selection types
export interface SelectOption<T = any> {
  value: T;
  label: string;
  disabled?: boolean;
}

// Dialog result types
export type DialogResult<T = any> = {
  action: 'save' | 'cancel' | 'delete';
  data?: T;
};

// Status types commonly used
export type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

// Document types for Colombia
export type DocumentType = 'CC' | 'CE' | 'TI' | 'NIT';

// Credit status types
export type CreditStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'PAID' | 'DEFAULTED';

// Account types
export type AccountType = 'SAVINGS' | 'CHECKING' | 'CREDIT';

// Utility types
export type NonNullable<T> = T extends null | undefined ? never : T;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
