/**
 * Vercel Serverless Function: /api/sync
 * Secure Gatekeeper for Pria's Accessories Catalog Persistence
 * 
 * Supports:
 * - Public GET: Serving live canonical product catalog
 * - Protected POST: Authenticated updates via GitHub API or JSONbin cloud store
 */

const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Serve public products.json
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'data', 'products.json');
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=60');
        return res.status(200).send(fileContent);
      } else {
        return res.status(404).json({ error: 'data/products.json not found' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Failed to read catalog', details: err.message });
    }
  }

  // POST: Protected Catalog Update
  if (req.method === 'POST') {
    try {
      const body = req.body || {};
      const { passcode, products, githubToken, jsonbinKey, jsonbinId } = body;

      const adminPasscode = process.env.ADMIN_PASSCODE || '1234';
      if (!passcode || passcode !== adminPasscode) {
        return res.status(401).json({ error: 'Unauthorized: Invalid store admin passcode' });
      }

      if (!products || !Array.isArray(products)) {
        return res.status(400).json({ error: 'Invalid products payload: expected an array' });
      }

      // Provider 1: GitHub API Direct Git Commit
      const token = process.env.GITHUB_TOKEN || githubToken;
      if (token) {
        const repo = process.env.GITHUB_REPO || 'olaopajoshua/Pria-s-Accessories';
        const filePath = 'data/products.json';

        // 1. Fetch current file SHA
        const getFileRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Prias-Accessories-Sync'
          }
        });

        let sha = null;
        if (getFileRes.ok) {
          const fileData = await getFileRes.json();
          sha = fileData.sha;
        }

        // 2. Commit updated JSON directly to main branch
        const contentBase64 = Buffer.from(JSON.stringify(products, null, 2), 'utf-8').toString('base64');
        const commitPayload = {
          message: 'chore: update store catalog via manager portal [skip ci]',
          content: contentBase64,
          branch: 'main'
        };
        if (sha) commitPayload.sha = sha;

        const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'Prias-Accessories-Sync'
          },
          body: JSON.stringify(commitPayload)
        });

        if (!putRes.ok) {
          const putErr = await putRes.json().catch(() => ({}));
          return res.status(502).json({ error: 'GitHub commit failed', details: putErr.message || 'Check token permissions' });
        }

        return res.status(200).json({ success: true, provider: 'github', count: products.length });
      }

      // Provider 2: JSONbin.io Real-Time Document Store
      const binKey = process.env.JSONBIN_KEY || jsonbinKey;
      const binId = process.env.JSONBIN_ID || jsonbinId;
      if (binKey && binId) {
        const binRes = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': binKey
          },
          body: JSON.stringify(products)
        });

        if (!binRes.ok) {
          return res.status(502).json({ error: 'JSONbin cloud update failed' });
        }

        return res.status(200).json({ success: true, provider: 'jsonbin', count: products.length });
      }

      // Fallback: Local / Session mode confirmed
      return res.status(200).json({ 
        success: true, 
        provider: 'local', 
        message: 'Catalog updated in browser session. Add GITHUB_TOKEN or JSONbin keys in Cloud Settings to automatically synchronize across all devices.' 
      });

    } catch (err) {
      return res.status(500).json({ error: 'Server error during sync', details: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
