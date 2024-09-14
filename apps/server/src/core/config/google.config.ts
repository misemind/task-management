export default () => ({
    google: {
      projectId: process.env.GOOGLE_PROJECT_ID || 'defaultProjectId',
      privateKey: process.env.GOOGLE_PRIVATE_KEY || 'defaultPrivateKey',
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL || 'defaultClientEmail',
    },
  });