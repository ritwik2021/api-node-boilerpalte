import * as AWS from 'aws-sdk';

export async function AsyncLoadSecretsFromAWS() {
  const client = new AWS.SecretsManager({
    region: process.env.AWS_REGION
  });
  const secretName = process.env.AWS_SECRET_NAME;
  const secrets = await client.getSecretValue({ SecretId: secretName }).promise();
  const parsedSecrets = JSON.parse(secrets.SecretString);
  // Store secrets to process env
  Object.keys(parsedSecrets).forEach(function (key) {
    process.env[key] = parsedSecrets[key];
  });
}
