export interface SpendingReport {
  id: string;
  from: string;
  to: string;
  totalExpenses: number;
  totalIncome: number;
  categories: CategorySummary[];
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  spent: number;
  budgeted: number;
}
