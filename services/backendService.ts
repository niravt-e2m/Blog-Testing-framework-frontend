import { EvaluationInput, EvaluationResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

type EvaluationRequestPayload = {
  blogTitle: string;
  blogText: string;
  blogOutline: string;
  toneOfVoice: {
    type: 'text' | 'file';
    content: string;
    fileName?: string;
  };
  references: { id: string; type: 'link' | 'text'; content: string }[];
  targetAudience: string;
};

export const evaluateContent = async (input: EvaluationInput): Promise<EvaluationResult> => {
  const payload: EvaluationRequestPayload = {
    blogTitle: input.blogTitle,
    blogText: input.blogText,
    blogOutline: input.blogOutline,
    toneOfVoice: input.toneOfVoice,
    references: input.references,
    targetAudience: input.targetAudience,
  };

  const response = await fetch(`${API_BASE_URL}/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<EvaluationResult>;
};
