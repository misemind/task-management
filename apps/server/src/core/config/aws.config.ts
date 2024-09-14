export default () => ({
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'default-access-key-id',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'default-secret-access-key',
      region: process.env.AWS_REGION || 'default-region',
    },
  });
  