import express, { Express } from "express";
import "express-async-errors";
import cors from "cors";

import { loadEnv } from "./configs";
import IndexRouter from "./routers/index.router";
import { connect } from "./configs/database";
import { errorMiddleware } from "./middlewares/error.middleware";

loadEnv();

const app = express();
app
  .use(cors())
  .use(express.json())
  .use(IndexRouter)
  .use(errorMiddleware)
  .get("/health", (_req, res) => res.send("OK!"));

export async function init(): Promise<Express> {
  await connect();
  return Promise.resolve(app);
}

export default app;
