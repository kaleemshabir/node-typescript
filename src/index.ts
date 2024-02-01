import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { AuthRoutes } from "./routes/auth.routes";
import { TasksRoutes } from "./routes/task-routes";

const app: Express = express();
import { connect } from "./config/database";
// Connect database
connect();
dotenv.config();
// Body parser
app.use(express.json());
app.use("/auth", AuthRoutes);
app.use("/tasks", TasksRoutes);

const port = 5001;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
