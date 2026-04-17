const IMAGE_KEYS = ['image_url', 'image_url2', 'image_url3', 'image_url4'];

function normalizeAssetPath(url) {
  if (url == null || typeof url !== 'string') return url;
  const u = url.trim();
  if (u.startsWith('../assets/')) return u.replace(/^\.\.\/assets\//, '/assets/');
  if (u.startsWith('assets/')) return `/${u}`;
  return u;
}

function normalizeProductRow(row) {
  if (!row || typeof row !== 'object') return row;
  const out = { ...row };
  for (const key of IMAGE_KEYS) {
    if (key in out) out[key] = normalizeAssetPath(out[key]);
  }
  return out;
}

function normalizeProductRows(rows) {
  if (!Array.isArray(rows)) return rows;
  return rows.map(normalizeProductRow);
}

module.exports = { normalizeAssetPath, normalizeProductRow, normalizeProductRows };
