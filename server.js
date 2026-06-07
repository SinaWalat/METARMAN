import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Resolve dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API endpoint for form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Configure transporter using SMTP settings from environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: 'booking@metarman.com',
      subject: `New Booking/Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="border-bottom: 2px solid #000; padding-bottom: 10px; text-transform: uppercase;">New Booking/Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message / Details:</strong></p>
          <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 4px; line-height: 1.6;">${message}</p>
        </div>
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send message. Please check server SMTP configuration.' });
  }
});

// API endpoint for fetching Google Drive press images
app.get('/api/press-images', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

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

    res.status(200).json(images);
  } catch (error) {
    console.error('Google Drive fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch images from Google Drive' });
  }
});

// API endpoint to proxy Google Drive images to avoid browser hotlinking/CORS blocks
app.get('/api/image-proxy', async (req, res) => {
  const fileId = req.query.id;
  const width = req.query.width || '800';

  if (!fileId) {
    return res.status(400).send('File ID is required');
  }

  try {
    const googleUrl = `https://lh3.googleusercontent.com/d/${fileId}=w${width}`;
    const response = await fetch(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch image from Google');
    }

    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');

    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('Local image proxy error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Serve Vite build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
