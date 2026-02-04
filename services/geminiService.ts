
import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationResult, Severity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function evaluateContent(
  content: string, 
  reference?: string
): Promise<EvaluationResult> {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are an expert senior editorial director and brand voice consultant. 
    Your task is to evaluate the provided content for quality, tone of voice, and brand alignment.
    
    If a reference content is provided, compare the main content strictly against the tone, vocabulary, and stylistic choices of the reference.
    
    You must return a structured JSON evaluation including:
    1. An overall quality score (1-100).
    2. Tone alignment percentage (0-100).
    3. Metrics: Clarity, Engagement, Structural Integrity, and Professionalism (each 1-10).
    4. Flags: Identify specific issues like passive voice, factual ambiguity, overly "AI-sounding" phrases, or tone mismatches.
    5. AI Likelihood: Estimated percentage of AI involvement.
    
    Be critical and professional. Use the following severity levels for flags: LOW, MEDIUM, HIGH.
  `;

  const prompt = `
    ${reference ? `REFERENCE BRAND VOICE CONTENT:\n"""\n${reference}\n"""\n\n` : ''}
    CONTENT TO EVALUATE:
    """
    ${content}
    """
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            toneAlignment: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            aiLikelihood: { type: Type.NUMBER },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  explanation: { type: Type.STRING }
                },
                required: ["label", "score", "explanation"]
              }
            },
            flags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  message: { type: Type.STRING },
                  severity: { type: Type.STRING, description: "LOW, MEDIUM, or HIGH" }
                },
                required: ["type", "message", "severity"]
              }
            },
            suggestedChanges: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["overallScore", "toneAlignment", "summary", "metrics", "flags", "suggestedChanges", "aiLikelihood"]
        }
      }
    });

    const resultStr = response.text;
    if (!resultStr) throw new Error("No response from AI");
    
    const parsed = JSON.parse(resultStr) as EvaluationResult;
    return parsed;
  } catch (error) {
    console.error("Evaluation Error:", error);
    throw error;
  }
}
