
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  loginInputSchema,
  changePasswordInputSchema,
  resetPasswordInputSchema,
  createUserInputSchema,
  updateUserInputSchema,
  createClassInputSchema,
  updateClassInputSchema,
  createStudentInputSchema,
  updateStudentInputSchema,
  createTransactionInputSchema,
  getTransactionsInputSchema,
  getReportInputSchema
} from './schema';

// Import handlers
import { login, changePassword, resetPassword } from './handlers/auth';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from './handlers/users';
import { createClass, getClasses, getClassesByStaff, updateClass, deleteClass } from './handlers/classes';
import { createStudent, getStudents, getStudentsByClass, getStudentsByStaff, getStudentById, updateStudent } from './handlers/students';
import { createTransaction, getTransactions, getTransactionsByStudent, getTransactionsByStaff, getDailyTransactions } from './handlers/transactions';
import { getDashboardStats, getStaffDashboardStats, generateReport, getSavingsBook } from './handlers/reports';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => login(input)),
  
  changePassword: publicProcedure
    .input(changePasswordInputSchema)
    .mutation(({ input }) => changePassword(input)),
  
  resetPassword: publicProcedure
    .input(resetPasswordInputSchema)
    .mutation(({ input }) => resetPassword(input)),

  // User management routes (Admin only)
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  
  getUsers: publicProcedure
    .query(() => getUsers()),
  
  getUserById: publicProcedure
    .input(z.number())
    .query(({ input }) => getUserById(input)),
  
  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),
  
  deleteUser: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteUser(input)),

  // Class management routes
  createClass: publicProcedure
    .input(createClassInputSchema)
    .mutation(({ input }) => createClass(input)),
  
  getClasses: publicProcedure
    .query(() => getClasses()),
  
  getClassesByStaff: publicProcedure
    .input(z.number())
    .query(({ input }) => getClassesByStaff(input)),
  
  updateClass: publicProcedure
    .input(updateClassInputSchema)
    .mutation(({ input }) => updateClass(input)),
  
  deleteClass: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteClass(input)),

  // Student management routes
  createStudent: publicProcedure
    .input(createStudentInputSchema)
    .mutation(({ input }) => createStudent(input)),
  
  getStudents: publicProcedure
    .query(() => getStudents()),
  
  getStudentsByClass: publicProcedure
    .input(z.number())
    .query(({ input }) => getStudentsByClass(input)),
  
  getStudentsByStaff: publicProcedure
    .input(z.number())
    .query(({ input }) => getStudentsByStaff(input)),
  
  getStudentById: publicProcedure
    .input(z.number())
    .query(({ input }) => getStudentById(input)),
  
  updateStudent: publicProcedure
    .input(updateStudentInputSchema)
    .mutation(({ input }) => updateStudent(input)),

  // Transaction routes
  createTransaction: publicProcedure
    .input(createTransactionInputSchema)
    .mutation(({ input }) => createTransaction(input)),
  
  getTransactions: publicProcedure
    .input(getTransactionsInputSchema)
    .query(({ input }) => getTransactions(input)),
  
  getTransactionsByStudent: publicProcedure
    .input(z.number())
    .query(({ input }) => getTransactionsByStudent(input)),
  
  getTransactionsByStaff: publicProcedure
    .input(z.number())
    .query(({ input }) => getTransactionsByStaff(input)),
  
  getDailyTransactions: publicProcedure
    .input(z.coerce.date())
    .query(({ input }) => getDailyTransactions(input)),

  // Report and dashboard routes
  getDashboardStats: publicProcedure
    .query(() => getDashboardStats()),
  
  getStaffDashboardStats: publicProcedure
    .input(z.number())
    .query(({ input }) => getStaffDashboardStats(input)),
  
  generateReport: publicProcedure
    .input(getReportInputSchema)
    .query(({ input }) => generateReport(input)),
  
  getSavingsBook: publicProcedure
    .input(z.number())
    .query(({ input }) => getSavingsBook(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Student Savings Management TRPC server listening at port: ${port}`);
}

start();
