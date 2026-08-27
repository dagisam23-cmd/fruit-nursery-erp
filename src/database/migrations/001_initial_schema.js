exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('username').unique().notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.string('first_name');
      table.string('last_name');
      table.enum('role', [
        'CEO', 'MANAGING_DIRECTOR', 'NURSERY_MANAGER', 'PRODUCTION_SUPERVISOR',
        'AGRONOMIST', 'GRAFTER', 'INVENTORY_OFFICER', 'PROCUREMENT_OFFICER',
        'SALES_OFFICER', 'FINANCE_OFFICER', 'HR_OFFICER', 'COMPLIANCE_AUDITOR',
        'CUSTOMER', 'EXTERNAL_INSPECTOR'
      ]).defaultTo('CUSTOMER');
      table.string('location');
      table.enum('device_type', ['DESKTOP', 'TABLET', 'MOBILE', 'INDUSTRIAL']).defaultTo('DESKTOP');
      table.boolean('is_active').defaultTo(true);
      table.timestamp('last_login');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('nursery_locations', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('location_name').notNullable();
      table.enum('location_type', [
        'HEADQUARTERS', 'NURSERY_BLOCK', 'WAREHOUSE', 'GREENHOUSE',
        'HARDENING_AREA', 'DISPATCH_CENTER', 'DEMO_SITE'
      ]).notNullable();
      table.string('address');
      table.decimal('latitude', 10, 8);
      table.decimal('longitude', 11, 8);
      table.integer('capacity');
      table.integer('occupancy').defaultTo(0);
      table.string('health_status').defaultTo('healthy');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('batches', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('batch_number').unique().notNullable();
      table.string('seed_source');
      table.string('supplier');
      table.date('collection_date');
      table.string('variety').notNullable();
      table.string('parent_material');
      table.date('germination_date');
      table.date('potting_date');
      table.date('grafting_date');
      table.date('hardening_date');
      table.integer('total_quantity').notNullable();
      table.enum('status', ['in_progress', 'completed', 'archived']).defaultTo('in_progress');
      table.uuid('location_id').references('id').inTable('nursery_locations');
      table.uuid('created_by').references('id').inTable('users');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.index(['status', 'created_at']);
    })
    .createTable('batch_stages', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('batch_id').notNullable().references('id').inTable('batches').onDelete('CASCADE');
      table.integer('stage_number').notNullable();
      table.string('stage_name').notNullable(); // Seed Collection, Germination, Grafting, etc.
      table.integer('quantity_entered').defaultTo(0);
      table.integer('quantity_passed').defaultTo(0);
      table.integer('quantity_lost').defaultTo(0);
      table.decimal('survival_rate', 5, 2).defaultTo(100);
      table.integer('average_days_in_stage').defaultTo(0);
      table.date('start_date');
      table.date('end_date');
      table.text('notes');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.unique(['batch_id', 'stage_number']);
    })
    .createTable('plants', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('batch_id').notNullable().references('id').inTable('batches').onDelete('CASCADE');
      table.string('plant_number').unique().notNullable();
      table.decimal('height', 8, 2); // cm
      table.decimal('stem_diameter', 8, 2); // mm
      table.string('root_development');
      table.integer('leaf_count');
      table.decimal('biomass_estimation', 8, 2); // grams
      table.string('health_status').defaultTo('healthy');
      table.timestamp('last_measurement_date');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('inspections', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('plant_id').references('id').inTable('plants');
      table.uuid('batch_id').notNullable().references('id').inTable('batches').onDelete('CASCADE');
      table.uuid('inspector_id').references('id').inTable('users');
      table.timestamp('inspection_date').notNullable();
      table.decimal('plant_height', 8, 2);
      table.decimal('stem_diameter', 8, 2);
      table.integer('leaf_count');
      table.string('health_status');
      table.text('notes');
      table.jsonb('photos');
      table.text('voice_notes');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.index(['batch_id', 'inspection_date']);
    })
    .createTable('diseases', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('batch_id').notNullable().references('id').inTable('batches').onDelete('CASCADE');
      table.uuid('plant_id').references('id').inTable('plants');
      table.string('disease_name').notNullable();
      table.text('symptoms');
      table.enum('severity', ['low', 'medium', 'high']).defaultTo('low');
      table.jsonb('images');
      table.text('treatment_recommendation');
      table.boolean('isolation_required').defaultTo(false);
      table.date('recorded_date').notNullable();
      table.uuid('recorded_by').references('id').inTable('users');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.index(['batch_id', 'recorded_date']);
    })
    .createTable('observations', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('batch_id').notNullable().references('id').inTable('batches').onDelete('CASCADE');
      table.uuid('plant_id').references('id').inTable('plants');
      table.uuid('observer_id').references('id').inTable('users');
      table.timestamp('observation_date').defaultTo(knex.fn.now());
      table.text('description');
      table.jsonb('photos');
      table.text('voice_notes');
      table.jsonb('corrective_actions');
      table.uuid('assigned_to').references('id').inTable('users');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('observations')
    .dropTableIfExists('diseases')
    .dropTableIfExists('inspections')
    .dropTableIfExists('plants')
    .dropTableIfExists('batch_stages')
    .dropTableIfExists('batches')
    .dropTableIfExists('nursery_locations')
    .dropTableIfExists('users');
};
