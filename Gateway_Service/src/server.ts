import express from 'express';
import ENV from './Env';
import userRoutes from './router/user-routes';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

app.use(
  rateLimit({
    windowMs: 60_000,
    max: 100,
  })
);

app.use('/',userRoutes);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const port = ENV.PORT;
app.listen(port, () => console.log(`Gateway Service listening on port ${port}`));