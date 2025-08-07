import { AccountDTO, PaymentDTO } from './account.model';

export interface CreditDTO {
  id: number;
  loan: number;
  totalLoan: number;
  amountPaid: number;
  amountToPay: number;
  interestRate: number;
  agreedPayments: number;
  paymentsMade: number;
  creditGivenDate: string;
  creditExpirationDate: string;
  status: string;
  account: AccountDTO;
}

export interface CreateCreditDTO {
  loan: number;
  interestRate: number;
  agreedPayments: number;
  creditExpirationDate: string;
}

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface PageCreditDTO {
  content: CreditDTO[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
