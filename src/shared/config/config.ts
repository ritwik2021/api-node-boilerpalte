import IEnvirontmentConfig from '../interfaces/env-config.interface';
import 'dotenv/config';
import { AsyncLoadSecretsFromAWS } from './awsSecretManager';
export default async () => {
  // await AsyncLoadSecretsFromAWS();
  const env: IEnvirontmentConfig = { ...process.env };
  return env;
};
