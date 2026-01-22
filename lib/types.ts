export interface Income {
  id: number;
  date: string;
  amount: number;
  notes?: string;
  created_at: string;
}

export interface Expense {
  id: number;
  date: string;
  type: 'charging' | 'other';
  amount: number;
  notes?: string;
  created_at: string;
}

export interface Loan {
  id: number;
  name: string;
  principal_amount: number;
  interest_rate: number;
  amount_paid: number;
  balance: number;
  due_date?: string;
  status: 'active' | 'paid' | 'overdue';
  created_at: string;
}

export interface WorkHours {
  id: number;
  date: string;
  hours_worked: number;
  start_time?: string;
  end_time?: string;
  notes?: string;
  created_at: string;
}

export interface LoanPayment {
  id: number;
  loan_id: number;
  amount: number;
  payment_date: string;
  notes?: string;
  created_at: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  totalLoans: number;
  loansPaid: number;
  netProfit: number;
  totalHoursWorked: number;
  chargingExpenses: number;
  otherExpenses: number;
}
