import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Create axios instance that ignores SSL certificate errors
    const client = axios.create({
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false
      }),
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    // Fetch the BCV website
    const response = await client.get('https://www.bcv.org.ve');
    const html = response.data;

    // Load HTML into cheerio
    const $ = cheerio.load(html);

    // Try to find the USD rate - common selectors for BCV website
    let rate = null;

    // Try multiple possible selectors
    const selectors = [
      '#dolar strong', // Common BCV selector
      '#dolar .field-item',
      '.field-name-field-tasa-dolar .field-item',
      'div:contains("USD") + div strong',
      '.exchange-rate-usd',
      '[data-currency="USD"] .rate-value'
      // Look for text containing dollar and numbers
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = element.text().trim();
        // Extract number from text like "35,45 Bs." or "35.45"
        const match = text
          .replace(/\./g, '')
          .replace(/,/g, '.')
          .match(/(\d+\.?\d*)/);
        if (match) {
          rate = parseFloat(match[1]);
          break;
        }
      }
    }

    // If no selector worked, try searching the entire page for dollar patterns
    if (!rate) {
      const bodyText = $('body').text();
      // Look for patterns like "USD: 35,45" or "Dólar: 35.45"
      const patterns = [/USD[\s:]*(\d+[,.]?\d*)/i, /Dólar[\s:]*(\d+[,.]?\d*)/i, /Dolar[\s:]*(\d+[,.]?\d*)/i, /(\d+[,.]\d+)\s*Bs\.?\s*\/\s*USD/i];

      for (const pattern of patterns) {
        const match = bodyText.match(pattern);
        if (match) {
          const rawRate = match[1].replace(/\./g, '').replace(/,/g, '.');
          rate = parseFloat(rawRate);
          break;
        }
      }
    }

    if (rate && !isNaN(rate) && rate > 0) {
      res.status(200).json({
        dollar: rate,
        date: new Date().toISOString().split('T')[0],
        source: 'bcv.org.ve'
      });
    } else {
      throw new Error('Could not extract rate from BCV website');
    }
  } catch (error) {
    console.error('BCV Scraping error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch BCV rate',
      details: error.message
    });
  }
}
