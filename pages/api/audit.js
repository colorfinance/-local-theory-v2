import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    // 1. SCRAPE (Using a free proxy-less approach for MVP speed)
    // Note: Some sites block raw fetch. In a full prod app we'd use Puppeteer or a Scrape API.
    const scrapeRes = await fetch(url.startsWith('http') ? url : `https://${url}`);
    const html = await scrapeRes.text();
    
    // Extract text and title (simple regex to keep it light)
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1] || url;
    const bodyText = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, '')
                         .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmi, '')
                         .replace(/<[^>]*>/g, ' ')
                         .slice(0, 10000); // Limit context for Gemini

    // 2. ANALYZE WITH GEMINI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert Digital Agency Auditor. Analyze the following website content and provide a professional audit.
    Website Title: ${title}
    Website Content Snippet: ${bodyText}

    Return ONLY a JSON object in this format:
    {
      "score": 0-100,
      "findings": [
        { "category": "SEO", "status": "success|warning|error", "title": "Brief title", "detail": "1-2 sentence explanation" },
        { "category": "Conversion", "status": "success|warning|error", "title": "Brief title", "detail": "1-2 sentence explanation" },
        { "category": "UX", "status": "success|warning|error", "title": "Brief title", "detail": "1-2 sentence explanation" }
      ]
    }
    Include exactly 5 high-value findings. Do not use markdown.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean JSON cleanup
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanJson);

    res.status(200).json(data);
  } catch (error) {
    console.error('Audit Engine Error:', error);
    res.status(500).json({ error: 'Analysis failed. Make sure the URL is public and valid.' });
  }
}
