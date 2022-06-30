import Web3 from 'web3';
import * as config from '../config/config';
import { ConfigService } from '@nestjs/config';
const configService = new ConfigService(config);

export async function web3Instance() {
  const provider = new Web3.providers.HttpProvider(configService.get('HTTP_PROVIDER'));
  const web3 = new Web3(provider);
  return web3;
}
