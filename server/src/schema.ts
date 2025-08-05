
import { z } from 'zod';

// User role enum
export const userRoleSchema = z.enum(['administrator', 'staff', 'student']);
export type UserRole = z.infer<typeof userRoleSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  role: userRoleSchema,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});
export type User = z.infer<typeof userSchema>;

// Class/Group schema
export const classSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  staff_id: z.number(),
  created_at: z.coerce.date()
});
export type Class = z.infer<typeof classSchema>;

// Student profile schema
export const studentProfileSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  student_id: z.string(),
  class_id: z.number(),
  current_balance: z.number(),
  total_deposits: z.number(),
  total_withdrawals: z.number(),
  created_at: z.coerce.date()
});
export type StudentProfile = z.infer<typeof studentProfileSchema>;

// Transaction type enum
export const transactionTypeSchema = z.enum(['deposit', 'withdrawal']);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

// Transaction schema
export const transactionSchema = z.object({
  id: z.number(),
  student_id: z.number(),
  staff_id: z.number(),
  type: transactionTypeSchema,
  amount: z.number(),
  description: z.string().nullable(),
  created_at: z.coerce.date()
});
export type Transaction = z.infer<typeof transactionSchema>;

// Input schemas for user management
export const createUserInputSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  role: userRoleSchema,
  password: z.string().min(6)
});
export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const updateUserInputSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  is_active: z.boolean().optional()
});
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Input schemas for authentication
export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const changePasswordInputSchema = z.object({
  user_id: z.number(),
  current_password: z.string(),
  new_password: z.string().min(6)
});
export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;

export const resetPasswordInputSchema = z.object({
  user_id: z.number(),
  new_password: z.string().min(6)
});
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;

// Input schemas for class management
export const createClassInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  staff_id: z.number()
});
export type CreateClassInput = z.infer<typeof createClassInputSchema>;

export const updateClassInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  staff_id: z.number().optional()
});
export type UpdateClassInput = z.infer<typeof updateClassInputSchema>;

// Input schemas for student management
export const createStudentInputSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  student_id: z.string().min(1),
  class_id: z.number(),
  password: z.string().min(6)
});
export type CreateStudentInput = z.infer<typeof createStudentInputSchema>;

export const updateStudentInputSchema = z.object({
  id: z.number(),
  student_id: z.string().min(1).optional(),
  class_id: z.number().optional()
});
export type UpdateStudentInput = z.infer<typeof updateStudentInputSchema>;

// Input schemas for transactions
export const createTransactionInputSchema = z.object({
  student_id: z.number(),
  staff_id: z.number(),
  type: transactionTypeSchema,
  amount: z.number().positive(),
  description: z.string().nullable()
});
export type CreateTransactionInput = z.infer<typeof createTransactionInputSchema>;

// Query input schemas
export const getTransactionsInputSchema = z.object({
  student_id: z.number().optional(),
  staff_id: z.number().optional(),
  type: transactionTypeSchema.optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional()
});
export type GetTransactionsInput = z.infer<typeof getTransactionsInputSchema>;

export const getReportInputSchema = z.object({
  type: z.enum(['daily', 'monthly', 'class']),
  date: z.coerce.date().optional(),
  class_id: z.number().optional(),
  staff_id: z.number().optional()
});
export type GetReportInput = z.infer<typeof getReportInputSchema>;

// Response schemas
export const authResponseSchema = z.object({
  user: userSchema,
  token: z.string()
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

export const dashboardStatsSchema = z.object({
  total_students: z.number(),
  total_balance: z.number(),
  total_deposits_today: z.number(),
  total_withdrawals_today: z.number(),
  active_classes: z.number()
});
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

export const studentWithProfileSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  student_profile: studentProfileSchema
});
export type StudentWithProfile = z.infer<typeof studentWithProfileSchema>;
