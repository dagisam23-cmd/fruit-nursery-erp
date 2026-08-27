exports.up = function(knex) {
  return knex.schema
    .createTable('inventory_items', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.enum('item_type', [
        'SEEDS', 'ROOTSTOCKS', 'SCIONS', 'POTS', 'POLYBAGS', 'FERTILIZERS',
        'CHEMICALS', 'IRRIGATION_COMPONENTS', 'LABELS', 'PACKAGING_MATERIALS'
      ]).notNullable();
      table.string('item_name').notNullable();
      table.string('sku').unique().notNullable();
      table.string('barcode').unique();
      table.string('rfid_tag').unique();
      table.integer('quantity').defaultTo(0);
      table.string('unit').notNullable();
      table.integer('reorder_level').defaultTo(0);
      table.date('expiry_date');
      table.string('location');
      table.string('supplier');
      table.decimal('unit_cost', 10, 2).defaultTo(0);
      table.decimal('total_value', 12, 2).defaultTo(0);
      table.timestamp('last_restock_date');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.index(['item_type', 'quantity']);
    })
    .createTable('inventory_adjustments', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('item_id').notNullable().references('id').inTable('inventory_items').onDelete('CASCADE');
      table.integer('previous_quantity');
      table.integer('new_quantity');
      table.string('reason');
      table.uuid('adjusted_by').references('id').inTable('users');
      table.date('adjustment_date');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('suppliers', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('supplier_name').unique().notNullable();
      table.string('contact_person');
      table.string('email');
      table.string('phone');
      table.string('address');
      table.string('city');
      table.string('country');
      table.decimal('average_lead_time_days', 5, 2);
      table.decimal('average_quality_rating', 3, 2);
      table.boolean('is_active').defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('purchase_orders', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('po_number').unique().notNullable();
      table.uuid('supplier_id').notNullable().references('id').inTable('suppliers');
      table.uuid('requisition_id').references('id').inTable('purchase_requisitions');
      table.decimal('total_amount', 12, 2).defaultTo(0);
      table.enum('status', ['draft', 'submitted', 'approved', 'received', 'paid']).defaultTo('draft');
      table.date('order_date').notNullable();
      table.date('expected_delivery_date');
      table.date('actual_delivery_date');
      table.uuid('created_by').references('id').inTable('users');
      table.uuid('approved_by').references('id').inTable('users');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.index(['status', 'order_date']);
    })
    .createTable('purchase_order_items', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('purchase_order_id').notNullable().references('id').inTable('purchase_orders').onDelete('CASCADE');
      table.uuid('item_id').notNullable().references('id').inTable('inventory_items');
      table.integer('quantity').notNullable();
      table.decimal('unit_price', 10, 2).notNullable();
      table.decimal('total_price', 12, 2).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('purchase_requisitions', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('requisition_number').unique().notNullable();
      table.uuid('requested_by').references('id').inTable('users');
      table.enum('status', ['draft', 'submitted', 'approved', 'rejected']).defaultTo('draft');
      table.uuid('approved_by').references('id').inTable('users');
      table.text('justification');
      table.date('required_by_date');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('purchase_requisitions')
    .dropTableIfExists('purchase_order_items')
    .dropTableIfExists('purchase_orders')
    .dropTableIfExists('suppliers')
    .dropTableIfExists('inventory_adjustments')
    .dropTableIfExists('inventory_items');
};
