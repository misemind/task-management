import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Common
  PORT: Joi.number().default(3000),
  
  // AWS
  AWS_ACCESS_KEY_ID: Joi.string().default('default-access-key-id'),
  AWS_SECRET_ACCESS_KEY: Joi.string().default('default-secret-access-key'),
  AWS_REGION: Joi.string().default('default-region'),
  
  // Azure
  AZURE_CLIENT_ID: Joi.string().default('default-client-id'),
  AZURE_CLIENT_SECRET: Joi.string().default('default-client-secret'),
  AZURE_TENANT_ID: Joi.string().default('default-tenant-id'),
  AZURE_SUBSCRIPTION_ID: Joi.string().default('default-subscription-id'),
  
  // Google Cloud
  GOOGLE_PROJECT_ID: Joi.string().default('default-project-id'),
  GOOGLE_PRIVATE_KEY: Joi.string().default('default-private-key'),
  GOOGLE_CLIENT_EMAIL: Joi.string().default('default-client-email'),
  
  // MinIO
  MINIO_ENDPOINT: Joi.string().default('default-endpoint'),
  MINIO_ACCESS_KEY: Joi.string().default('default-access-key'),
  MINIO_SECRET_KEY: Joi.string().default('default-secret-key'),
  
  // MongoDB
  MONGO_URI: Joi.string().default('default-mongo-uri'),
  
  // DTC
  DTC_API_KEY: Joi.string().default('default-api-key'),
  DTC_API_SECRET: Joi.string().default('default-api-secret'),
});
