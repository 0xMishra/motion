import { z } from "zod";
export declare const signupSchema: z.ZodObject<
  {
    email: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    email: string;
    name: string;
    password: string;
  },
  {
    email: string;
    name: string;
    password: string;
  }
>;
export type SignupSchemaType = z.infer<typeof signupSchema>;
export declare const signinSchema: z.ZodObject<
  {
    email: z.ZodString;
    password: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    email: string;
    password: string;
  },
  {
    email: string;
    password: string;
  }
>;
export type SigninSchemaType = z.infer<typeof signinSchema>;
export declare const blogCreationSchema: z.ZodObject<
  {
    title: z.ZodString;
    content: z.ZodString;
    published: z.ZodDefault<z.ZodBoolean>;
  },
  "strip",
  z.ZodTypeAny,
  {
    title: string;
    content: string;
    published: boolean;
  },
  {
    title: string;
    content: string;
    published?: boolean | undefined;
  }
>;
export type BlogCreationType = z.infer<typeof blogCreationSchema>;
export declare const blogUpdationSchema: z.ZodObject<
  {
    title: z.ZodString;
    content: z.ZodString;
    published: z.ZodDefault<z.ZodBoolean>;
  },
  "strip",
  z.ZodTypeAny,
  {
    title: string;
    content: string;
    published: boolean;
  },
  {
    title: string;
    content: string;
    published?: boolean | undefined;
  }
>;
export type BlogUpdationType = z.infer<typeof blogUpdationSchema>;
