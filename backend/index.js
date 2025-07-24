import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import routes from "./server.js"

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Adjust this to your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));


app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));


// STORE THIS IN ENVIRONMENT VARIABLES !!!
const CONNECTION_URL = "mongodb+srv://jes-lyn36:jes-lyn36jes-lyn36@cluster0.dhexq8w.mongodb.net/<db_name>";
const PORT = process.env.PORT || 8080;

app.use(
  session({
    secret: "verySecretValue", // store this in env for production
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: CONNECTION_URL,
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

mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.log(error.message));  
