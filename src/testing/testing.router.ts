import { type Request, type Response, Router } from "express";
import { HttpStatus } from "../core/types/http-statuses.types";
import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  tokensCollection,
  usersCollection,
} from "../db/mongo";

export const testingRouter = Router();

testingRouter.get("/", (_req: Request, res: Response) => {
  res.status(HttpStatus.Ok).send("testing url");
});

testingRouter.delete("/all-data", async (_req: Request, res: Response) => {
  console.log("deletealldata");
  await postsCollection.drop();
  await blogsCollection.drop();
  await usersCollection.drop();
  await commentsCollection.drop();
  await tokensCollection.drop();

  res.sendStatus(HttpStatus.NoContent);
});
