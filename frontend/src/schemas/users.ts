import { z } from 'zod';
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

/**
 * ! !!!!!!! ATTENTION !!!!!!!!
 *
 * @docs  https://github.com/colinhacks/zod#strings
 * TODO: Adjust the "User" schema below to whatever you think makes sense.
 * No adjustments needed for any other schema
 *
 * ! !!!!!!!!!!!!!!!!!!!!!!!!!!
 */

/**
 * * *******************
 *    DB Models
 * * *******************
 */
export const userRoles = [
  'Controller',
  'Administrator',
  'Base user',
  'Astronaut',
] as const;
const userRoleSchema = z.enum(userRoles);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userTitles = [
  '',
  'Mr.',
  'Mrs.',
  'Dr.',
] as const;
const userTitleSchema = z.enum(userTitles);
export type UserTitle = z.infer<typeof userTitleSchema>;

export const userSuffixes = [
  '',
  'Sr.',
  'Jr.',
  'III',
] as const;
const userSuffixSchema = z.enum(userSuffixes);
export type UserSuffix = z.infer<typeof userSuffixSchema>;

/**
 * @summary     Schema for a "user" entity type
 */
export const User = z.object({
  _id: z.string().uuid(),
  role: userRoleSchema,
  name: z.object({
    familyName: z.string().min(2, { message: "Last name must be at least 2 characters" }).max(100),
    givenName: z.string().min(2, { message: "First name must be at least 2 characters" }).max(100),
    middleName: z.string().optional(),
    suffix: userSuffixSchema.optional(),
    title: userTitleSchema.optional(),
  }),
  email: z.string().email(),
  phone: z.string().length(10, { message: "Phone number must be 10 digits" }),
});
export type User = z.infer<typeof User>;

// ----------------------------------------------------------------------

/**
 * * *******************
 *    Mutations
 * * *******************
 */
export const createUserSchema = User.pick({
  role: true,
  name: true,
  email: true,
  phone: true
});
export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = User.pick({
  role: true,
  name: true,
  email: true,
  phone: true
}).partial();
export type UpdateUser = z.infer<typeof updateUserSchema>;

// ----------------------------------------------------------------------

/**
 * * *******************
 *    Default Values
 * * *******************
 */
export const defaultValuesUser = (): CreateUser => ({
  role: 'Base user',
  name: {
    familyName: '',
    givenName: '',
    middleName: '',
    suffix: '',
    title: '',
  },
  email: '',
  phone: '',
});
