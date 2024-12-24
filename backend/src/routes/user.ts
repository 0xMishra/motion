import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { createHash } from "hono/utils/crypto";
import {
  signupSchema,
  signinSchema,
  SignupSchemaType,
  SigninSchemaType,
} from "@0xmishra/common-app";

type Variables = {
  userId: string;
};

export const user = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: Variables;
}>();

user.post(`/signup`, async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const input: SignupSchemaType = await c.req.json();
    const parsedInput = signupSchema.safeParse(input);

    if (!parsedInput.success) {
      return c.json({ msg: "invalid input" }, 411);
    }

    let user = await prisma.user.findFirst({
      where: { email: parsedInput.data.email },
    });

    if (user) {
      return c.json({ msg: "user already exists" }, 411);
    }
    const hashedPassword = await createHash(parsedInput.data.password, {
      name: "SHA-256",
      alias: "sha256",
    });
    parsedInput.data.password = hashedPassword || parsedInput.data.password;
    user = await prisma.user.create({
      data: {
        ...parsedInput.data,
      },
    });

    const token = await sign({ userId: user.id }, c.env.JWT_SECRET);

    return c.json({ msg: "signed up successfully", token: token }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ msg: `${error}` }, 500);
  }
});

user.post(`/signin`, async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const input: SigninSchemaType = await c.req.json();
    const parsedInput = signinSchema.safeParse(input);

    if (!parsedInput.success) {
      return c.json({ msg: "invalid input" }, 411);
    }

    let user = await prisma.user.findUnique({
      where: { email: parsedInput.data.email },
    });

    if (!user) {
      return c.json({ msg: "user doesn't exist" }, 404);
    }

    const hashedPassword = await createHash(parsedInput.data.password, {
      name: "SHA-256",
      alias: "sha256",
    });

    const isMatchPassword = hashedPassword === user.password;
    if (!isMatchPassword) {
      return c.json({ msg: "wrong password" }, 403);
    }

    const token = await sign({ userId: user.id }, c.env.JWT_SECRET);

    return c.json({ msg: "signed in successfully", token: token }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ msg: `${error}` }, 500);
  }
});
