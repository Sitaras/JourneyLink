import express, { urlencoded, json } from "express";
import cors from "cors";
import { connectDB } from "./db/connectDB";
import { config } from "./config/config";
import { successResponse } from "./middleware/successResponse.middleware";
import { errorResponse } from "./middleware/errorResponse.middleware";
import router from "./routes";

const app = express();
const PORT = config.port;

app.use(urlencoded({ extended: true }));
app.use(json());

app.use(successResponse);
app.use(errorResponse);

app.use(express.json());
app.use(cors());

app.use("/api", router);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
