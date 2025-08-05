export interface PersonDTO {
  id: number;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  documentType: DocumentType;
  document: string;
  birthDate: string;
  status: string;
}

export interface AddPersonDTO {
  name: string;
  surname?: string;
  phoneNumber?: string;
  address?: string;
  email: string;
  documentType: DocumentType;
  document: string;
  birthDate?: string;
  password: string;
}

export interface EditPersonDTO {
  id: number;
  name?: string;
  surname?: string;
  phoneNumber?: string;
  address?: string;
  email?: string;
  birthDate?: string;
  status?: PersonStatus;
}

export interface LoginDTO {
  document: string;
  password: string;
}

export enum DocumentType {
  CC = 'CC',
  TI = 'TI',
  CE = 'CE',
  PA = 'PA'
}

export enum PersonStatus {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO'
}
