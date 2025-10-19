export interface Transaction {
  id: string;
  date: string;
  payee: string;
  categoryId?: string;
  accountId: string;
  amount: number; // positive = income, negative = expense
  memo?: string;
  cleared: boolean;
  reconciled?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Transfer extends Transaction {
  targetAccountId: string;
}
