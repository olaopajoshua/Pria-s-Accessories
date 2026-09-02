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
      const { passcode, action, product, productId, products, githubToken, jsonbinKey, jsonbinId } = body;

      // Supabase Master Service Role Server-Side Sync
      const supabaseUrl = process.env.SUPABASE_URL || 'https://katghrsrmmarezqmpjym.supabase.co';
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthdGdocnNybW1hcmV6cW1wanltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODM0NTM1MiwiZXhwIjoyMTAzOTIxMzUyfQ.TLEMLFNPLfGoxwfUx-nE12OYo584NI1myTsMwL77JAE';

      // 0. Public Customer Review Submission from contact.html (No admin passcode needed)
      if (action === 'submit_customer_review' && body.review) {
        const r = body.review;
        if (!r.name || !r.text) {
          return res.status(400).json({ error: 'Name and testimonial text are required' });
        }

        const row = {
          id: r.id || `rev_${Date.now()}`,
          name: String(r.name).trim().slice(0, 100),
          location: String(r.location || 'Nigeria').trim().slice(0, 100),
          product: String(r.product || 'Verified Purchase').trim().slice(0, 100),
          rating: Math.min(5, Math.max(1, parseInt(r.rating, 10) || 5)),
          text: String(r.text).trim().slice(0, 1000),
          verified: true,
          status: 'pending', // Public submissions are ALWAYS pending until approved in admin!
          date: r.date || 'Just now'
        };

        const insRes = await fetch(`${supabaseUrl}/rest/v1/reviews`, {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(row)
        });

        if (!insRes.ok) {
          const errTxt = await insRes.text().catch(() => '');
          return res.status(502).json({ error: 'Failed to save review to Supabase', details: errTxt });
        }

        return res.status(200).json({ success: true, message: 'Review submitted to Supabase for moderation', id: row.id });
      }

      // All management actions below require the store admin passcode
      const adminPasscode = process.env.ADMIN_PASSCODE || '1234';
      if (!passcode || passcode !== adminPasscode) {
        return res.status(401).json({ error: 'Unauthorized: Invalid store admin passcode' });
      }

      // 1. Single product save (insert or update)
      if (action === 'save_product' && product) {
        const row = {
          id: product.id,
          name: product.name,
          category: product.category,
          price: Number(product.price),
          original_price: product.originalPrice ? Number(product.originalPrice) : null,
          image: product.image,
          description: product.description || '',
          badges: product.badges || [],
          in_stock: product.inStock !== false,
          rating: product.rating ? Number(product.rating) : 5.0,
          reviews_count: product.reviewsCount ? Number(product.reviewsCount) : 1,
          specs: product.specs || []
        };

        const upRes = await fetch(`${supabaseUrl}/rest/v1/products`, {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(row)
        });

        if (!upRes.ok) {
          const errTxt = await upRes.text().catch(() => '');
          return res.status(502).json({ error: 'Supabase update failed', details: errTxt });
        }

        return res.status(200).json({ success: true, provider: 'supabase', action: 'save_product', id: product.id });
      }

      // 2. Single product delete
      if (action === 'delete_product' && productId) {
        const delRes = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${encodeURIComponent(productId)}`, {
          method: 'DELETE',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          }
        });

        if (!delRes.ok) {
          const errTxt = await delRes.text().catch(() => '');
          return res.status(502).json({ error: 'Supabase delete failed', details: errTxt });
        }

        return res.status(200).json({ success: true, provider: 'supabase', action: 'delete_product', id: productId });
      }

      // 3. Save Review (Insert or Update in Supabase)
      if (action === 'save_review' && body.review) {
        const r = body.review;
        const row = {
          id: r.id,
          name: r.name,
          location: r.location || '',
          product: r.product || '',
          rating: parseInt(r.rating, 10) || 5,
          text: r.text,
          verified: r.verified !== false,
          status: r.status || 'approved',
          date: r.date || 'Recent'
        };

        const upRes = await fetch(`${supabaseUrl}/rest/v1/reviews`, {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(row)
        });

        if (!upRes.ok) {
          const errTxt = await upRes.text().catch(() => '');
          return res.status(502).json({ error: 'Supabase review save failed', details: errTxt });
        }

        return res.status(200).json({ success: true, provider: 'supabase', action: 'save_review', id: r.id });
      }

      // 4. Delete Review from Supabase
      if (action === 'delete_review' && body.reviewId) {
        const delRes = await fetch(`${supabaseUrl}/rest/v1/reviews?id=eq.${encodeURIComponent(body.reviewId)}`, {
          method: 'DELETE',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          }
        });

        if (!delRes.ok) {
          const errTxt = await delRes.text().catch(() => '');
          return res.status(502).json({ error: 'Supabase review delete failed', details: errTxt });
        }

        return res.status(200).json({ success: true, provider: 'supabase', action: 'delete_review', id: body.reviewId });
      }

      // 5. Admin: Fetch all reviews (both pending & approved)
      if (action === 'get_all_reviews_admin') {
        const getRes = await fetch(`${supabaseUrl}/rest/v1/reviews?select=*&order=created_at.desc`, {
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          }
        });
        if (!getRes.ok) {
          const errTxt = await getRes.text().catch(() => '');
          return res.status(502).json({ error: 'Failed to fetch reviews', details: errTxt });
        }
        const reviews = await getRes.json();
        return res.status(200).json({ success: true, reviews });
      }

      // 6. Save Category (Insert or Update in Supabase)
      if (action === 'save_category' && body.category) {
        const cat = body.category;
        const row = {
          id: cat.id,
          name: cat.name
        };

        const catRes = await fetch(`${supabaseUrl}/rest/v1/categories`, {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(row)
        });

        if (!catRes.ok) {
          const errTxt = await catRes.text().catch(() => '');
          return res.status(502).json({ error: 'Supabase category save failed', details: errTxt });
        }

        return res.status(200).json({ success: true, provider: 'supabase', action: 'save_category', id: cat.id });
      }

      // 7. Delete Category from Supabase
      if (action === 'delete_category' && body.categoryId) {
        const delCatRes = await fetch(`${supabaseUrl}/rest/v1/categories?id=eq.${encodeURIComponent(body.categoryId)}`, {
          method: 'DELETE',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          }
        });

        if (!delCatRes.ok) {
          const errTxt = await delCatRes.text().catch(() => '');
          return res.status(502).json({ error: 'Supabase category delete failed', details: errTxt });
        }

        return res.status(200).json({ success: true, provider: 'supabase', action: 'delete_category', id: body.categoryId });
      }

      // 6. Bulk products sync
      if (products && Array.isArray(products)) {
        const mapped = products.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: Number(p.price),
          original_price: p.originalPrice ? Number(p.originalPrice) : null,
          image: p.image,
          description: p.description || '',
          badges: p.badges || [],
          in_stock: p.inStock !== false,
          rating: p.rating ? Number(p.rating) : 5.0,
          reviews_count: p.reviewsCount ? Number(p.reviewsCount) : 1,
          specs: p.specs || []
        }));

        await fetch(`${supabaseUrl}/rest/v1/products`, {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(mapped)
        });

        return res.status(200).json({ success: true, provider: 'supabase', count: products.length });
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
