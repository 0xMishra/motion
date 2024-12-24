import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().min(3).max(20),
  password: z.string().min(6),
});

export type SignupSchemaType = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SigninSchemaType = z.infer<typeof signinSchema>;

export const blogCreationSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
  published: z.boolean().default(false),
});

export type BlogCreationType = z.infer<typeof blogCreationSchema>;

export const blogUpdationSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
  published: z.boolean().default(false),
});

export type BlogUpdationType = z.infer<typeof blogUpdationSchema>;
