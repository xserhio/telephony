import process from 'node:process';

const numberEnv = (name: string) => {
  const num = Number(process.env[name]);

  if (Number.isNaN(num)) {
    return null;
  }

  return num;
};

const throwEnvErr = (message: string) => {
  throw new Error(message);
};

export default {
  HTTP_PORT: numberEnv('HTTP_PORT') || throwEnvErr('HTTP_PORT is invalid'),
  PG_USERNAME:
    process.env.PG_USERNAME || throwEnvErr('PG_USERNAME not specified'),
  PG_PORT: numberEnv('PG_PORT') || throwEnvErr('PG_PORT is invalid'),
  PG_PASSWORD:
    process.env.PG_PASSWORD || throwEnvErr('PG_PASSWORD not specified'),
  PG_HOST: process.env.PG_HOST || throwEnvErr('PG_HOST not specified'),
  PG_DB: process.env.PG_DB || throwEnvErr('PG_DB not specified'),
  JWT_SECRET: process.env.JWT_SECRET || throwEnvErr('JWT_SECRET not specified'),
};
