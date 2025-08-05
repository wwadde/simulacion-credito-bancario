export interface AccountDTO {
  id: number;
  paymentList: PaymentDTO[];
  balance: number;
  person: PersonResponseDTO;
}

export interface PaymentDTO {
  id: number;
  paymentDate: string;
  description: string;
  value: number;
}

export interface PersonResponseDTO {
  id: number;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  documentType: string;
  document: string;
  birthDate: string;
  status: string;
}
