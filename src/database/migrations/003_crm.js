exports.up = function(knex) {
  return knex.schema
    .createTable('customers', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('customer_name').notNullable();
      table.enum('customer_type', [
        'FARMER', 'COOPERATIVE', 'COMMERCIAL_FARM', 'NGO', 'GOVERNMENT', 'EXPORT_BUYER'
      ]).notNullable();
      table.string('contact_person');
      table.string('phone');
      table.string('email');
      table.string('address');
      table.string('city');
      table.string('state');
      table.string('country');
      table.decimal('credit_limit', 12, 2).defaultTo(0);
      table.decimal('satisfaction_rating', 3, 2).defaultTo(0);
      table.jsonb('preferred_varieties');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('leads', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNullable();
      table.string('email');
      table.string('phone');
      table.string('company');
      table.enum('status', ['new', 'contacted', 'qualified', 'lost', 'won']).defaultTo('new');
      table.string('source');
      table.uuid('created_by').references('id').inTable('users');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('orders', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('order_number').unique().notNullable();
      table.uuid('customer_id').notNullable().references('id').inTable('customers').onDelete('CASCADE');
      table.decimal('total_amount', 12, 2).defaultTo(0);
      table.enum('status', [
        'lead', 'prospect', 'quotation', 'negotiation', 'confirmed', 'dispatched', 'delivered'
      ]).defaultTo('lead');
      table.date('order_date').notNullable();
      table.date('delivery_date');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.index(['status', 'order_date']);
    })
    .createTable('order_items', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('order_id').notNullable().references('id').inTable('orders').onDelete('CASCADE');
      table.uuid('batch_id').references('id').inTable('batches');
      table.integer('quantity').notNullable();
      table.decimal('unit_price', 10, 2).notNullable();
      table.decimal('total_price', 12, 2).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('order_items')
    .dropTableIfExists('orders')
    .dropTableIfExists('leads')
    .dropTableIfExists('customers');
};
