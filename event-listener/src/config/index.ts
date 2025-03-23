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
  AMI_PORT: numberEnv('AMI_PORT') || throwEnvErr('AMI_PORT is invalid'),
  AMI_HOST: process.env.AMI_HOST || throwEnvErr('AMI_HOST not specified'),
  AMI_USERNAME:
    process.env.AMI_USERNAME || throwEnvErr('AMI_USERNAME not specified'),
  AMI_PASSWORD:
    process.env.AMI_PASSWORD || throwEnvErr('AMI_PASSWORD not specified'),
  AMPQ_URL: process.env.AMPQ_URL || throwEnvErr('AMPQ_URL not specified'),
  AMPQ_QUE: process.env.AMPQ_QUE || throwEnvErr('AMPQ_QUE not specified'),
  HTTP_PORT: numberEnv('HTTP_PORT') || throwEnvErr('HTTP_PORT is invalid'),
};
