import express, { urlencoded, json } from "express";
import cors from "cors";
import { connectDB } from "./db/connectDB";
import { config } from "./config/config";
import { successResponse } from "./middleware/successResponse.middleware";
import { errorResponse } from "./middleware/errorResponse.middleware";
import { authRoutes } from "./routes/auth.routes";

const app = express();
const PORT = config.port;

app.use(urlencoded({ extended: true }));
app.use(json());

app.use(successResponse);
app.use(errorResponse);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Suck a nigga dick!");
});

app.use("/api/auth", authRoutes);

app.post("/test", (req, res) => {
  res.json({ requestBody: req.body }); // <==== req.body will be a parsed JSON object
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
