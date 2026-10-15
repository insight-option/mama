import { defineBackend } from '@aws-amplify/backend';
import { RemovalPolicy } from 'aws-cdk-lib';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';

const backend = defineBackend({
  auth,
  data,
  storage,
});

// --- Data protection ----------------------------------------------------------
// Set here rather than in the AWS console so every deploy keeps them.

// Products: restorable to any second of the last 35 days (point-in-time
// recovery), and the table can never be deleted, not even by removing the
// backend (deletion protection + retain).
for (const table of Object.values(backend.data.resources.cfnResources.amplifyDynamoDbTables)) {
  table.pointInTimeRecoveryEnabled = true;
  table.deletionProtectionEnabled = true;
  table.applyRemovalPolicy(RemovalPolicy.RETAIN);
}

// Photos: a replaced or deleted photo stays recoverable for 90 days
// (versioning), and the bucket is kept if the backend is removed.
const { cfnBucket } = backend.storage.resources.cfnResources;
cfnBucket.versioningConfiguration = { status: 'Enabled' };
cfnBucket.lifecycleConfiguration = {
  rules: [
    {
      id: 'keep-old-photo-versions-90-days',
      status: 'Enabled',
      noncurrentVersionExpiration: { noncurrentDays: 90 },
      // Tidy-up only: delete markers left with no versions behind them, and
      // uploads that never finished.
      expiredObjectDeleteMarker: true,
      abortIncompleteMultipartUpload: { daysAfterInitiation: 7 },
    },
  ],
};
cfnBucket.applyRemovalPolicy(RemovalPolicy.RETAIN);
