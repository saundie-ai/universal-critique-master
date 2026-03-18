'use server';
/**
 * @fileOverview A Genkit flow for generating a comprehensive photo critique.
 *
 * - critiquePhoto - A function that handles the photo critique process.
 * - CritiquePhotoInput - The input type for the critiquePhoto function.
 * - CritiquePhotoOutput - The return type for the critiquePhoto function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Input Schema
const CritiquePhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a photograph, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  title: z.string().optional().describe('The title of the photograph.'),
  photographer: z.string().optional().describe('The name of the photographer.'),
  userContext: z
    .string()
    .optional()
    .describe(
      'Additional context, intent, or specific areas the photographer wants feedback on.'
    ),
  exifData: z
    .string()
    .optional()
    .describe('Extracted EXIF data from the photograph.'),
  apiKey: z.string().optional().describe('The user-provided Google Gemini API key.'),
});
export type CritiquePhotoInput = z.infer<typeof CritiquePhotoInputSchema>;

// Output Schema
const CritiqueItemSchema = z.object({
  criterion: z.string().describe('The criterion being evaluated.'),
  score:
    z.number().min(0).max(10).describe('Score for the criterion out of 10.'),
  commentary: z.string().describe('Detailed commentary for the criterion.'),
});

const PostProductionRecommendationsSchema = z.object({
  cropping: z.string().describe('Recommendations for cropping and geometry.'),
  globalAdjustments:
    z.string().describe('Recommendations for global adjustments (e.g., exposure, contrast).'),
  localAdjustments:
    z.string().describe('Recommendations for local adjustments (e.g., dodging, burning, masking).'),
  colorGrading: z.string().describe('Recommendations for color grading and white balance.'),
  retouching:
    z.string().describe('Recommendations for retouching and blemish removal.'),
});

const CritiquePhotoOutputSchema = z.object({
  technicalMerit:
    z.array(CritiqueItemSchema).describe('Detailed analysis of technical aspects.'),
  artisticMerit:
    z.array(CritiqueItemSchema).describe('Detailed analysis of artistic aspects.'),
  postProduction: PostProductionRecommendationsSchema.describe(
    'Specific post-production recommendations.'
  ),
  technicalAverage:
    z.number().min(0).max(10).describe('Average score for technical criteria.'),
  artisticAverage:
    z.number().min(0).max(10).describe('Average score for artistic criteria.'),
  totalAverage:
    z.number().min(0).max(10).describe('Overall average score for the photograph.'),
  closingRemarks:
    z.string().describe('Overall closing remarks and summary of the critique.'),
});
export type CritiquePhotoOutput = z.infer<typeof CritiquePhotoOutputSchema>;

// Schema for the prompt itself, excluding the API key.
const PromptInputSchema = CritiquePhotoInputSchema.omit({ apiKey: true });

// Prompt Definition as a template string
const promptTemplate = `You are the 'Universal Critique Master', a professional, highly analytical photography critic.\nYour Task: Analyze the uploaded image against 8 distinct criteria (4 Technical, 4 Artistic) and provide a structured JSON critique.\n\nCRITIQUE CRITERIA & JSON KEYS:\n1. Technical Merit (Key: "technicalMerit")\n- A. Sharpness & Focus\n- B. Exposure & Dynamics\n- C. Composition & Framing\n- D. Depth of Field & Clarity\n\n2. Artistic Merit (Key: "artisticMerit")\n- E. Emotional Impact\n- F. Storytelling & Narrative\n- G. Originality & Creativity\n- H. Colour Harmony & Tone\n\n3. Post-Production Recommendations (Key: "postProduction")\nProvide specific advice for editing software.\n- cropping\n- globalAdjustments\n- localAdjustments\n- colorGrading\n- retouching\n\nCalculations (Keys: "technicalAverage", "artisticAverage", "totalAverage")\n- Score each criterion out of 10.\n- Calculate the averages precisely.\n\nOUTPUT FORMAT:\nYou MUST return valid JSON. Ensure the root object contains "technicalMerit", "artisticMerit", "postProduction", "technicalAverage", "artisticAverage", "totalAverage", and "closingRemarks".\n\nPlease analyze this image using the Universal Critique Master framework.\n\nMETADATA:\n{{#if title}}- Title: {{{title}}}{{/if}}\n{{#if photographer}}- Photographer: {{{photographer}}}{{/if}}\n{{#if exifData}}- EXIF Data: {{{exifData}}}{{/if}}\n{{#if userContext}}\nIMPORTANT CONTEXT FROM PHOTOGRAPHER:\n"{{{userContext}}}"\nPlease consider this intent when critiquing (e.g., if blur is intentional).\n{{/if}}\n\nImage to critique: {{media url=photoDataUri}}\n\nReturn the response in strict JSON format.`;


// Flow Definition
const critiquePhotoFlow = ai.defineFlow(
  {
    name: 'critiquePhotoFlow',
    inputSchema: CritiquePhotoInputSchema,
    outputSchema: CritiquePhotoOutputSchema,
  },
  async (input) => {
    const { apiKey, ...promptInput } = input;
    
    // Use default AI instance if no key provided (it will use the .env variable)
    let activeAI = ai;
    
    if (apiKey) {
      activeAI = genkit({
        plugins: [googleAI({ apiKey })],
        // The model must match the one in `src/ai/genkit.ts`
        model: 'googleai/gemini-2.5-flash',
      });
    }

    const critiquePhotoPrompt = activeAI.definePrompt({
        name: 'critiquePhotoDynamicPrompt',
        input: { schema: PromptInputSchema },
        output: { schema: CritiquePhotoOutputSchema },
        prompt: promptTemplate,
    });

    const { output } = await critiquePhotoPrompt(promptInput);
    if (!output) {
      throw new Error('Failed to generate critique: output is null or undefined.');
    }
    return output;
  }
);

// Wrapper function
export async function critiquePhoto(
  input: CritiquePhotoInput
): Promise<CritiquePhotoOutput> {
  return critiquePhotoFlow(input);
}
