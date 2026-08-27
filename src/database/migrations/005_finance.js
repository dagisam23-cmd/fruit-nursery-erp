exports.up = function(knex) {
  return knex.schema
    .createTable('financial_transactions', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('transaction_number').unique().notNullable();
      table.enum('type', ['income', 'expense', 'transfer']).notNullable();
      table.string('category').notNullable();
      table.decimal('amount', 12, 2).notNullable();
      table.string('currency').defaultTo('USD');
      table.text('description');
      table.string('reference_number');
      table.enum('status', ['draft', 'posted', 'reconciled']).defaultTo('draft');
      table.date('transaction_date').notNullable();
      table.uuid('recorded_by').references('id').inTable('users');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.index(['type', 'transaction_date', 'status']);
    })
    .createTable('budgets', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('department').notNullable();
      table.integer('fiscal_year').notNullable();
      table.decimal('budgeted_amount', 12, 2).notNullable();
      table.decimal('actual_amount', 12, 2).defaultTo(0);
      table.text('notes');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.unique(['department', 'fiscal_year']);
    })
    .createTable('general_ledger', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('account_code').unique().notNullable();
      table.string('account_name').notNullable();
      table.string('account_type'); // Asset, Liability, Equity, Income, Expense
      table.decimal('balance', 14, 2).defaultTo(0);
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('general_ledger')
    .dropTableIfExists('budgets')
    .dropTableIfExists('financial_transactions');
};
