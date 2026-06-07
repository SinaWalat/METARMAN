export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const folderId = '1uJ-YNrC8Gdm4-ugiBHmP-vF5IisV8D26';
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;

  try {
    // 1. Try keyless public scraping method first
    const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}`;
    const response = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (response.ok) {
      const html = await response.text();
      const entryRegex = /<div class="flip-entry"\s+id="entry-([^"]+)"[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>/g;
      let match;
      const images = [];

      while ((match = entryRegex.exec(html)) !== null) {
        const id = match[1];
        const name = match[2];

        // Find the thumbnail source within the entry block
        const entryStartIndex = html.indexOf(`id="entry-${id}"`);
        const nextEntryIndex = html.indexOf('class="flip-entry"', entryStartIndex + 20);
        const searchBlock = html.substring(entryStartIndex, nextEntryIndex > 0 ? nextEntryIndex : html.length);

        const thumbMatch = searchBlock.match(/class="flip-entry-thumb"><img src="([^"]+)"/);
        const thumbUrl = thumbMatch ? thumbMatch[1].replace(/&amp;/g, '&') : null;

        images.push({
          id,
          name,
          thumbUrl,
          src: `https://lh3.googleusercontent.com/d/${id}`,
          size: 'High-Res Asset'
        });
      }

      if (images.length > 0) {
        return res.status(200).json(images);
      }
    }
  } catch (scrapingError) {
    console.warn('Keyless Google Drive scraping failed, trying API key...', scrapingError);
  }

  // 2. Fallback to official Google Drive API if key is available
  if (!apiKey) {
    return res.status(400).json({ error: 'Google Drive API Key not configured and keyless fetch failed' });
  }

  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&key=${apiKey}&fields=files(id,name,size)`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const images = data.files.map(file => ({
      id: file.id,
      name: file.name,
      src: `https://lh3.googleusercontent.com/d/${file.id}`,
      size: file.size ? `${(parseInt(file.size, 10) / (1024 * 1024)).toFixed(1)} MB` : 'High-Res Asset',
    }));

    return res.status(200).json(images);
  } catch (error) {
    console.error('Google Drive fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch images from Google Drive' });
  }
}
