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
