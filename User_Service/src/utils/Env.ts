import { cleanEnv, str } from "envalid";

const Env = cleanEnv(process.env, {
  PORT: str({default: "3000"}),
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  JWT_TTL: str({default: "3600"}),
});

export default Env;