
import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['administrator', 'staff', 'student']);
export const transactionTypeEnum = pgEnum('transaction_type', ['deposit', 'withdrawal']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  role: userRoleEnum('role').notNull(),
  password_hash: text('password_hash').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Classes table
export const classesTable = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  staff_id: integer('staff_id').notNull().references(() => usersTable.id),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Student profiles table
export const studentProfilesTable = pgTable('student_profiles', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id),
  student_id: text('student_id').notNull().unique(),
  class_id: integer('class_id').notNull().references(() => classesTable.id),
  current_balance: numeric('current_balance', { precision: 10, scale: 2 }).default('0.00').notNull(),
  total_deposits: numeric('total_deposits', { precision: 10, scale: 2 }).default('0.00').notNull(),
  total_withdrawals: numeric('total_withdrawals', { precision: 10, scale: 2 }).default('0.00').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Transactions table
export const transactionsTable = pgTable('transactions', {
  id: serial('id').primaryKey(),
  student_id: integer('student_id').notNull().references(() => studentProfilesTable.id),
  staff_id: integer('staff_id').notNull().references(() => usersTable.id),
  type: transactionTypeEnum('type').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  studentProfile: one(studentProfilesTable, {
    fields: [usersTable.id],
    references: [studentProfilesTable.user_id]
  }),
  managedClasses: many(classesTable),
  transactions: many(transactionsTable)
}));

export const classesRelations = relations(classesTable, ({ one, many }) => ({
  staff: one(usersTable, {
    fields: [classesTable.staff_id],
    references: [usersTable.id]
  }),
  students: many(studentProfilesTable)
}));

export const studentProfilesRelations = relations(studentProfilesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [studentProfilesTable.user_id],
    references: [usersTable.id]
  }),
  class: one(classesTable, {
    fields: [studentProfilesTable.class_id],
    references: [classesTable.id]
  }),
  transactions: many(transactionsTable)
}));

export const transactionsRelations = relations(transactionsTable, ({ one }) => ({
  student: one(studentProfilesTable, {
    fields: [transactionsTable.student_id],
    references: [studentProfilesTable.id]
  }),
  staff: one(usersTable, {
    fields: [transactionsTable.staff_id],
    references: [usersTable.id]
  })
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Class = typeof classesTable.$inferSelect;
export type NewClass = typeof classesTable.$inferInsert;
export type StudentProfile = typeof studentProfilesTable.$inferSelect;
export type NewStudentProfile = typeof studentProfilesTable.$inferInsert;
export type Transaction = typeof transactionsTable.$inferSelect;
export type NewTransaction = typeof transactionsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  classes: classesTable,
  studentProfiles: studentProfilesTable,
  transactions: transactionsTable
};
