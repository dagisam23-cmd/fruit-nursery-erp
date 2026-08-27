exports.up = function(knex) {
  return knex.schema
    .createTable('employees', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('employee_number').unique().notNullable();
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('email').unique();
      table.string('phone');
      table.enum('employment_type', ['PERMANENT', 'SEASONAL', 'CONTRACT', 'SPECIALIST']).defaultTo('PERMANENT');
      table.string('department');
      table.string('designation');
      table.date('join_date');
      table.string('biometric_id');
      table.enum('biometric_type', ['FINGERPRINT', 'FACE', 'RFID', 'NONE']).defaultTo('NONE');
      table.decimal('salary', 10, 2);
      table.enum('status', ['active', 'inactive', 'on_leave']).defaultTo('active');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.index(['department', 'status']);
    })
    .createTable('attendance', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('employee_id').notNullable().references('id').inTable('employees').onDelete('CASCADE');
      table.timestamp('check_in_time');
      table.timestamp('check_out_time');
      table.decimal('hours_worked', 5, 2);
      table.decimal('overtime_hours', 5, 2);
      table.enum('status', ['present', 'absent', 'late', 'half_day']).defaultTo('present');
      table.date('attendance_date').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.unique(['employee_id', 'attendance_date']);
      table.index(['attendance_date', 'status']);
    })
    .createTable('payroll', function(table) {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('employee_id').notNullable().references('id').inTable('employees');
      table.date('payroll_period_start');
      table.date('payroll_period_end');
      table.decimal('base_salary', 10, 2);
      table.decimal('overtime_pay', 10, 2).defaultTo(0);
      table.decimal('deductions', 10, 2).defaultTo(0);
      table.decimal('net_pay', 10, 2);
      table.enum('status', ['draft', 'approved', 'paid']).defaultTo('draft');
      table.date('payment_date');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('payroll')
    .dropTableIfExists('attendance')
    .dropTableIfExists('employees');
};
