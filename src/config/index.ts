export default () => ({
  privateKey: process.env.PRIVATE_KEY || '',
  apiUrl: process.env.API_URL || 'https://pump-fun-backend.fly.dev',
  rpcUrl: process.env.RPC_URL || 'https://api.harmony.one',
  tokenAddresses: parseStringArray(process.env.TOKEN_ADDRESSES || ''),
  tokenFactoryAddress: process.env.TOKEN_FACTORY_ADDRESS || '',
  tradingInterval: Number(process.env.TRADING_INTERVAL || '5'),
  maxTradeSize: Number(process.env.MAX_TRADE_SIZE || '0.01'), // in ONE tokens
});

const parseStringArray = (value = '') => {
  return value
    .split(',')
    .filter((_) => _)
    .map((item) => item.trim().toLowerCase());
};
