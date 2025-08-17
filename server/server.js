import "dotenv/config";
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';
import cookieParser from "cookie-parser";
import { sessionMiddleware } from "./middlewares/session.js";

const { PORT, FRONTEND_URL } = process.env;

const app = express();

const origin = FRONTEND_URL || 'http://localhost:80';
const corsOptions = { 
  origin: origin,
  credentials: true, // enable cookies
 }
app.use(cors(corsOptions));
console.log("cors options", corsOptions)
// biar req.body bisa dibaca
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessionMiddleware);

app.get('/', (req, res) => res.send('Hello from the server!'));

app.use('/v1', apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
