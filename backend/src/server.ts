import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import foodRouter from "./routers/food.router";
import userRouter from "./routers/user.router";
import { dbConnect } from "./configs/database.config";
dbConnect();
const port = 5000;
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log("listening on port http://localhost:" + port);
});
