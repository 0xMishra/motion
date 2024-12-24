import { Hono } from "hono";
import { verify } from "hono/jwt";
import { user } from "./routes/user";
import { blog } from "./routes/blog";

type Variables = {
  userId: string;
};

const app = new Hono<{
  Bindings: {
    JWT_SECRET: string;
  };
  Variables: Variables;
}>();

app.use("/api/v1/blog/*", async (c, next) => {
  try {
    const bearerToken = c.req.header("Authorization");
    const token = bearerToken?.split(" ")[1];

    const verifiedToken = await verify(token || "", c.env.JWT_SECRET);
    if (!verifiedToken.userId) {
      return c.json({ msg: "unauthorized" }, 403);
    }
    c.set("userId", `${verifiedToken.userId}`);
    await next();
  } catch (error) {
    console.log(error);
    return c.json({ error: `${error}` }, 500);
  }
});

app.route("/api/v1/user", user);
app.route("/api/v1/blog", blog);

export default app;
