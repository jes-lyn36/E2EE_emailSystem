import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

import routes from "./server.js"

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL, // Adjust this to your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));


app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

app.use(
  session({
    secret: process.env.SESSION_SECRET, // store this in env for production
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions"
    }),
    cookie: {
      httpOnly: true,
      secure: false, // true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

// Routes
app.use("/", routes);

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}`)))
  .catch((error) => console.log(error.message));  
