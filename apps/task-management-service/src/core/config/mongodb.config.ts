export default () => ({
    mongodb: {
      uri: process.env.MONGO_URI || 'default-mongo-uri',
    },
  });
  