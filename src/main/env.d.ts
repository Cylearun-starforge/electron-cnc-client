declare namespace NodeJS {
  interface ProcessEnv {
    CC_CLIENT_CONFIG?: string;
    NODE_ENV: 'development' | 'production';
  }
}
