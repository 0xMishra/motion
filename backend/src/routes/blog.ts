import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import {
  blogUpdationSchema,
  blogCreationSchema,
  BlogUpdationType,
  BlogCreationType,
} from "@0xmishra/common-app";

export const blog = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
  Variables: { userId: string };
}>();

blog.post(`/create`, async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const userId = c.get("userId");
    console.log(userId);
    const input: BlogCreationType = await c.req.json();
    const parsedInput = blogCreationSchema.safeParse(input);

    if (!parsedInput.success) {
      return c.json({ msg: "invalid inputs" }, 411);
    }

    await prisma.post.create({
      data: { ...parsedInput.data, authorId: parseInt(userId) },
    });

    return c.json({ msg: "blog created successfully" }, 201);
  } catch (error) {
    console.log(error);
    return c.json({ error: `${error}` }, 500);
  }
});

blog.get(`/bulk`, async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    let blogs = await prisma.post.findMany({});

    return c.json({ blogs: blogs }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ error: `${error}` }, 500);
  }
});

blog.put(`/:id`, async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blogId = c.req.param("id");
    const input: BlogUpdationType = await c.req.json();
    const parsedInput = blogUpdationSchema.safeParse(input);

    if (!parsedInput.success) {
      return c.json({ msg: "invalid inputs" }, 411);
    }

    let blog = await prisma.post.findUnique({
      where: { id: parseInt(blogId) },
    });

    if (!blog) {
      return c.json({ msg: "blog doen't exist" }, 404);
    }

    await prisma.post.update({
      where: { id: parseInt(blogId) },
      data: { ...parsedInput.data },
    });

    return c.json({ msg: "blog updated successfully" }, 201);
  } catch (error) {
    console.log(error);
    return c.json({ error: `${error}` }, 500);
  }
});

blog.get(`/:id`, async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const blogId = c.req.param("id");

    let blog = await prisma.post.findUnique({
      where: { id: parseInt(blogId) },
    });

    if (!blog) {
      return c.json({ msg: "blog doen't exist" }, 404);
    }

    return c.json({ blog: blog }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ error: `${error}` }, 500);
  }
});
