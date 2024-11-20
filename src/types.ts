export interface UserAccount {
  id: string;
  address: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  tokens: Token[];
}

export interface UserComment {
  id: number;
  text: string;
  token: Token;
  user: UserAccount;
  createdAt: string;
}

export interface TokenUriData {
  userAddress: string;
  name: string;
  ticker: string;
  description: string;
  image: string;
}

export interface Token {
  id: string;
  txnHash: string;
  blockNumber: number;
  address: string;
  name: string;
  symbol: string;
  uri: string;
  uriData: TokenUriData | null;
  totalSupply: string;
  price: string;
  marketCap: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
  user: UserAccount | null;
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
}

export type TokenTradeType = 'buy' | 'sell';

export interface TokenTrade {
  id: string;
  txnHash: string;
  blockNumber: number;
  type: TokenTradeType;
  user: UserAccount;
  token: Token;
  amountIn: string;
  amountOut: string;
  fee: string;
  timestamp: string;
  createdAt: string;
}

export interface TokenBalance {
  id: string;
  user: UserAccount;
  token: Token;
  balance: string;
  createdAt: string;
  updatedAt: string;
}

export interface TokenWinner {
  id: string;
  txnHash: string;
  token: Token;
  user: UserAccount;
  timestamp: string;
  blockNumber: number;
  createdAt: string;
}

export interface JWTTokensPair {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface JwtTokenPayload {
  address: string;
  username: string;
  createdAt: string;
}

export interface Candle {
  highPrice: string;
  lowPrice: string;
  volume: string;
  time: string;
}
