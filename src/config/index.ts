export default () => ({
  privateKey: process.env.PRIVATE_KEY || '',
  apiUrl: process.env.API_URL || 'https://pump-fun-backend.fly.dev',
  rpcUrl: process.env.RPC_URL || 'https://api.harmony.one',
  creatorAddresses: parseStringArray(process.env.CREATOR_ADDRESSES || ''),
  tokenFactoryAddress: process.env.TOKEN_FACTORY_ADDRESS || '',
  tradingInterval: process.env.TRADING_INTERVAL || '60',
});

const parseStringArray = (value: string) => {
  return value
    .split(',')
    .filter((_) => _)
    .map((item) => item.trim().toLowerCase());
};
