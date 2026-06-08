import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { CLASSIFICATION_PROMPT } from '../prompts/classify.js';
import { buildExtractionPrompt } from '../prompts/extract.js';
import type { DocumentType, ExtractedFields } from '../types/extraction.js';

export type LlmProvider = 'anthropic' | 'openai' | 'mock';

export interface ClassificationResponse {
  document_type: DocumentType;
  confidence: number;
  reasoning?: string;
}

export interface ExtractionResponse {
  fields: ExtractedFields;
}

function getProvider(): LlmProvider {
  const provider = (process.env.LLM_PROVIDER ?? 'mock').toLowerCase();
  if (provider === 'anthropic' || provider === 'openai' || provider === 'mock') {
    return provider;
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return 'anthropic';
  }

  if (process.env.OPENAI_API_KEY) {
    return 'openai';
  }

  return 'mock';
}

function getMediaType(filePath: string): string {
  const ext = extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.pdf') return 'application/pdf';
  return 'image/png';
}

export async function loadDocumentAsBase64(filePath: string): Promise<{
  base64: string;
  mediaType: string;
}> {
  const buffer = await readFile(filePath);
  return {
    base64: buffer.toString('base64'),
    mediaType: getMediaType(filePath),
  };
}

function parseJsonFromModel<T>(text: string): T {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenceMatch ? fenceMatch[1].trim() : trimmed;

  try {
    return JSON.parse(jsonText) as T;
  } catch {
    const start = jsonText.indexOf('{');
    const end = jsonText.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(jsonText.slice(start, end + 1)) as T;
    }

    throw new Error(`Failed to parse model JSON: ${text.slice(0, 200)}`);
  }
}

async function callAnthropic(
  prompt: string,
  base64: string,
  mediaType: string,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }

  const model = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514';

  const imageContent =
    mediaType === 'application/pdf'
      ? []
      : [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64,
            },
          },
        ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContent,
            { type: 'text', text: prompt },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text?: string }>;
  };

  const textBlock = data.content.find((block) => block.type === 'text');
  if (!textBlock?.text) {
    throw new Error('Anthropic response missing text content');
  }

  return textBlock.text;
}

async function callOpenAI(
  prompt: string,
  base64: string,
  mediaType: string,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const model = process.env.OPENAI_MODEL ?? 'gpt-4o';

  const imageUrl =
    mediaType === 'application/pdf'
      ? undefined
      : `data:${mediaType};base64,${base64}`;

  const content: Array<Record<string, unknown>> = [{ type: 'text', text: prompt }];
  if (imageUrl) {
    content.unshift({ type: 'image_url', image_url: { url: imageUrl } });
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [{ role: 'user', content }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  return data.choices[0]?.message?.content ?? '';
}

async function callVisionModel(
  prompt: string,
  filePath: string,
): Promise<string> {
  const provider = getProvider();
  const { base64, mediaType } = await loadDocumentAsBase64(filePath);

  if (provider === 'anthropic') {
    return callAnthropic(prompt, base64, mediaType);
  }

  if (provider === 'openai') {
    return callOpenAI(prompt, base64, mediaType);
  }

  throw new Error(
    'LLM_PROVIDER=mock cannot call vision API. Set LLM_PROVIDER=anthropic or openai with an API key.',
  );
}

export async function classifyDocument(filePath: string): Promise<{
  result: ClassificationResponse;
  raw: string;
  provider: LlmProvider;
}> {
  const provider = getProvider();
  const raw = await callVisionModel(CLASSIFICATION_PROMPT, filePath);
  const result = parseJsonFromModel<ClassificationResponse>(raw);
  return { result, raw, provider };
}

export async function extractFields(
  filePath: string,
  documentType: DocumentType,
): Promise<{ result: ExtractionResponse; raw: string; provider: LlmProvider }> {
  const provider = getProvider();
  const prompt = buildExtractionPrompt(documentType);
  const raw = await callVisionModel(prompt, filePath);
  const parsed = parseJsonFromModel<ExtractionResponse | { fields: ExtractedFields }>(raw);

  const fields =
    'fields' in parsed && parsed.fields
      ? parsed.fields
      : (parsed as unknown as ExtractedFields);

  return { result: { fields }, raw, provider };
}

export function resolveProvider(): LlmProvider {
  return getProvider();
}
