import express, { type Request, type Response } from "express";
import cors from "cors";
import { recommendRouter } from "./routes/recommended.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("ok");
});

app.use("/api/recommed", recommendRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
