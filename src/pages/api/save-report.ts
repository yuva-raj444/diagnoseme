/**
 * POST /api/save-report
 *
 * Receives multipart/form-data:
 *   - image    : the uploaded medical image file
 *   - diagnosis: JSON string of the AI result
 *
 * Generates a UUID, uploads both blobs to Azure, returns { success, reportId }.
 * Azure credentials never leave the server.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { uploadDiagnosisToAzure } from '../../services/azureStorage';

// REQUIRED – disable Next.js body parser so formidable can read the stream
export const config = {
  api: { bodyParser: false },
};

function parseForm(req: NextApiRequest): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true, maxFileSize: 20 * 1024 * 1024 });
    form.parse(req, (err, fields, files) =>
      err ? reject(err) : resolve({ fields, files })
    );
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!process.env.AZURE_STORAGE_ACCOUNT_NAME || !process.env.AZURE_STORAGE_ACCOUNT_KEY) {
    console.error('❌ Azure credentials missing');
    return res.status(500).json({ success: false, error: 'Storage not configured' });
  }

  try {
    const { fields, files } = await parseForm(req);

    // ── Image file ──────────────────────────────────────────────────────────
    const imageFileRaw = files.image;
    const imageFile = Array.isArray(imageFileRaw) ? imageFileRaw[0] : imageFileRaw;
    if (!imageFile) return res.status(400).json({ success: false, error: 'No image provided' });

    // ── Diagnosis JSON field ────────────────────────────────────────────────
    const diagnosisRaw = fields.diagnosis;
    const diagnosisStr = Array.isArray(diagnosisRaw) ? diagnosisRaw[0] : diagnosisRaw;
    let diagnosisData: object = {};
    if (diagnosisStr) {
      try { diagnosisData = JSON.parse(diagnosisStr); } catch {}
    }

    // ── Read buffer & detect extension ──────────────────────────────────────
    const imageBuffer = fs.readFileSync(imageFile.filepath);
    const ext = path.extname(imageFile.originalFilename ?? '')
      .replace(/^\./, '').toLowerCase() || 'jpg';

    // ── Generate UUID folder ────────────────────────────────────────────────
    const reportId = crypto.randomUUID();

    // ── Upload to Azure ─────────────────────────────────────────────────────
    await uploadDiagnosisToAzure(reportId, imageBuffer, ext, {
      id: reportId,
      timestamp: new Date().toISOString(),
      ...diagnosisData,
    });

    // ── Clean up temp file ──────────────────────────────────────────────────
    try { fs.unlinkSync(imageFile.filepath); } catch {}

    console.log(`✅ /api/save-report: saved "${reportId}"`);
    return res.status(200).json({ success: true, reportId });

  } catch (error) {
    console.error('❌ /api/save-report error:', error);
    return res.status(500).json({ success: false, error: 'Failed to save report' });
  }
}
