exports.up = function(knex) {
  return knex.schema
    .createTable('audit_logs', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('entity_type').notNullable();
      table.uuid('entity_id').notNullable();
      table.string('action').notNullable();
      table.jsonb('changes');
      table.uuid('performed_by').references('id').inTable('users');
      table.string('ip_address');
      table.string('user_agent');
      table.timestamp('timestamp').defaultTo(knex.fn.now());
      table.index(['entity_type', 'entity_id', 'timestamp']);
    })
    .createTable('compliance_audits', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.enum('audit_type', ['GLOBALG.A.P', 'ORGANIC', 'NATIONAL', 'EXPORT']).notNullable();
      table.date('audit_date').notNullable();
      table.string('auditor_name');
      table.enum('status', ['scheduled', 'in_progress', 'completed', 'failed']).defaultTo('scheduled');
      table.string('certificate_number');
      table.date('certificate_expiry');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('audit_findings', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('audit_id').notNullable().references('id').inTable('compliance_audits').onDelete('CASCADE');
      table.string('category').notNullable();
      table.text('description');
      table.enum('severity', ['critical', 'major', 'minor']).notNullable();
      table.text('corrective_action');
      table.date('due_date');
      table.enum('status', ['open', 'in_progress', 'closed']).defaultTo('open');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('audit_findings')
    .dropTableIfExists('compliance_audits')
    .dropTableIfExists('audit_logs');
};
