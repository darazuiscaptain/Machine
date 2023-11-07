import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { UserRouter } from "./Routes/User.js";
import { BookServiceRouter } from "./Routes/BookService.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/", UserRouter);
app.use("/BookService/", BookServiceRouter);

try {
  let DB_URL = process.env.DATABASE;
  mongoose.connect(DB_URL);
  console.log("Connected to Database");
} catch (error) {
  console.log("Database Connection Error:", error);
}

app.listen(PORT, () => console.log("Server started"));
