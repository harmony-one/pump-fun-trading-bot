import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Contract, ContractAbi, Web3 } from 'web3';
import { Token } from './types';
import * as TokenFactoryABI from './abi/TokenFactory.json';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly web3: Web3;
  private readonly accountAddress: string;
  private readonly tokenFactoryContract: Contract<ContractAbi>;

  constructor(private readonly configService: ConfigService) {
    const privateKey = this.configService.get('privateKey');
    const rpcUrl = configService.get('rpcUrl');
    const contractAddress = configService.get('tokenFactoryAddress');
    if (!privateKey) {
      this.logger.error('missing env: [PRIVATE_KEY], exit');
      process.exit(1);
    }
    this.web3 = new Web3(rpcUrl);
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.accountAddress = account.address;
    this.web3.eth.accounts.wallet.add(account);
    this.logger.log(`Service account address=${account.address}`);
    this.tokenFactoryContract = new this.web3.eth.Contract(
      TokenFactoryABI,
      contractAddress,
    );

    this.tradingLoop();
  }

  async getTokens(
    params: { search?: string; limit?: number; offset?: number } = {},
  ) {
    const { limit = 100, offset = 0, search = '' } = params;

    const apiUrl = this.configService.get('apiUrl');
    const { data } = await axios.get<Token[]>(apiUrl + '/tokens', {
      params: { search, limit, offset },
    });
    return data;
  }

  async tradingLoop() {
    const tokens = await this.getTokens();
    console.log('tokens', tokens);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    return this.tradingLoop();
  }
}
