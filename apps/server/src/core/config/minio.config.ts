export default () => ({
    minio: {
      endpoint: process.env.MINIO_ENDPOINT || 'defaultEndpoint',
      accessKey: process.env.MINIO_ACCESS_KEY || 'defaultAccessKey',
      secretKey: process.env.MINIO_SECRET_KEY || 'defaultSecretKey',
    },
  });
  