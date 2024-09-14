export default () => ({
    azure: {
      clientId: process.env.AZURE_CLIENT_ID || 'default-client-id',
      clientSecret: process.env.AZURE_CLIENT_SECRET || 'default-client-secret',
      tenantId: process.env.AZURE_TENANT_ID || 'default-tenant-id',
      subscriptionId: process.env.AZURE_SUBSCRIPTION_ID || 'default-subscription-id',
    },
  });
  