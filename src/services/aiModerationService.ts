import config from '../utils/config';
import { CustomAPIError, CustomModerationAIError } from '../utils/customErrors';
import OpenAI from 'openai';

const OPEN_API_API_KEY = config.OPEN_AI_API_KEY;

if (!OPEN_API_API_KEY) {
  throw new CustomAPIError('OPEN_API_API_KEY is not defined');
}
type ReportReason =
  | 'SPAM'
  | 'ADVERTISING'
  | 'FRAUD'
  | 'FINANCIAL_MANIPULATION'
  | 'MISINFORMATION'
  | 'INAPPROPRIATE_CONTENT'
  | 'HARASSMENT'
  | 'OFF_TOPIC'
  | 'OTHER';

interface ModerationAIResponse {
  flagged: boolean;
  severity?: number;
}

const parseModerationAIResponse = (
  obj: unknown
): ModerationAIResponse | null => {
  if (typeof obj !== 'object' || obj === null) {
    return null;
  }

  if (!('flagged' in obj) || !('severity' in obj)) {
    return null;
  }

  if (typeof obj.flagged !== 'boolean' || typeof obj.severity !== 'number') {
    return null;
  }
  return {
    flagged: obj.flagged,
    severity: obj.severity,
  };
};

async function analyzeReportWithAI(
  content: string,
  reportReason: ReportReason
): Promise<{ flagged: boolean; severity?: number }> {
  const prompts: Record<ReportReason, string> = {
    SPAM: `Evaluate the content for spam. Does it include repetitive patterns, promotional links, or unsolicited advertisements?`,
    ADVERTISING: `Evaluate the content for advertising or promotional material. Does it promote services, products, or links without relevance?`,
    FRAUD: `Evaluate the content for fraudulent claims. Does it mislead users or promote financial scams?`,
    FINANCIAL_MANIPULATION: `Evaluate the content for financial manipulation. Does it attempt to manipulate financial decisions or the market?`,
    MISINFORMATION: `Evaluate the content for misinformation. Does it spread misleading, false, or unverified claims?`,
    INAPPROPRIATE_CONTENT: `Evaluate the content for inappropriate material. Does it contain offensive, explicit, or harmful language?`,
    HARASSMENT: `Evaluate the content for harassment. Does it contain abusive, threatening, or targeted language?`,
    OFF_TOPIC: `Evaluate the content for being off-topic. Is it unrelated to finance, business and economics fields?`,
    OTHER: `Evaluate the content for general moderation issues. Does it violate any community guidelines or standards?`,
  };
  console.log(CustomModerationAIError);
  const prompt = prompts[reportReason];

  const openai = new OpenAI({ apiKey: OPEN_API_API_KEY });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',

    messages: [
      {
        role: 'system',

        content: `You are a content moderation assistant. For every task, respond in JSON format with the following keys:
      - "flagged": a boolean (true if the content violates guidelines, false otherwise),
      - "severity": a number (0 for not flagged, 1 for low, 2 for medium, 3 for high).`,
      },
      { role: 'user', content: `Content: "${content}"\n\nTask: ${prompt}` },
    ],
  });

  if (!response || !response.choices[0].message) {
    throw new CustomModerationAIError('No response from OpenAI');
  }

  const result = response.choices[0].message.content;

  if (!result) {
    throw new CustomModerationAIError('No response from OpenAI');
  }

  const parsedResponse = parseModerationAIResponse(JSON.parse(result));

  if (!parsedResponse) {
    throw new CustomModerationAIError('Invalid response format from OpenAI');
  }

  return parsedResponse;
}

export default {
  analyzeReportWithAI,
};
