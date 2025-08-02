// migrations/20230802_create_all_tables_with_audit.js

exports.up = function (knex) {
  return knex.schema

    // Users table
    .createTable('users', function (table) {
      table.increments('id').primary();
      table.string('name', 100).notNullable();
      table.string('email', 100).notNullable().unique();
      table.enu('role', ['student', 'admin', 'proctor']).notNullable();
      table.string('password_hash', 200).notNullable();

      // Soft delete and audit columns
      table.enu('status', ['0', '1']).defaultTo('1').notNullable(); // 1=active, 0=deleted

      // Nullable created_by due to circular FK (first user may not have creator)
      table.integer('created_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');

      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

      table.integer('updated_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('updated_at').nullable();
    })

    // Exams table
    .createTable('exams', function (table) {
      table.increments('id').primary();
      table.string('title', 100).notNullable();
      table.integer('round_number').defaultTo(1);
      table.text('description');

      // Soft delete and audit columns
      table.enu('status', ['0', '1']).defaultTo('1').notNullable();

      table.integer('created_by').unsigned().notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

      table.integer('updated_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('updated_at').nullable();
    })

    // Exam days table
    .createTable('exam_days', function (table) {
      table.increments('id').primary();
      table.integer('exam_id').unsigned().notNullable().references('id').inTable('exams').onDelete('CASCADE');
      table.date('exam_date').notNullable();

      // Soft delete and audit columns
      table.enu('status', ['0', '1']).defaultTo('1').notNullable();

      table.integer('created_by').unsigned().notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

      table.integer('updated_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('updated_at').nullable();
    })

    // Papers table
    .createTable('papers', function (table) {
      table.increments('id').primary();
      table.integer('generated_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('generated_at').defaultTo(knex.fn.now());
      table.integer('exam_id').unsigned().notNullable().references('id').inTable('exams').onDelete('CASCADE');

      // Soft delete and audit columns
      table.enu('status', ['0', '1']).defaultTo('1').notNullable();

      table.integer('created_by').unsigned().notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

      table.integer('updated_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('updated_at').nullable();
    })

    // Slots table
    .createTable('slots', function (table) {
      table.increments('id').primary();
      table.integer('exam_day_id').unsigned().notNullable().references('id').inTable('exam_days').onDelete('CASCADE');
      table.time('start_time').notNullable();
      table.time('end_time').notNullable();
      table.integer('paper_id').unsigned().nullable().references('id').inTable('papers').onDelete('SET NULL');

      // Soft delete and audit columns
      table.enu('status', ['0', '1']).defaultTo('1').notNullable();

      table.integer('created_by').unsigned().notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

      table.integer('updated_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('updated_at').nullable();
    })

    // Questions table
    .createTable('questions', function (table) {
      table.increments('id').primary();
      table.integer('exam_id').unsigned().nullable().references('id').inTable('exams').onDelete('SET NULL');
      table.text('stem').notNullable();
      table.enu('difficulty', ['easy', 'medium', 'hard']).notNullable();
      table.integer('created_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');

      // Soft delete and audit columns
      table.enu('status', ['0', '1']).defaultTo('1').notNullable();

      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

      table.integer('updated_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('updated_at').nullable();
    })

    // Options table
    .createTable('options', function (table) {
      table.increments('id').primary();
      table.integer('question_id').unsigned().notNullable().references('id').inTable('questions').onDelete('CASCADE');
      table.string('option_text', 255).notNullable();
      table.string('option_label', 1).notNullable(); // 'A','B','C','D'
      table.boolean('is_correct').defaultTo(false);

      // Soft delete and audit columns
      table.enu('status', ['0', '1']).defaultTo('1').notNullable();

      table.integer('created_by').unsigned().notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

      table.integer('updated_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('updated_at').nullable();
    })

    // Paper questions table (junction table)
    .createTable('paper_questions', function (table) {
      table.increments('id').primary();
      table.integer('paper_id').unsigned().notNullable().references('id').inTable('papers').onDelete('CASCADE');
      table.integer('question_id').unsigned().notNullable().references('id').inTable('questions').onDelete('CASCADE');
      table.integer('question_order').defaultTo(1);

      // Audit columns
      table.integer('created_by').unsigned().notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

      table.integer('updated_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('updated_at').nullable();
    })

    // Exam registrations table
    .createTable('exam_registrations', function (table) {
      table.increments('id').primary();
      table.integer('student_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('exam_id').unsigned().notNullable().references('id').inTable('exams').onDelete('CASCADE');
      table.integer('slot_id').unsigned().notNullable().references('id').inTable('slots').onDelete('CASCADE');

      // Logical exam status (no soft delete here)
      table.enu('status', ['registered', 'completed', 'absent', 'rescheduled']).defaultTo('registered').notNullable();

      // Separate soft delete flag
      table.enu('soft_delete', ['0', '1']).defaultTo('1').notNullable();

      table.timestamp('registered_at').defaultTo(knex.fn.now());

      table.string('reschedule_reason', 255);

      // Audit columns
      table.integer('created_by').unsigned().notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

      table.integer('updated_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('updated_at').nullable();
    })

    // Answers table
    .createTable('answers', function (table) {
      table.increments('id').primary();
      table.integer('registration_id').unsigned().notNullable().references('id').inTable('exam_registrations').onDelete('CASCADE');
      table.integer('paper_question_id').unsigned().notNullable().references('id').inTable('paper_questions').onDelete('CASCADE');
      table.string('selected_option', 1);
      table.timestamp('answered_at').defaultTo(knex.fn.now());

      // Soft delete and audit columns
      table.enu('status', ['0', '1']).defaultTo('1').notNullable();

      table.integer('created_by').unsigned().notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

      table.integer('updated_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('updated_at').nullable();
    })

    // Proctor flags table
    .createTable('proctor_flags', function (table) {
      table.increments('id').primary();
      table.integer('registration_id').unsigned().notNullable().references('id').inTable('exam_registrations').onDelete('CASCADE');
      table.integer('flagged_by').unsigned().notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.string('reason', 255).notNullable();
      table.text('notes');
      table.timestamp('flagged_at').defaultTo(knex.fn.now());

      // Soft delete and audit columns
      table.enu('status', ['0', '1']).defaultTo('1').notNullable();

      table.integer('created_by').unsigned().notNullable().references('id').inTable('users').onDelete('RESTRICT');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

      table.integer('updated_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('updated_at').nullable();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('proctor_flags')
    .dropTableIfExists('answers')
    .dropTableIfExists('exam_registrations')
    .dropTableIfExists('paper_questions')
    .dropTableIfExists('options')
    .dropTableIfExists('questions')
    .dropTableIfExists('slots')
    .dropTableIfExists('papers')
    .dropTableIfExists('exam_days')
    .dropTableIfExists('exams')
    .dropTableIfExists('users');
};
