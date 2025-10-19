export interface Account {
  id: string;
  name: string;
  institution?: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreditCardAccount extends Account {
  type: 'credit';
  limit?: number;
  apr?: number;
  dueDate?: string;
}
