// seeds/001_initial_seed.js
const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Delete all existing entries in reverse dependency order
  await knex('proctor_flags').del();
  await knex('answers').del();
  await knex('exam_registrations').del();
  await knex('paper_questions').del();
  await knex('options').del();
  await knex('questions').del();
  await knex('slots').del();
  await knex('papers').del();
  await knex('exam_days').del();
  await knex('exams').del();
  await knex('users').del();

  // Password hashing helper
  const hashPassword = async (pwd) => await bcrypt.hash(pwd, 10);

  // Insert users (admin first because of foreign key dependencies)
  const users = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      password_hash: await hashPassword('AdminPass123'),
      status: '1',
      created_by: null, // first user created_by nullable due to circular FK
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      id: 2,
      name: 'Rahul Student',
      email: 'rahul@example.com',
      role: 'student',
      password_hash: await hashPassword('StudentPass123'),
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      id: 3,
      name: 'Priya Student',
      email: 'priya@example.com',
      role: 'student',
      password_hash: await hashPassword('StudentPass123'),
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      id: 4,
      name: 'Squad User',
      email: 'squad@example.com',
      role: 'proctor',
      password_hash: await hashPassword('ProctorPass123'),
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
  ];

  await knex('users').insert(users);

  // Exams
  const exams = [
    {
      id: 1,
      title: 'Math Exam',
      round_number: 1,
      description: 'Mathematics exam',
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      id: 2,
      title: 'Science Exam',
      round_number: 1,
      description: 'Science exam',
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
  ];
  await knex('exams').insert(exams);

  // Exam Days
  const examDays = [
    {
      id: 1,
      exam_id: 1,
      exam_date: '2025-08-10',
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      id: 2,
      exam_id: 1,
      exam_date: '2025-08-11',
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      id: 3,
      exam_id: 2,
      exam_date: '2025-08-10',
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
  ];
  await knex('exam_days').insert(examDays);

  // Papers
  const papers = [
    {
      id: 1,
      generated_by: 1,
      generated_at: new Date(),
      exam_id: 1,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      id: 2,
      generated_by: 1,
      generated_at: new Date(),
      exam_id: 1,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      id: 3,
      generated_by: 1,
      generated_at: new Date(),
      exam_id: 2,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
  ];
  await knex('papers').insert(papers);

  // Slots, linking some to papers
  const slots = [
    {
      id: 1,
      exam_day_id: 1,
      start_time: '10:00:00',
      end_time: '11:00:00',
      paper_id: 1,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      id: 2,
      exam_day_id: 1,
      start_time: '12:00:00',
      end_time: '13:00:00',
      paper_id: 2,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      id: 3,
      exam_day_id: 2,
      start_time: '10:00:00',
      end_time: '11:00:00',
      paper_id: null,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      id: 4,
      exam_day_id: 2,
      start_time: '12:00:00',
      end_time: '13:00:00',
      paper_id: null,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
  ];
  await knex('slots').insert(slots);

  // Questions
  const questions = [
    {
      id: 1,
      exam_id: 1,
      stem: 'What is 2 + 2?',
      difficulty: 'easy',
      created_by: 1,
      status: '1',
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      id: 2,
      exam_id: 1,
      stem: 'What is the square root of 16?',
      difficulty: 'medium',
      created_by: 1,
      status: '1',
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      id: 3,
      exam_id: 2,
      stem: 'What planet is known as the Red Planet?',
      difficulty: 'easy',
      created_by: 1,
      status: '1',
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
  ];
  await knex('questions').insert(questions);

  // Options
  const options = [
    // Question 1 options
    {
      question_id: 1,
      option_text: '3',
      option_label: 'A',
      is_correct: false,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      question_id: 1,
      option_text: '4',
      option_label: 'B',
      is_correct: true,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      question_id: 1,
      option_text: '5',
      option_label: 'C',
      is_correct: false,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      question_id: 1,
      option_text: '6',
      option_label: 'D',
      is_correct: false,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    // Question 2 options
    {
      question_id: 2,
      option_text: '2',
      option_label: 'A',
      is_correct: false,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      question_id: 2,
      option_text: '3',
      option_label: 'B',
      is_correct: false,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      question_id: 2,
      option_text: '4',
      option_label: 'C',
      is_correct: true,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      question_id: 2,
      option_text: '5',
      option_label: 'D',
      is_correct: false,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    // Question 3 options
    {
      question_id: 3,
      option_text: 'Earth',
      option_label: 'A',
      is_correct: false,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      question_id: 3,
      option_text: 'Mars',
      option_label: 'B',
      is_correct: true,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      question_id: 3,
      option_text: 'Jupiter',
      option_label: 'C',
      is_correct: false,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      question_id: 3,
      option_text: 'Venus',
      option_label: 'D',
      is_correct: false,
      status: '1',
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
  ];
  await knex('options').insert(options);

  // Paper Questions
  const paperQuestions = [
    {
      paper_id: 1,
      question_id: 1,
      question_order: 1,
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      paper_id: 1,
      question_id: 2,
      question_order: 2,
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      paper_id: 2,
      question_id: 1,
      question_order: 1,
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      paper_id: 3,
      question_id: 3,
      question_order: 1,
      created_by: 1,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
  ];
  await knex('paper_questions').insert(paperQuestions);

  // Exam registrations
  const registrations = [
    {
      student_id: 2,
      exam_id: 1,
      slot_id: 1,
      status: 'registered',
      soft_delete: '1',
      registered_at: new Date(),
      reschedule_reason: null,
      created_by: 2,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
    {
      student_id: 3,
      exam_id: 2,
      slot_id: 2,
      status: 'registered',
      soft_delete: '1',
      registered_at: new Date(),
      reschedule_reason: null,
      created_by: 3,
      created_at: new Date(),
      updated_by: null,
      updated_at: null,
    },
  ];
  await knex('exam_registrations').insert(registrations);

  // Answers and Proctor Flags can be seeded later during testing cycles as needed
};
