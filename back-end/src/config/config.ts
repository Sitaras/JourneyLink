import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/your-database",
  },
  jwt: {
    accessToken: {
      secret: process.env.ACCESS_TOKEN_SECRET || "default-access-secret",
      expiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_SECRET || "default-refresh-secret",
      expiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    },
  },
  placeKitApiKey: process.env.PLACE_KIT_KEY || "",
};
