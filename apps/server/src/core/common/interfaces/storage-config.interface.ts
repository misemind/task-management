// apps/server/src/domains/employee/interfaces/storage-config.interface.ts
export interface StorageConfig {
    sourceBucket?: string;          // The name of the source bucket
    sourceEntityFolder?: string;    // The folder inside the source bucket related to the entity
    destinationBucket?: string;     // The name of the destination bucket
    destinationEntityFolder?: string; // The folder inside the destination bucket related to the entity
  }
  