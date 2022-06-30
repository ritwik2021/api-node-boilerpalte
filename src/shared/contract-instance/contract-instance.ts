import { web3Instance } from '../provider/web3';

export async function createContractInstance(contractABI, contractAddress) {
  const web3ProviderInstance = await web3Instance();
  const instance = new web3ProviderInstance.eth.Contract(contractABI, contractAddress);
  return instance;
}
