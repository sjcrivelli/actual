export interface BudgetCategory {
  id: string;
  name: string;
  groupId?: string;
  budgeted: number;
  spent: number;
  available: number;
}

export interface BudgetGroup {
  id: string;
  name: string;
  categories: BudgetCategory[];
}

export interface MonthlyBudget {
  id: string;
  month: string; // ISO string like '2025-10'
  totalBudgeted: number;
  totalSpent: number;
  totalAvailable: number;
  groups: BudgetGroup[];
}
