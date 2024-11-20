import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Token } from './types';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly configService: ConfigService) {
    this.bootstrap();
  }

  bootstrap() {
    const privateKeys = this.configService.get('privateKeys');
    if (privateKeys.length === 0) {
      this.logger.error('missing env: [PRIVATE_KEYS], exit');
      process.exit(1);
    }
  }

  async getTokens(
    params: { search?: string; limit?: number; offset?: number } = {},
  ) {
    const { limit = 100, offset = 0, search = '' } = params;

    const { data } = await axios.get<Token[]>('/tokens', {
      params: { search, limit, offset },
    });
    return data;
  }

  async tradingLoop() {
    const tokens = await this.getTokens();
    console.log('tokens', tokens);
  }
}
