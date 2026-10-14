export interface Category {
  id: string
  name: string
  type: 'REVENUE' | 'EXPENSE'
  parentId: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  date: Date
  amount: number
  type: 'REVENUE' | 'EXPENSE'
  categoryId: string
  paymentMethod?: string
  note?: string
  createdAt: Date
  updatedAt: Date
}

export interface ReportSummary {
  totalRevenue: number
  totalExpense: number
  dailyTrends: DailyTrend[]
  categoryBreakdown: CategoryBreakdown[]
}

export interface DailyTrend {
  date: string
  revenue: number
  expense: number
}

export interface CategoryBreakdown {
  categoryId: string
  categoryName: string
  amount: number
}
