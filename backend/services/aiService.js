const CATEGORIES = [
  'Pothole',
  'Streetlight',
  'Drainage',
  'Road Damage',
  'Unsafe Area',
  'Other',
];

const SEVERITIES = ['Low', 'Medium', 'High'];

const SYSTEM_PROMPT = `You are an AI Triage Assistant for "Mithuru Mawatha", a community road safety and hazard reporting app in Sri Lanka.
Read the user's citizen report description and perform automated classification.

Strict Requirements:
1. "suggestedUrgency": Must be exactly one of: ["Low", "Medium", "High"].
2. "suggestedCategory": Must be exactly one of: ["Pothole", "Streetlight", "Drainage", "Road Damage", "Unsafe Area", "Other"].
3. "summary": Exactly one clean, objective, single-sentence summary of the hazard or safety concern.

Return ONLY a raw JSON object with these three keys. No markdown formatting, no code blocks, no extra text.`;

/**
 * Heuristic fallback classifier when API key is missing or AI request fails.
 * Guarantees that the app always returns a sensible classification.
 */
function fallbackAnalyze(description) {
  const text = description.toLowerCase();

  let category = 'Other';
  if (text.includes('pothole') || text.includes('hole') || text.includes('crater')) {
    category = 'Pothole';
  } else if (text.includes('light') || text.includes('dark') || text.includes('lamp') || text.includes('bulb')) {
    if (text.includes('unsafe') || text.includes('dark') || text.includes('isolated')) {
      category = 'Unsafe Area';
    } else {
      category = 'Streetlight';
    }
  } else if (text.includes('drain') || text.includes('flood') || text.includes('water') || text.includes('overflow')) {
    category = 'Drainage';
  } else if (text.includes('damage') || text.includes('edge') || text.includes('bridge') || text.includes('pavement') || text.includes('manhole')) {
    category = 'Road Damage';
  } else if (text.includes('unsafe') || text.includes('harass') || text.includes('scared') || text.includes('stalk') || text.includes('night')) {
    category = 'Unsafe Area';
  }

  let urgency = 'Medium';
  if (
    text.includes('deep') ||
    text.includes('accident') ||
    text.includes('bus') ||
    text.includes('night') ||
    text.includes('danger') ||
    text.includes('urgent') ||
    text.includes('dark') ||
    text.includes('collapse')
  ) {
    urgency = 'High';
  } else if (text.includes('minor') || text.includes('small') || text.includes('slow')) {
    urgency = 'Low';
  }

  const firstSentence = description.split('.')[0].trim();
  const summary = firstSentence.length > 5
    ? `${firstSentence}.`
    : `Reported issue regarding ${category.toLowerCase()} condition.`;

  return {
    suggestedUrgency: urgency,
    suggestedCategory: category,
    summary,
  };
}

/**
 * Primary AI analysis entry point.
 * Sends description to AI model (Gemini or OpenAI if configured) via a single fetch API call,
 * with graceful fallback handling if response is invalid or key is not provided.
 */
async function analyzeReportDescription(description) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.log('[aiService] No API key found in environment. Using fallback triage parser.');
    return fallbackAnalyze(description);
  }

  try {
    let rawText = '';

    if (process.env.GEMINI_API_KEY) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${SYSTEM_PROMPT}\n\nReport Description to analyze:\n"${description}"` },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Gemini API HTTP error ${response.status}`);
      }

      const data = await response.json();
      rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } else if (process.env.OPENAI_API_KEY) {
      const url = 'https://api.openai.com/v1/chat/completions';
      const payload = {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: description },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API HTTP error ${response.status}`);
      }

      const data = await response.json();
      rawText = data.choices?.[0]?.message?.content || '';
    }

    // Clean any accidental markdown wrap
    const jsonString = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    const parsed = JSON.parse(jsonString);

    const suggestedUrgency = SEVERITIES.includes(parsed.suggestedUrgency)
      ? parsed.suggestedUrgency
      : 'Medium';

    const suggestedCategory = CATEGORIES.includes(parsed.suggestedCategory)
      ? parsed.suggestedCategory
      : 'Other';

    const summary = typeof parsed.summary === 'string' && parsed.summary.trim()
      ? parsed.summary.trim()
      : fallbackAnalyze(description).summary;

    return {
      suggestedUrgency,
      suggestedCategory,
      summary,
    };
  } catch (err) {
    console.warn('[aiService] AI parsing/network error. Falling back safely:', err.message);
    return fallbackAnalyze(description);
  }
}

module.exports = {
  analyzeReportDescription,
  fallbackAnalyze,
  SYSTEM_PROMPT,
};
