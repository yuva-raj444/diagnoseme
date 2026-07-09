/**
 * Azure Blob Storage service – upload only.
 * Server-side singleton. Key is read from env vars — never reaches the browser.
 *
 * Structure:
 *   reports/<uuid>/image.<ext>
 *   reports/<uuid>/report.json
 */

import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlockBlobUploadOptions,
} from '@azure/storage-blob';

// ── Singleton ─────────────────────────────────────────────────────────────────

let _client: BlobServiceClient | null = null;

function getBlobServiceClient(): BlobServiceClient {
  if (_client) return _client;

  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey  = process.env.AZURE_STORAGE_ACCOUNT_KEY;

  if (!accountName || !accountKey) {
    throw new Error(
      'Azure credentials missing. Set AZURE_STORAGE_ACCOUNT_NAME and ' +
      'AZURE_STORAGE_ACCOUNT_KEY in .env.local'
    );
  }

  const credential = new StorageSharedKeyCredential(accountName, accountKey);
  _client = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    credential
  );
  return _client;
}

const CONTAINER_NAME = 'reports';

// ── Generic upload ────────────────────────────────────────────────────────────

export async function uploadBlob(
  blobName: string,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  const containerClient = getBlobServiceClient().getContainerClient(CONTAINER_NAME);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const options: BlockBlobUploadOptions = {
    blobHTTPHeaders: { blobContentType: contentType },
  };
  await blockBlobClient.uploadData(buffer, options);
  console.log(`✅ Azure: uploaded "${blobName}"`);
}

// ── Diagnosis upload orchestrator ─────────────────────────────────────────────

export async function uploadDiagnosisToAzure(
  id: string,
  imageBuffer: Buffer,
  imageExt: string,   // e.g. "png" — no dot
  reportData: object
): Promise<void> {
  // Upload image first, then report JSON
  await uploadBlob(`${id}/image.${imageExt}`, imageBuffer, getMimeType(imageExt));
  await uploadBlob(
    `${id}/report.json`,
    Buffer.from(JSON.stringify(reportData, null, 2), 'utf-8'),
    'application/json'
  );
  console.log(`✅ Azure: diagnosis folder "${id}/" saved`);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMimeType(ext: string): string {
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg',
    png: 'image/png',  webp: 'image/webp',
    gif: 'image/gif',  bmp: 'image/bmp',
    tiff: 'image/tiff', heic: 'image/heic',
  };
  return map[ext.toLowerCase()] ?? 'application/octet-stream';
}
