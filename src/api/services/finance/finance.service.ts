import db from '../database/connection';

export class FinanceService {
  /**
   * Get financial transactions
   */
  async getTransactions(page: number = 1, limit: number = 20, filters?: any) {
    const offset = (page - 1) * limit;
    let query = db('financial_transactions');

    if (filters?.type) {
      query = query.where('type', filters.type);
    }

    if (filters?.status) {
      query = query.where('status', filters.status);
    }

    if (filters?.startDate && filters?.endDate) {
      query = query.whereBetween('transaction_date', [
        filters.startDate,
        filters.endDate,
      ]);
    }

    const total = await query.clone().count('* as count').first();
    const transactions = await query
      .offset(offset)
      .limit(limit)
      .orderBy('transaction_date', 'desc');

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        pages: Math.ceil((total?.count || 0) / limit),
      },
    };
  }

  /**
   * Create financial transaction
   */
  async createTransaction(transactionData: any) {
    const [transaction] = await db('financial_transactions')
      .insert({
        transaction_number: transactionData.transactionNumber,
        type: transactionData.type,
        category: transactionData.category,
        amount: transactionData.amount,
        currency: transactionData.currency || 'USD',
        description: transactionData.description,
        reference_number: transactionData.referenceNumber,
        status: 'draft',
        transaction_date: new Date(),
        recorded_by: transactionData.recordedBy,
      })
      .returning('*');

    return transaction;
  }

  /**
   * Get P&L Report
   */
  async getProfitLossReport(startDate: Date, endDate: Date) {
    const income = await db('financial_transactions')
      .where('type', 'income')
      .whereBetween('transaction_date', [startDate, endDate])
      .sum('amount as total')
      .first();

    const expenses = await db('financial_transactions')
      .where('type', 'expense')
      .whereBetween('transaction_date', [startDate, endDate])
      .sum('amount as total')
      .first();

    const profit =
      (income?.total || 0) - (expenses?.total || 0);

    return {
      period: {
        startDate,
        endDate,
      },
      income: income?.total || 0,
      expenses: expenses?.total || 0,
      profit,
      profitMargin: income?.total ? (profit / income.total) * 100 : 0,
    };
  }

  /**
   * Get budget data
   */
  async getBudgets(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    const total = await db('budgets').count('* as count').first();
    const budgets = await db('budgets')
      .offset(offset)
      .limit(limit)
      .orderBy('created_at', 'desc');

    return {
      data: budgets,
      pagination: {
        page,
        limit,
        total: total?.count || 0,
        pages: Math.ceil((total?.count || 0) / limit),
      },
    };
  }

  /**
   * Create budget
   */
  async createBudget(budgetData: any) {
    const [budget] = await db('budgets')
      .insert({
        department: budgetData.department,
        fiscal_year: budgetData.fiscalYear,
        budgeted_amount: budgetData.budgetedAmount,
        actual_amount: 0,
        notes: budgetData.notes,
      })
      .returning('*');

    return budget;
  }
}

export default new FinanceService();
