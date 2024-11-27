import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Contract, ContractAbi, Web3 } from 'web3';
import { Token } from './types';
import * as TokenFactoryABI from './abi/TokenFactory.json';
import { PayableCallOptions } from 'web3-types';
import { parseUnits } from 'ethers';
const crypto = require('crypto');

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

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getRandom() {
    const randomBuffer = crypto.randomBytes(4);
    const randomInt = randomBuffer.readUInt32BE(0);
    // Divide by the maximum unsigned 32-bit integer to get a float between 0 and 1
    return randomInt / 0xffffffff;
  }

  private async executeTrade(token: Token) {
    const randomNumber = this.getRandom();
    const side = randomNumber < 1 ? 'buy' : 'sell';
    const value = parseUnits('0.01', 18);

    const args = [token.address];
    if (side === 'sell') {
      args.push(String(value));
    }
    const functionName = side === 'buy' ? 'buy' : 'sell';
    const options: PayableCallOptions = {
      from: this.accountAddress,
    };
    if (side === 'buy') {
      options.value = String(value);
    }
    const gasFees = await this.tokenFactoryContract.methods[functionName](
      ...args,
    ).estimateGas(options);
    const gasPrice = await this.web3.eth.getGasPrice();

    const tx = {
      from: this.accountAddress,
      to: this.configService.get('tokenFactoryAddress'),
      gas: gasFees,
      gasPrice,
      value: options.value,
      data: this.tokenFactoryContract.methods[functionName](
        ...args,
      ).encodeABI(),
    };

    const signPromise = await this.web3.eth.accounts.signTransaction(
      tx,
      this.configService.get('privateKey'),
    );

    return this.web3.eth.sendSignedTransaction(signPromise.rawTransaction);
  }

  async tradingLoop() {
    const tokens = await this.getTokens();
    if (tokens.length > 0) {
      const { transactionHash } = await this.executeTrade(tokens[0]);
      console.log('transactionHash', transactionHash);
    }

    await this.sleep(5000);

    return this.tradingLoop();
  }
}
